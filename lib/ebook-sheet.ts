import type { EbookEnv } from './ebook';

type Config = { spreadsheetId: string; sheetId: number; clientEmail: string; privateKey: string; privateKeyId: string };
type Job = { request_id: string; first_name: string; email: string; requested_at: number; attempts: number; marker_id: number; row_fingerprint: string | null };
type Marker = { metadataKey: string; metadataValue: string; location?: { dimensionRange?: { sheetId?: number; dimension?: string; startIndex?: number; endIndex?: number } } };
type Match = { kind: 'absent' | 'collision' } | { kind: 'ours'; rowIndex: number };
const retention = 90 * 86400;
const tokenUrl = 'https://oauth2.googleapis.com/token';
const nowSeconds = () => Math.floor(Date.now() / 1000);
const b64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
const jwtPart = (value: object) => b64(new TextEncoder().encode(JSON.stringify(value)));
const randomId = () => (crypto.getRandomValues(new Uint32Array(1))[0] & 0x7fffffff) || 1;
const markerKey = 'ebook';
const markerValue = (id: string) => id.slice(-12);
const valuesFor = (job: Job) => [job.first_name, job.email, new Date(job.requested_at * 1000).toISOString()];
const fingerprint = async (id: string, cells: string[]) => b64(new Uint8Array(
  await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify([id, ...cells])))));

class SheetError extends Error {
  readonly status: number;
  constructor(status: number) { super(`Sheets HTTP ${status}`); this.status = status; }
}

/** Server-only, fixed Google endpoints. Never send credentials on a redirect. */
export function sheetClient(rawConfig: string, send: typeof fetch = fetch) {
  const c: Config = JSON.parse(rawConfig);
  if (typeof c.spreadsheetId !== 'string' || !/^[\w-]+$/.test(c.spreadsheetId) || !Number.isSafeInteger(c.sheetId) || c.sheetId < 0 ||
      !c.clientEmail?.endsWith('.iam.gserviceaccount.com') || !c.privateKey?.includes('BEGIN PRIVATE KEY')) throw Error('Sheet config');
  const base = 'https://sheets.googleapis.com/v4/spreadsheets/' + c.spreadsheetId;
  let token: string | undefined;
  async function access() {
    if (token) return token;
    const now = nowSeconds();
    const input = jwtPart({ alg: 'RS256', typ: 'JWT', kid: c.privateKeyId }) + '.' + jwtPart({
      iss: c.clientEmail, scope: 'https://www.googleapis.com/auth/spreadsheets', aud: tokenUrl, iat: now, exp: now + 600,
    });
    const der = Uint8Array.from(atob(c.privateKey.replace(/-----[^-]+-----|\s/g, '')), x => x.charCodeAt(0));
    const key = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(input));
    const r = await send(tokenUrl, {
      method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(7000),
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: input + '.' + b64(new Uint8Array(sig)) }),
    });
    if (!r.ok) throw new SheetError(r.status);
    const result = await r.json() as { access_token?: string };
    if (!result.access_token) throw Error('Sheet auth');
    return token = result.access_token;
  }
  async function call<T>(path: string, body?: object): Promise<T> {
    const r = await send(base + path, {
      headers: { authorization: 'Bearer ' + await access(), 'content-type': 'application/json' },
      method: body ? 'POST' : 'GET', body: body ? JSON.stringify(body) : undefined,
      redirect: 'manual', signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) throw new SheetError(r.status);
    return await r.json() as T;
  }
  const sheetId = c.sheetId;
  const header = { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 3 };
  type Grid = { startColumn?: number; rowData?: { values?: { effectiveValue?: { stringValue?: string; numberValue?: number } }[] }[] };
  async function layout(withDates: boolean) {
    // Read the three headings and, only when adding, the date column. Other
    // subscribers' names and addresses are not read to locate the end of the list.
    const ranges = withDates ? [header, { sheetId, startColumnIndex: 2, endColumnIndex: 3 }] : [header];
    const result = await call<{ sheets: { properties: {sheetId?: number; gridProperties: {rowCount: number}}, data: Grid[] }[] }>(
      ':getByDataFilter?fields=sheets(properties(sheetId,gridProperties(rowCount)),data(startColumn,rowData(values(effectiveValue))))',
      { dataFilters: ranges.map(gridRange => ({gridRange})), includeGridData: true });
    const tab = result.sheets.find(s => (s.properties.sheetId ?? 0) === sheetId);
    const names = tab?.data.find(g => !g.startColumn)?.rowData?.[0]?.values?.map(v => v.effectiveValue?.stringValue);
    if (!tab || names?.join('|') !== 'Prénom|Mail|Date') throw Error('Sheet columns changed');
    const dates = tab.data.find(g => g.startColumn === 2)?.rowData;
    if (withDates && !dates?.length) throw Error('Sheet dates unavailable');
    const after = (dates ?? []).reduce((end, row, i) => row.values?.[0]?.effectiveValue ? i + 1 : end, 1);
    return { after, rowCount: tab.properties.gridProperties.rowCount };
  }
  async function lookup(job: Job): Promise<Match> {
    const found = await call<{ matchedDeveloperMetadata?: {developerMetadata: Marker}[] }>('/developerMetadata:search', {
      dataFilters: [{developerMetadataLookup: {metadataId: job.marker_id}}],
    });
    const m = found.matchedDeveloperMetadata?.[0]?.developerMetadata;
    if (!m) return {kind:'absent'};
    const row = m.location?.dimensionRange;
    if (m.metadataKey === markerKey && m.metadataValue === markerValue(job.request_id) && row?.dimension === 'ROWS' &&
      (row.sheetId ?? 0) === sheetId && row.startIndex && row.endIndex === row.startIndex + 1) return {kind:'ours', rowIndex:row.startIndex};
    return {kind:'collision'};
  }
  async function append(job: Job) {
    const {after, rowCount} = await layout(true);
    const range = { sheetId, dimension: 'ROWS', startIndex: after, endIndex: after + 1 };
    const row = valuesFor(job);
    // A single atomic batch inserts a new row (never overwrites existing cells)
    // and a unique row marker. Replaying the batch cannot insert a duplicate.
    await call(':batchUpdate', { requests: [
      ...(after >= rowCount ? [{appendDimension:{sheetId, dimension:'ROWS', length:1}}] : []),
      { insertDimension: { range, inheritFromBefore: true } },
      { updateCells: { start: {sheetId, rowIndex: after, columnIndex: 0}, fields: 'userEnteredValue',
        rows: [{ values: row.map(stringValue => ({userEnteredValue:{stringValue}})) }] } },
      { createDeveloperMetadata: { developerMetadata: {metadataId: job.marker_id, metadataKey: markerKey,
        metadataValue: markerValue(job.request_id), visibility:'DOCUMENT', location:{dimensionRange:range}} } },
    ] });
  }
  async function expire(job: Job, rowIndex: number) {
    await layout(false);
    const dataFilter = { developerMetadataLookup: {metadataId: job.marker_id, metadataKey: markerKey, metadataValue: markerValue(job.request_id)} };
    // A manual sort or edit can replace the cells underneath the marker. Only
    // clear an exact match for the three literals originally written by us.
    const gridRange = { ...header, startRowIndex: rowIndex, endRowIndex: rowIndex + 1 };
    const current = await call<{sheets: {data: {rowData?: {values?: {userEnteredValue?: {stringValue?: string}}[]}[]}[]}[]}>(
      ':getByDataFilter?fields=sheets(data(rowData(values(userEnteredValue))))', {dataFilters:[{gridRange}]});
    const grid = current.sheets?.[0]?.data?.[0];
    if (!grid) throw Error('Sheet row unavailable');
    const raw = grid.rowData?.[0]?.values ?? [];
    const cells = [0,1,2].map(i => raw[i]?.userEnteredValue ? raw[i].userEnteredValue!.stringValue : '');
    if (cells.some(value => value !== '')) {
      if (!cells.every((v): v is string => typeof v === 'string') || await fingerprint(job.request_id, cells) !== job.row_fingerprint)
        throw Error('Sheet row edited');
      // The filter follows the tagged row if rows were inserted in the meantime.
      await call('/values:batchUpdateByDataFilter', { valueInputOption:'RAW', data:[{dataFilter,values:[['','','']]}] });
    }
    await call(':batchUpdate', { requests:[{deleteDeveloperMetadata:{dataFilter}}] });
  }
  return { lookup, append, expire, checkLayout: () => layout(true) };
}

async function processRow(env: EbookEnv, id: string, client: ReturnType<typeof sheetClient>, now: number) {
  const db = env.EBOOK_DB;
  const job = await db.prepare(`UPDATE ebook_sheet_outbox SET marker_id=coalesce(marker_id,?), next_attempt=?, attempts=attempts+1
    WHERE request_id=? AND next_attempt<=? RETURNING request_id,first_name,email,requested_at,attempts,marker_id,row_fingerprint`)
    .bind(randomId(), now + 600, id, now).first<Job>();
  if (!job) return;
  try {
    const state = await client.lookup(job);
    if (job.requested_at + retention <= now) {
      if (state.kind === 'ours') await client.expire(job, state.rowIndex);
      await db.prepare('DELETE FROM ebook_sheet_outbox WHERE request_id=? AND marker_id=?').bind(id, job.marker_id).run();
    } else if (state.kind === 'collision') {
      // This metadata belongs to someone else; never overwrite or remove it.
      await db.prepare('UPDATE ebook_sheet_outbox SET marker_id=NULL,next_attempt=? WHERE request_id=? AND marker_id=?')
        .bind(now + 600, id, job.marker_id).run();
    } else {
      if (state.kind === 'absent') {
        if (!job.row_fingerprint) await db.prepare('UPDATE ebook_sheet_outbox SET row_fingerprint=? WHERE request_id=? AND marker_id=?')
          .bind(await fingerprint(id, valuesFor(job)), id, job.marker_id).run();
        await client.append(job);
      }
      await db.prepare(`UPDATE ebook_sheet_outbox SET synced_at=?,email='',first_name='',attempts=0,next_attempt=?
        WHERE request_id=? AND marker_id=?`).bind(now, job.requested_at + retention, id, job.marker_id).run();
    }
  } catch (e) {
    await db.prepare('UPDATE ebook_sheet_outbox SET next_attempt=? WHERE request_id=? AND marker_id=? AND attempts=?')
      .bind(now + Math.min(21600, 600 * 2 ** Math.min(job.attempts - 1, 6)), id, job.marker_id, job.attempts).run();
    console.warn('Ebook Sheet pending', e instanceof SheetError ? e.status : e instanceof Error && e.message === 'Sheet row edited' ? 'edited row' : 'unavailable');
  }
}

export async function syncCaptured(env: EbookEnv, id: string) {
  if (env.EBOOK_SHEETS_CONFIG) await processRow(env, id, sheetClient(env.EBOOK_SHEETS_CONFIG), nowSeconds());
}

export async function maintainSheet(env: EbookEnv, send: typeof fetch = fetch, now = nowSeconds()) {
  const db = env.EBOOK_DB;
  await db.prepare(`UPDATE ebook_sheet_outbox SET email='',first_name='' WHERE requested_at<=? AND (email<>'' OR first_name<>'')`)
    .bind(now - retention).run();
  if (!env.EBOOK_SHEETS_CONFIG) return;
  const { results } = await db.prepare(`SELECT request_id FROM ebook_sheet_outbox WHERE next_attempt<=?
    ORDER BY next_attempt,requested_at LIMIT 4`).bind(now).all<{request_id:string}>();
  if (!results.length) return;
  const client = sheetClient(env.EBOOK_SHEETS_CONFIG, send);
  for (const row of results) await processRow(env, row.request_id, client, now);
}
