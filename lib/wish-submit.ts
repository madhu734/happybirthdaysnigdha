// Server-side adapter: the browser never talks to PocketBase directly.
const RECORDS_URL = 'https://spb.tmadhu.me/api/collections/wish/records';
const MAX_TEXT = 2000;
const MAX_BODY_BYTES = 20000;

function reply(data: Record<string, unknown>, status: number) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

function isSameOrAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    const reqUrl = new URL(request.url);
    const forwardHost = request.headers.get('x-forwarded-host');
    const hostHeader = request.headers.get('host');
    const expectedHost = forwardHost || hostHeader || reqUrl.host;
    if (originUrl.host === expectedHost) return true;
    if (originUrl.host === reqUrl.host) return true;
    if (originUrl.host === 'happybirthdaysnigdha.tmadhu.me' || originUrl.host.endsWith('.tmadhu.me')) return true;
    if (originUrl.hostname === 'localhost' || originUrl.hostname === '127.0.0.1') return true;
    return false;
  } catch {
    return false;
  }
}

export async function submitWish(request: Request, send: typeof fetch = fetch): Promise<Response> {
  // Reject cross-origin browser submissions while supporting reverse proxies.
  if (!isSameOrAllowedOrigin(request)) {
    return reply({ error: 'এই পেজ থেকেই উইশটা পাঠাও।' }, 403);
  }
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return reply({ error: 'উইশ পাঠানোর অনুরোধটি ঠিক হয়নি।' }, 415);
  }
  let payload: unknown;
  try {
    const raw = await request.arrayBuffer();
    if (raw.byteLength > MAX_BODY_BYTES) return reply({ error: 'উইশটা একটু ছোট করে লিখো।' }, 413);
    payload = JSON.parse(new TextDecoder().decode(raw));
  } catch {
    return reply({ error: 'উইশ পাঠানোর অনুরোধটি ঠিক হয়নি।' }, 400);
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return reply({ error: 'তোমার উইশটা লিখে তারপর পাঠাও।' }, 400);
  }
  const { text, submissionId } = payload as { text?: unknown; submissionId?: unknown };
  if (typeof text !== 'string' || !text.trim()) {
    return reply({ error: 'তোমার উইশটা লিখে তারপর পাঠাও।' }, 400);
  }
  if (text.length > MAX_TEXT) {
    return reply({ error: 'উইশটা ২০০০ অক্ষরের মধ্যে লিখো।' }, 400);
  }
  if (typeof submissionId !== 'string' || !/^[a-z0-9]{15}$/.test(submissionId)) {
    return reply({ error: 'পেজটা আবার খুলে চেষ্টা করো।' }, 400);
  }
  let response: Response;
  try {
    response = await send(RECORDS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: submissionId, text: text.trim() }),
      signal: AbortSignal.timeout(15000),
      redirect: 'error',
    });
  } catch {
    return reply({ error: 'উইশটা জমা হয়েছে কি না নিশ্চিত হওয়া যায়নি। তোমার লেখা এখানেই আছে; একটু পরে আবার চেষ্টা করো।', uncertain: true }, 504);
  }
  const record = await response.json().catch(() => null) as { id?: unknown; text?: unknown; data?: { id?: { code?: unknown } } } | null;
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      return reply({ error: 'এই মুহূর্তে উইশ জমা নেওয়া যাচ্ছে না। তোমার লেখা মুছে যায়নি—সাইটের মালিককে জানাও।' }, 503);
    }
    if (response.status === 429) {
      return reply({ error: 'একটু বিরতি নিয়ে আবার পাঠাও। তোমার লেখা এখানেই আছে।' }, 429);
    }
    if (response.status === 400 && record?.data?.id?.code === 'validation_not_unique') {
      // Keep the same ID after uncertain errors: a retry must not create a second copy.
      // Do not claim success without confirming the stored content.
      return reply({ error: 'এই উইশের একটি জমা দেওয়ার অনুরোধ আগে পাওয়া গেছে। আবার কপি তৈরি হয়নি। জমা হয়েছে কি না সাইটের মালিককে দেখতে বলো।', uncertain: true }, 409);
    }
    if (response.status === 400) {
      return reply({ error: 'উইশটা জমা নেওয়া যায়নি। লেখাটা ছোট করে আবার চেষ্টা করো; তবুও না হলে সাইটের মালিককে জানাও।' }, 422);
    }
    return reply({ error: 'এখন উইশটা জমা নেওয়া যাচ্ছে না। তোমার লেখা এখানেই আছে; একটু পরে আবার চেষ্টা করো।' }, 502);
  }
  if (record?.id !== submissionId || record?.text !== text.trim()) {
    return reply({ error: 'জমা হওয়ার নিশ্চয়তা পাওয়া যায়নি। তোমার লেখা এখানেই আছে; সাইটের মালিককে জানাও।', uncertain: true }, 502);
  }
  return reply({ success: true, id: record.id }, 201);
}
