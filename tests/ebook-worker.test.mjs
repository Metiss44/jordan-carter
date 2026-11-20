import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import miniflare from 'miniflare';
import { unstable_splitSqlQuery } from 'wrangler';
import { googleFixture } from './sheet-fixture.mjs';

const { Miniflare, convertV4MiniflareOptions } = miniflare;

test('Worker assemblé : mail indépendant du tableur, réponses perdues, reprises et purge ciblée', {timeout:25000}, async t => {
  const file = new URL('../.wrangler/ebook-test/worker.js', import.meta.url);
  const sent = [];
  const {config,state:google} = googleFixture();
  const gate = Promise.withResolvers();
  google.holdLookup = gate.promise;
  const mf = new Miniflare(convertV4MiniflareOptions({
    host: '127.0.0.1', port: 0, cf: false, d1Persist: false,
    modulesRoot: fileURLToPath(new URL('.', file)),
    modules: [{ type: 'ESModule', path: fileURLToPath(file), contents: await readFile(file, 'utf8') }],
    compatibilityDate: '2026-11-01', compatibilityFlags: ['nodejs_compat','global_fetch_strictly_public'],
    bindings: { RESEND_API_KEY: 'local-only', EBOOK_URL: 'https://cdn.the-body-healer.com/fixture.pdf', EBOOK_SHEETS_CONFIG:config },
    d1Databases: ['EBOOK_DB'], serviceBindings: { ASSETS: async () => new Response(null, {status: 404}) },
    // No passthrough: the mailbox, sender key, storage and transport are fixtures.
    outboundService: async req => {
      if (req.url !== 'https://api.resend.com/emails') return google.respond(req);
      sent.push({ url: req.url, method: req.method, key: req.headers.get('Idempotency-Key'), body: await req.text() });
      return Response.json({}, { status: sent.length === 1 ? 503 : 200 });
    },
  }));
  t.after(() => { gate.resolve(); return mf.dispose(); });
  const db = await mf.getD1Database('EBOOK_DB');
  const migrations = new URL('../migrations/', import.meta.url);
  for (const name of (await readdir(migrations)).filter(n => n.endsWith('.sql')).sort()) {
    const sql = await readFile(new URL(name,migrations),'utf8');
    await db.batch(unstable_splitSqlQuery(sql).map(s => db.prepare(s)));
  }
  const worker = await mf.getWorker();
  const cron = async () => {
    assert.equal((await worker.scheduled({ scheduledTime: new Date(), cron: '*/10 * * * *' })).outcome, 'ok');
    if (google.error) throw google.error;
  };
  const job = () => db.prepare('SELECT * FROM ebook_sheet_outbox').first();
  const due = () => db.prepare('UPDATE ebook_sheet_outbox SET next_attempt=0').run();
  const submit = () => mf.dispatchFetch('https://www.the-body-healer.com/api/send-ebook', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ firstName:'=Prénom', email:'controle@example.invalid' }),
  });
  // The visitor gets the mail result even while Google hasn't answered.
  assert.equal((await submit()).status, 503);
  assert.equal((await db.prepare('SELECT count(*) AS n FROM ebook_requests WHERE sent_at IS NULL').first()).n, 1);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].url, 'https://api.resend.com/emails');
  assert.equal(sent[0].method, 'POST');
  assert.ok(sent[0].key);
  assert.equal((await job()).email,'controle@example.invalid');
  gate.resolve();
  // The background request may outlive the route. Even if it is interrupted,
  // the cron can take the persisted job after its lease.
  await db.prepare('UPDATE ebook_requests SET next_attempt=0').run();
  await cron();
  assert.equal(sent.length, 2);
  assert.deepEqual(sent[1], sent[0]);
  assert.equal((await submit()).status, 200);
  assert.equal(sent.length, 2);
  assert.equal(google.writes,0);
  // Back online with renamed columns: the Worker must not write in the wrong place.
  google.offline=false; google.rows[0].cells[1]='Date';
  await due(); await cron();
  assert.equal(google.writes,0); assert.equal((await job()).synced_at,null);
  google.rows[0].cells[1]='Mail';
  await due(); await cron();
  assert.equal(google.writes,1); assert.equal((await job()).synced_at,null);
  const row = google.rows.at(-1);
  assert.deepEqual(row.cells,['=Prénom','controle@example.invalid',new Date((await job()).requested_at*1000).toISOString()]);
  await due(); await cron();
  const synced = await job();
  assert.ok(synced.synced_at); assert.equal(synced.email,''); assert.equal(synced.first_name,'');
  assert.equal(google.writes,1); assert.equal(sent.length,2); assert.deepEqual(google.rows[1].cells,google.history);
  // Rows may move or be repurposed. Never clear an unrecognised row or column D.
  google.rows.splice(1,0,{cells:['Autre','autre@example.invalid','2024']});
  row.cells[0]='Modifié'; row.cells.push('Note manuelle');
  await db.prepare('UPDATE ebook_requests SET requested_at=0').run();
  await db.prepare('UPDATE ebook_sheet_outbox SET requested_at=0,next_attempt=0').run();
  await cron();
  assert.equal((await db.prepare('SELECT count(*) AS n FROM ebook_requests').first()).n, 0);
  assert.equal(google.clears,0); assert.ok(await job());
  row.cells[0]='=Prénom';
  await due(); await cron();
  assert.equal(await job(),null); assert.deepEqual(row.cells,['','','','Note manuelle']);
  assert.equal(google.clears,1); assert.deepEqual(google.rows[2].cells,google.history); assert.equal(sent.length,2);
});
