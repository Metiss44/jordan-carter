import next from './.open-next/worker.js';
export * from './.open-next/worker.js';
import { maintainEbooks } from './lib/ebook.ts';

export default {
  fetch: next.fetch,
  scheduled(_event, env, ctx) {
    ctx.waitUntil(maintainEbooks(env));
  },
};
