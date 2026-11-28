// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';

const m = vi.hoisted(() => ({
  guardProAi: vi.fn(),
  getGoalView: vi.fn().mockResolvedValue({ platform: 'instagram', platforms: [], goal: null, cadence: 'off', progress: null, current: 120, points: [] }),
  saveGoal: vi.fn().mockResolvedValue('instagram'),
  deleteGoal: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/lib/ai/guard', () => ({ guardProAi: m.guardProAi, readJson: (r: Request) => r.json().catch(() => null) }));
vi.mock('@/lib/ai/goals', () => ({ getGoalView: m.getGoalView, saveGoal: m.saveGoal, deleteGoal: m.deleteGoal }));

import { DELETE, GET, POST } from './route';

const url = (q = '') => `http://localhost/api/ai/goal${q}`;
const post = (body: unknown) => new Request(url(), { method: 'POST', body: JSON.stringify(body) });

describe('/api/ai/goal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    m.guardProAi.mockResolvedValue({ ok: true, userId: 'u1', access: { plan: 'monthly', periodEnd: null }, onboarded: true });
  });

  it('refuses people without Pro AI', async () => {
    m.guardProAi.mockResolvedValueOnce({ ok: false, response: NextResponse.json({ error: 'not_pro_ai' }, { status: 403 }) });
    expect((await GET(new Request(url()))).status).toBe(403);
    expect(m.getGoalView).not.toHaveBeenCalled();
  });

  it('reads the goal for a platform, or the default platform without one', async () => {
    await GET(new Request(url('?platform=threads')));
    expect(m.getGoalView).toHaveBeenLastCalledWith('u1', 'threads');
    await GET(new Request(url()));
    expect(m.getGoalView).toHaveBeenLastCalledWith('u1', null);
    expect((await GET(new Request(url('?platform=myspace')))).status).toBe(400);
  });

  it('saves a valid goal with check-ins off by default', async () => {
    const res = await POST(post({ target: 3000, by: '2027-05-01' }));
    expect(res.status).toBe(200);
    expect(m.saveGoal).toHaveBeenCalledWith('u1', { type: 'followers', target: 3000, by: '2027-05-01', note: '', cadence: 'off', weekday: 1, deadlineReminder: false });
  });

  it('saves a goal for one platform and answers with that platform', async () => {
    m.saveGoal.mockResolvedValueOnce('threads');
    const res = await POST(post({ platform: 'threads', target: 500 }));
    expect(res.status).toBe(200);
    expect(m.saveGoal).toHaveBeenCalledWith('u1', expect.objectContaining({ platform: 'threads', target: 500 }));
    expect(m.getGoalView).toHaveBeenLastCalledWith('u1', 'threads');
  });

  it('saves a habit goal with a note and a monthly check-in', async () => {
    const res = await POST(post({ type: 'posts_week', target: 3, note: 'Stay consistent', cadence: 'monthly', weekday: null, deadlineReminder: true }));
    expect(res.status).toBe(200);
    expect(m.saveGoal).toHaveBeenCalledWith('u1', { type: 'posts_week', target: 3, by: null, note: 'Stay consistent', cadence: 'monthly', weekday: null, deadlineReminder: true });
  });

  it('rejects a bad target, date or platform', async () => {
    expect((await POST(post({ target: 0 }))).status).toBe(400);
    expect((await POST(post({ target: 100, by: 'next week' }))).status).toBe(400);
    expect((await POST(post({ target: 100, cadence: 'daily' }))).status).toBe(400);
    expect((await POST(post({ type: 'posts_week', target: 60 }))).status).toBe(400);
    expect((await POST(post({ target: 100, platform: 'myspace' }))).status).toBe(400);
    expect(m.saveGoal).not.toHaveBeenCalled();
  });

  it('deletes the goal for one platform and needs the platform', async () => {
    expect((await DELETE(new Request(url('?platform=threads'), { method: 'DELETE' }))).status).toBe(200);
    expect(m.deleteGoal).toHaveBeenCalledWith('u1', 'threads');
    expect((await DELETE(new Request(url(), { method: 'DELETE' }))).status).toBe(400);
  });
});
