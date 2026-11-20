import next from './.open-next/worker.js';
export * from './.open-next/worker.js';
import { maintainEbooks } from './lib/ebook.ts';
import { maintainSheet } from './lib/ebook-sheet.ts';

export default {
  fetch: next.fetch,
  scheduled(_event, env, ctx) {
    ctx.waitUntil(maintainEbooks(env));
    ctx.waitUntil(maintainSheet(env));
  },
};
