import { getCloudflareContext } from '@opennextjs/cloudflare';
import { handleEbook, type EbookEnv } from '../../../lib/ebook';
import { syncCaptured } from '../../../lib/ebook-sheet';

export async function POST(request: Request) {
  const cloud = getCloudflareContext();
  const env = cloud.env as CloudflareEnv & EbookEnv;
  return handleEbook(request, env, fetch, undefined, id =>
    cloud.ctx.waitUntil(syncCaptured(env, id).catch(() => console.warn('Ebook Sheet queued for retry'))));
}
