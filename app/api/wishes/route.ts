import { submitWish } from '../../../lib/wish-submit';
export async function POST(request: Request) {
  return submitWish(request);
}
