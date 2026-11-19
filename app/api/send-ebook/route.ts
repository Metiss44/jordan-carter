import { getCloudflareContext } from '@opennextjs/cloudflare';
import { handleEbook, type EbookEnv } from '../../../lib/ebook';

export async function POST(request: Request) {
  return handleEbook(request, getCloudflareContext().env as CloudflareEnv & EbookEnv);
}
