// This database belongs only to Jordan. No public endpoint reads subscriber data.
type Input = string | number | null;
type Statement = {
  bind(...args: Input[]): Statement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
};
export type EbookEnv = {
  EBOOK_DB: { prepare(sql: string): Statement };
  EBOOK_URL: string;
  RESEND_API_KEY: string;
};
type Delivery = { email: string; first_name: string; ebook_url: string; request_id: string; attempts: number };
const day = 86400;
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const reply = (status: number) => Response.json(status === 200 ? { ok: true } : {
  ok: false, error: status === 400 ? 'Demande invalide.' : 'Envoi temporairement indisponible.',
}, { status, headers: { 'cache-control': 'no-store' } });

async function deliver(env: EbookEnv, id: string, now: number, send: typeof fetch) {
  // A lease avoids concurrent sends. A retry after a lost response uses the same
  // provider idempotency key and identical payload, within Resend's 24-hour window.
  const row = await env.EBOOK_DB.prepare(`UPDATE ebook_requests
    SET attempts=attempts+1, next_attempt=?
    WHERE request_id=? AND sent_at IS NULL AND next_attempt<=? AND attempts<7 AND requested_at>?
    RETURNING email, first_name, ebook_url, request_id, attempts`)
    .bind(now + 120, id, now, now - day + 600).first<Delivery>();
  if (!row) {
    const state = await env.EBOOK_DB.prepare('SELECT sent_at FROM ebook_requests WHERE request_id=?').bind(id).first<{sent_at:number|null}>();
    return state?.sent_at != null;
  }
  const payload = {
    from: 'Jordan <jordan@the-body-healer.com>', to: row.email, subject: 'Ton e-book — The Body Healer',
    html: `<p>Bonjour ${escape(row.first_name)},</p>
             <p>Merci pour ton inscription — tu peux télécharger ton e‑book ici :</p>
             <p><a href="${escape(row.ebook_url)}" target="_blank" rel="noopener noreferrer">Télécharger l'e‑book The Body Healer (PDF)</a></p>
             <p>Si tu n'as pas demandé cet e‑mail, ignore ce message.</p>
             <p>Avec bienveillance,<br/>Jordan</p>`,
  };
  let status = 0;
  try {
    const result = await send('https://api.resend.com/emails', {
      // workerd accepts "manual" or "follow", not "error". Never forward the
      // authorization header to a redirect target; only a 2xx is acceptance.
      method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(12000),
      headers: { 'Content-Type':'application/json', Authorization:`Bearer ${env.RESEND_API_KEY}`, 'Idempotency-Key':`ebook/${row.request_id}` },
      body: JSON.stringify(payload),
    });
    status = result.status;
  } catch { /* A timeout may occur after acceptance. Keep the same key on retry. */ }
  if (status >= 200 && status < 300) {
    await env.EBOOK_DB.prepare('UPDATE ebook_requests SET sent_at=?, next_attempt=NULL WHERE request_id=?')
      .bind(now, id).run();
    return true;
  }
  const temporary = !status || status === 408 || status === 409 || status === 429 || status >= 500;
  await env.EBOOK_DB.prepare('UPDATE ebook_requests SET next_attempt=? WHERE request_id=? AND sent_at IS NULL')
    .bind(temporary && row.attempts < 7 ? now + 300 * 2 ** (row.attempts - 1) : null, id).run();
  console.warn('Ebook delivery not accepted', status || 'network');
  return false;
}

export async function handleEbook(request: Request, env: EbookEnv, send: typeof fetch = fetch, now = Math.floor(Date.now()/1000)) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body) || typeof body.email !== 'string'
    || body.email.length > 254 || !/^[^\s@<>,;"'\x00-\x1f]+@[^\s@<>,;"'\x00-\x1f]+\.[^\s@<>,;"'\x00-\x1f]+$/.test(body.email)
    || (body.firstName !== undefined && (typeof body.firstName !== 'string' || body.firstName.length > 120))) return reply(400);
  if (!env?.EBOOK_DB || !env.RESEND_API_KEY || !env.EBOOK_URL) return reply(503);
  try {
    const pdf = new URL(env.EBOOK_URL);
    if (pdf.protocol !== 'https:' || pdf.hostname !== 'cdn.the-body-healer.com' || pdf.username || pdf.password) return reply(503);
    const email = body.email.toLowerCase();
    // Keep the first payload stable on double-clicks, cron retries and client retries.
    await env.EBOOK_DB.prepare(`INSERT INTO ebook_requests
      (email,first_name,request_id,ebook_url,requested_at,next_attempt) VALUES (?,?,?,?,?,?)
      ON CONFLICT(email) DO UPDATE SET first_name=excluded.first_name,request_id=excluded.request_id,
      ebook_url=excluded.ebook_url,requested_at=excluded.requested_at,next_attempt=excluded.next_attempt,attempts=0,sent_at=NULL
      WHERE ebook_requests.requested_at<=excluded.requested_at-86400`)
      .bind(email, (body.firstName || '').trim(), crypto.randomUUID(), pdf.href, now, now).run();
    const entry = await env.EBOOK_DB.prepare('SELECT request_id, sent_at FROM ebook_requests WHERE email=?').bind(email)
      .first<{request_id:string;sent_at:number|null}>();
    if (!entry) return reply(503);
    return reply(entry.sent_at != null || await deliver(env, entry.request_id, now, send) ? 200 : 503);
  } catch {
    console.error('Ebook capture or delivery unavailable');
    return reply(503);
  }
}

export async function maintainEbooks(env: EbookEnv, send: typeof fetch = fetch, now = Math.floor(Date.now()/1000)) {
  await env.EBOOK_DB.prepare('DELETE FROM ebook_requests WHERE requested_at < ?').bind(now - 90*day).run();
  if (!env.RESEND_API_KEY) return;
  const { results } = await env.EBOOK_DB.prepare(`SELECT request_id FROM ebook_requests
    WHERE sent_at IS NULL AND next_attempt<=? AND requested_at>? AND attempts<7 ORDER BY next_attempt LIMIT 10`)
    .bind(now, now - day + 600).all<{request_id:string}>();
  for (const row of results) await deliver(env, row.request_id, now, send);
}
