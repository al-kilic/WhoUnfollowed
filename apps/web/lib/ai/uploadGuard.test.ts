import { beforeEach, describe, expect, it } from 'vitest';
import { checkUpload, guardUpload, markUploadDone, readLimitedJson, resetUploadGuard } from './uploadGuard';
import { UPLOAD_LIMITS } from '@/lib/uploadLimits';

const req = (body: string, headers: Record<string, string> = {}) => new Request('http://x/api', { method: 'POST', body, headers: { 'content-type': 'application/json', ...headers } });

describe('upload guard', () => {
  beforeEach(() => resetUploadGuard());

  it('refuses a body over the limit before parsing', async () => {
    const big = JSON.stringify({ a: 'x'.repeat(2000) });
    expect(await readLimitedJson(req(big), 1000)).toEqual({ ok: false, status: 413 });
    expect(await readLimitedJson(req('{}', { 'content-length': '999999' }), 1000)).toEqual({ ok: false, status: 413 });
  });

  it('reads a small body and refuses broken JSON', async () => {
    const r = await readLimitedJson(req('{"a":1}'), 1000);
    expect(r.ok && r.json).toEqual({ a: 1 });
    expect(await readLimitedJson(req('{nope'), 1000)).toEqual({ ok: false, status: 400 });
  });

  it('caps calls per member per hour, per route', () => {
    const t0 = 1_000_000;
    for (let i = 0; i < UPLOAD_LIMITS.perHour.photoStyle; i++) expect(checkUpload('u1', 'photoStyle', `body${i}`, t0 + i)).toBe('ok');
    expect(checkUpload('u1', 'photoStyle', 'another', t0 + 10)).toBe('hourly');
    expect(checkUpload('u2', 'photoStyle', 'another', t0 + 10)).toBe('ok');
    expect(checkUpload('u1', 'insights', 'another', t0 + 10)).toBe('ok');
    expect(checkUpload('u1', 'photoStyle', 'later', t0 + 3_600_001)).toBe('ok');
  });

  it('refuses the same successful request twice within the window, but allows a retry after a failure', () => {
    const t0 = 5_000_000;
    expect(checkUpload('u1', 'insights', 'same', t0)).toBe('ok');
    // The first one failed (no markUploadDone): a retry is fine.
    expect(checkUpload('u1', 'insights', 'same', t0 + 1)).toBe('ok');
    markUploadDone('u1', 'insights', 'same', t0 + 2);
    expect(checkUpload('u1', 'insights', 'same', t0 + 3)).toBe('duplicate');
    expect(checkUpload('u1', 'insights', 'same', t0 + UPLOAD_LIMITS.dedupeMinutes * 60_000 + 3)).toBe('ok');
  });

  it('guardUpload answers 413, 429 and 409 in the route shape', async () => {
    const tooBig = await guardUpload(req(JSON.stringify({ a: 'x'.repeat(5000) })), 'u9', 'voice', 1000);
    expect(!tooBig.ok && tooBig.response.status).toBe(413);
    const ok = await guardUpload(req('{"a":1}'), 'u9', 'voice', 1000);
    expect(ok.ok).toBe(true);
    if (ok.ok) ok.done();
    const dup = await guardUpload(req('{"a":1}'), 'u9', 'voice', 1000);
    expect(!dup.ok && dup.response.status).toBe(409);
  });
});
