import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { handleEbook, maintainEbooks } from '../lib/ebook.ts';

function setup(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  db.exec(readFileSync(new URL('../migrations/0001_ebook_requests.sql',import.meta.url),'utf8'));
  const env = {
    EBOOK_DB: { prepare: sql => ({ bind: (...args) => ({
      first: async () => db.prepare(sql).get(...args) || null,
      all: async () => ({ results: db.prepare(sql).all(...args) }),
      run: async () => db.prepare(sql).run(...args),
    }) }) },
    EBOOK_URL: 'https://cdn.the-body-healer.com/fixture.pdf', RESEND_API_KEY: 'fixture',
  };
  const call = (send, now, data={ firstName:'<Test>', email:'Example@example.invalid' }) =>
    handleEbook(new Request('https://example.invalid/',{method:'POST',body:JSON.stringify(data)}), env, send, now);
  return { env, call, db };
}

test('capture avant envoi, validation, échappement et double clic', async t => {
  const {call,db} = setup(t); let n=0;
  const send=async (url,req) => {
    n++; assert.equal(url,'https://api.resend.com/emails');
    assert.equal(db.prepare('SELECT count(*) n FROM ebook_requests').get().n,1);
    assert.equal(JSON.parse(req.body).to,'example@example.invalid'); assert.match(JSON.parse(req.body).html,/&lt;Test&gt;/);
    return new Response('{}',{status:200});
  };
  assert.equal((await call(send,100,{email:'a@example.invalid,foo@example.invalid'})).status,400);
  const replies=await Promise.all([call(send,100),call(send,100)]);
  assert.ok(replies.some(r=>r.status===200)); assert.equal((await call(send,150)).status,200);
  assert.equal(n,1);
});
test('réponse perdue : même clé et même contenu à la reprise, puis purge', async t => {
  const {env,call,db}=setup(t); const keys=[],bodies=[];
  const send=async (_url,req)=>{keys.push(req.headers['Idempotency-Key']); bodies.push(req.body);
    if(keys.length===1) throw Error('transport interrompu'); return new Response('{}',{status:200});};
  assert.equal((await call(send,500)).status,503);
  await call(send,501,{email:'example@example.invalid',firstName:'Autre'});
  await maintainEbooks(env,send,801);
  assert.equal(keys.length,2); assert.equal(keys[0],keys[1]); assert.equal(bodies[0],bodies[1]);
  assert.equal(db.prepare('SELECT sent_at FROM ebook_requests').get().sent_at,801);
  await maintainEbooks(env,send,500+91*86400);
  assert.equal(db.prepare('SELECT count(*) n FROM ebook_requests').get().n,0);
});
test('stockage indisponible ou refus définitif : aucun faux succès et aucune boucle d’envoi',async t=>{
  const {env,call}=setup(t); let calls=0;
  const refuse=async()=>{calls++;return new Response('',{status:422});};
  assert.equal((await call(refuse,300)).status,503); await maintainEbooks(env,refuse,4000);
  assert.equal(calls,1);
  env.EBOOK_DB.prepare=()=>{throw Error('stockage non disponible');};
  assert.equal((await call(refuse,6000)).status,503); assert.equal(calls,1);
});
