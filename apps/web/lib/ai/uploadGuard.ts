import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { UPLOAD_LIMITS, type UploadRoute } from '@/lib/uploadLimits';

// Server-side guard for routes that take uploads: a hard body size before
// anything is parsed, an hourly cap per member, and no identical request twice
// within a few minutes (a double click or a script replaying the same photos).
// In memory, per process: enough for one server; the allowance and pace limits
// in run.ts still apply on top.

const HOUR = 3_600_000;
const hits = new Map<string, number[]>();
const seen = new Map<string, number>();

function prune(now: number): void {
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < HOUR)) hits.delete(k);
  if (seen.size > 5000) for (const [k, t] of seen) if (now - t > UPLOAD_LIMITS.dedupeMinutes * 60_000) seen.delete(k);
}

// Reads the body as text up to maxBytes; anything bigger is refused unread.
export async function readLimitedJson(req: Request, maxBytes: number): Promise<{ ok: true; json: unknown; raw: string } | { ok: false; status: 413 | 400 }> {
  const declared = Number(req.headers.get('content-length') ?? '0');
  if (declared > maxBytes) return { ok: false, status: 413 };
  if (!req.body) return { ok: false, status: 400 };
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) { await reader.cancel().catch(() => undefined); return { ok: false, status: 413 }; }
    chunks.push(value);
  }
  const raw = new TextDecoder().decode(Buffer.concat(chunks));
  try { return { ok: true, json: JSON.parse(raw) as unknown, raw }; } catch { return { ok: false, status: 400 }; }
}

export type GuardResult = 'ok' | 'hourly' | 'duplicate';

export function checkUpload(userId: string, route: UploadRoute, raw: string, now: number = Date.now()): GuardResult {
  prune(now);
  const key = `${route}:${userId}`;
  const list = (hits.get(key) ?? []).filter((t) => now - t < HOUR);
  if (list.length >= UPLOAD_LIMITS.perHour[route]) { hits.set(key, list); return 'hourly'; }
  const digest = `${key}:${createHash('sha256').update(raw).digest('hex')}`;
  const last = seen.get(digest);
  if (last !== undefined && now - last < UPLOAD_LIMITS.dedupeMinutes * 60_000) return 'duplicate';
  list.push(now);
  hits.set(key, list);
  return 'ok';
}

// Called after a request succeeded, so a failed one can be retried at once.
export function markUploadDone(userId: string, route: UploadRoute, raw: string, now: number = Date.now()): void {
  seen.set(`${route}:${userId}:${createHash('sha256').update(raw).digest('hex')}`, now);
}

// One call for a route: read within the size limit, then the member checks.
export async function guardUpload(req: Request, userId: string, route: UploadRoute, maxBytes: number): Promise<{ ok: true; json: unknown; done: () => void } | { ok: false; response: NextResponse }> {
  const body = await readLimitedJson(req, maxBytes);
  if (!body.ok) return { ok: false, response: NextResponse.json({ ok: false, error: body.status === 413 ? 'too_large' : 'invalid' }, { status: body.status }) };
  const check = checkUpload(userId, route, body.raw);
  if (check === 'hourly') return { ok: false, response: NextResponse.json({ ok: false, error: 'busy' }, { status: 429 }) };
  if (check === 'duplicate') return { ok: false, response: NextResponse.json({ ok: false, error: 'duplicate' }, { status: 409 }) };
  return { ok: true, json: body.json, done: () => markUploadDone(userId, route, body.raw) };
}

// Tests only.
export function resetUploadGuard(): void { hits.clear(); seen.clear(); }
