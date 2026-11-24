import { beforeEach, describe, expect, it, vi } from 'vitest';

const validateRequest = vi.fn();
const joinCreatorWaitlist = vi.fn();

vi.mock('@/lib/auth/session', () => ({ validateRequest: () => validateRequest() }));
vi.mock('@/lib/reminders/store', () => ({ joinCreatorWaitlist: (o: unknown) => joinCreatorWaitlist(o) }));

const { joinWaitlistAction } = await import('./actions');

describe('joinWaitlistAction', () => {
  beforeEach(() => {
    validateRequest.mockReset();
    joinCreatorWaitlist.mockReset();
  });

  it('refuses when nobody is signed in', async () => {
    validateRequest.mockResolvedValue({ user: null, session: null });
    expect(await joinWaitlistAction('en')).toEqual({ error: 'not_signed_in' });
    expect(joinCreatorWaitlist).not.toHaveBeenCalled();
  });

  it('joins with the session email, never a form value, and keeps a valid locale', async () => {
    validateRequest.mockResolvedValue({ user: { id: 'u1', email: 'me@example.com' }, session: {} });
    expect(await joinWaitlistAction('pt')).toEqual({ ok: true });
    expect(joinCreatorWaitlist).toHaveBeenCalledWith({ email: 'me@example.com', locale: 'pt', userId: 'u1' });
  });

  it('falls back to English for an unknown locale', async () => {
    validateRequest.mockResolvedValue({ user: { id: 'u1', email: 'me@example.com' }, session: {} });
    await joinWaitlistAction('xx');
    expect(joinCreatorWaitlist).toHaveBeenCalledWith(expect.objectContaining({ locale: 'en' }));
  });

  it('reports a failed save instead of throwing', async () => {
    validateRequest.mockResolvedValue({ user: { id: 'u1', email: 'me@example.com' }, session: {} });
    joinCreatorWaitlist.mockRejectedValue(new Error('db down'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await joinWaitlistAction('en')).toEqual({ error: 'failed' });
  });
});
