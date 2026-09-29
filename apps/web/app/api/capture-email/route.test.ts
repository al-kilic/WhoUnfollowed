// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { onConflictDoUpdate, values, insert } = vi.hoisted(() => {
  const onConflictDoUpdate = vi.fn().mockResolvedValue(undefined);
  const values = vi.fn(() => ({ onConflictDoUpdate }));
  const insert = vi.fn(() => ({ values }));
  return { onConflictDoUpdate, values, insert };
});
vi.mock('@/lib/db/index', () => ({ db: { insert } }));

const { sendEmail } = vi.hoisted(() => ({ sendEmail: vi.fn().mockResolvedValue({ ok: true }) }));
vi.mock('@/lib/email/send', () => ({ sendEmail }));

import { POST } from './route';

let ipCounter = 0;
function makeRequest(body: unknown) {
  return new Request('http://localhost/api/capture-email', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.1.0.${++ipCounter}` },
  });
}

describe('POST /api/capture-email', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('rejects when consent is missing or not a strict true', async () => {
    for (const consent of [undefined, 'true', 1]) {
      const res = await POST(makeRequest({ email: 'a@b.com', source: 'csv', consent }));
      expect(res.status).toBe(400);
    }
    expect(insert).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('rejects an unknown source or an invalid email', async () => {
    expect((await POST(makeRequest({ email: 'a@b.com', source: 'other', consent: true }))).status).toBe(400);
    expect((await POST(makeRequest({ email: 'nope', source: 'csv', consent: true }))).status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });

  it('stores a lowercased subscriber with a consent version, and sends no export email for the waitlist', async () => {
    const res = await POST(makeRequest({ email: 'Fan@Example.COM', source: 'mobile-waitlist', consent: true }));
    expect(res.status).toBe(200);
    expect(values).toHaveBeenCalledWith(expect.objectContaining({
      email: 'fan@example.com',
      source: 'mobile-waitlist',
      consentVersion: expect.any(String),
    }));
    expect(onConflictDoUpdate).toHaveBeenCalledWith(expect.objectContaining({
      set: expect.objectContaining({ optedOutAt: null }),
    }));
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('sends the export confirmation only for the csv source', async () => {
    await POST(makeRequest({ email: 'a@b.com', source: 'csv', consent: true, csvFilename: 'x.csv' }));
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it('returns 500 and sends nothing when saving fails', async () => {
    onConflictDoUpdate.mockRejectedValueOnce(new Error('db down'));
    const res = await POST(makeRequest({ email: 'a@b.com', source: 'csv', consent: true }));
    expect(res.status).toBe(500);
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
