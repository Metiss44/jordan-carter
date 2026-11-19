import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import miniflare from 'miniflare';

const { Miniflare, convertV4MiniflareOptions } = miniflare;

test('le Worker assemblé enregistre, reprend par son cron puis efface, sans réseau externe', async t => {
  const file = new URL('../.wrangler/ebook-test/worker.js', import.meta.url);
  const sent = [];
  const mf = new Miniflare(convertV4MiniflareOptions({
    host: '127.0.0.1', port: 0, cf: false, d1Persist: false,
    modulesRoot: fileURLToPath(new URL('.', file)),
    modules: [{ type: 'ESModule', path: fileURLToPath(file), contents: await readFile(file, 'utf8') }],
    compatibilityDate: '2026-11-01', compatibilityFlags: ['nodejs_compat','global_fetch_strictly_public'],
    bindings: { RESEND_API_KEY: 'local-only', EBOOK_URL: 'https://cdn.the-body-healer.com/fixture.pdf' },
    d1Databases: ['EBOOK_DB'], serviceBindings: { ASSETS: async () => new Response(null, {status: 404}) },
    // No passthrough: the mailbox, sender key, storage and transport are fixtures.
    outboundService: async req => {
      sent.push({ url: req.url, method: req.method, key: req.headers.get('Idempotency-Key'), body: await req.text() });
      return Response.json({}, { status: sent.length === 1 ? 503 : 200 });
    },
  }));
  t.after(() => mf.dispose());
  const db = await mf.getD1Database('EBOOK_DB');
  const migration = await readFile(new URL('../migrations/0001_ebook_requests.sql', import.meta.url), 'utf8');
  for (const sql of migration.split(';').map(s => s.trim()).filter(Boolean)) await db.prepare(sql).run();
  const worker = await mf.getWorker();
  const cron = async () => assert.equal((await worker.scheduled({ scheduledTime: new Date(), cron: '*/10 * * * *' })).outcome, 'ok');
  const submit = () => mf.dispatchFetch('https://www.the-body-healer.com/api/send-ebook', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'controle@example.invalid' }),
  });
  assert.equal((await submit()).status, 503);
  assert.equal((await db.prepare('SELECT count(*) AS n FROM ebook_requests WHERE sent_at IS NULL').first()).n, 1);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].url, 'https://api.resend.com/emails');
  assert.equal(sent[0].method, 'POST');
  assert.ok(sent[0].key);
  await db.prepare('UPDATE ebook_requests SET next_attempt=0').run();
  await cron();
  assert.equal(sent.length, 2);
  assert.deepEqual(sent[1], sent[0]);
  assert.equal((await submit()).status, 200);
  assert.equal(sent.length, 2);
  await db.prepare('UPDATE ebook_requests SET requested_at=0').run();
  await cron();
  assert.equal((await db.prepare('SELECT count(*) AS n FROM ebook_requests').first()).n, 0);
});
