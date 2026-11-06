import { describe, it, expect } from 'vitest';
import { buildCronEmailReport, type CronEmailReport } from './cronReport';

const now = new Date('2026-11-06T09:00:00Z');
const base = (): CronEmailReport => ({
  date: now,
  budget: 90,
  expiry: { expired: 0, expiringSoon: 0 },
  passes: {
    reminders: { result: { sent: 3, failed: 0 }, cap: 80, stillDue: 0 },
    planner: { result: { sent: 1, failed: 0 }, cap: 15, stillDue: 0 },
    wraps: { result: { sent: 0, failed: 0 }, cap: 15, stillDue: 0 },
  },
  other: { sent: 5, failed: 0, limited: 0, since: new Date(now.getTime() - 24 * 3_600_000) },
  limitedInRun: 0,
});

describe('buildCronEmailReport', () => {
  it('is calm when everything went out', () => {
    const r = buildCronEmailReport(base());
    expect(r.alert).toBe(false);
    expect(r.text).toContain('Sent by the daily run: <b>4</b> of 90');
    expect(r.text).toContain('in the last 24h: 5 sent');
    expect(r.text).not.toContain('🚨');
  });

  it('says when a cap held emails back', () => {
    const b = base();
    b.passes.wraps = { result: { sent: 15, failed: 0 }, cap: 15, stillDue: 7 };
    const r = buildCronEmailReport(b);
    expect(r.alert).toBe(true);
    expect(r.text).toContain('7 3-month wraps held back by the daily limit (room for 15)');
  });

  it('separates failed sends from cap holds', () => {
    const b = base();
    b.passes.reminders = { result: { sent: 2, failed: 3 }, cap: 80, stillDue: 3 };
    const r = buildCronEmailReport(b);
    expect(r.text).toContain('3 check-again reminders still due after failed sends');
  });

  it('flags a crashed pass, Resend limits and failed transactional emails', () => {
    const b = base();
    b.passes.planner = { result: { error: 'planner_failed' }, cap: 15, stillDue: null };
    b.other = { ...b.other, failed: 2, limited: 2 };
    b.limitedInRun = 1;
    const r = buildCronEmailReport(b);
    expect(r.alert).toBe(true);
    expect(r.text).toContain('Planner nudges crashed');
    expect(r.text).toContain('Resend refused 3 emails for hitting its limit');
    expect(r.text).toContain('2 signup/receipt/contact emails failed');
  });

  it('flags a used-up daily budget', () => {
    const b = base();
    b.passes.reminders = { result: { sent: 80, failed: 0 }, cap: 80, stillDue: 0 };
    b.passes.planner = { result: { sent: 10, failed: 0 }, cap: 10, stillDue: 0 };
    expect(buildCronEmailReport(b).text).toContain('daily budget of 90 is fully used');
  });
});
