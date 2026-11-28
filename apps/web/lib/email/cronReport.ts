import { escapeTelegramHtml } from '@/lib/telegram';

// The daily email report sent to Telegram after the cron's email passes:
// what went out, what failed, and what the daily caps held back. Counts only,
// never addresses. Pure, so it's unit tested without a database.

export type PassResult = { sent: number; failed: number } | { error: string };

export interface CronEmailReport {
  date: Date;
  budget: number; // the cron's daily budget (Resend free plan is 100/day)
  expiry: { expired: number; expiringSoon: number };
  passes: {
    reminders: { result: PassResult; cap: number; stillDue: number | null };
    planner: { result: PassResult; cap: number; stillDue: number | null };
    wraps: { result: PassResult; cap: number; stillDue: number | null };
    // Pro AI goal check-ins (lib/ai/checkins.ts). Optional: older callers omit it.
    checkins?: { result: PassResult; cap: number; stillDue: number | null };
    // Weekly brief emails (lib/ai/briefEmail.ts). Optional too.
    briefs?: { result: PassResult; cap: number; stillDue: number | null };
    // Posting-day reminders (lib/ai/postingReminder.ts). Optional too.
    posting?: { result: PassResult; cap: number; stillDue: number | null };
  };
  // Emails sent outside the cron (signup codes, receipts, contact form) since
  // the previous report or the last restart.
  other: { sent: number; failed: number; limited: number; since: Date };
  // Sends Resend refused for hitting its limit during this run.
  limitedInRun: number;
  // The AI health section (lib/ai/aiHealth.ts). Optional: older callers omit it.
  ai?: { lines: string[]; quiet: boolean } | null;
}

const LABEL = { reminders: 'Check-again reminders', planner: 'Planner nudges', wraps: '3-month wraps', checkins: 'Goal check-ins', briefs: 'Weekly brief emails', posting: 'Posting-day reminders' } as const;

const sentOf = (r: PassResult) => ('sent' in r ? r.sent : 0);
const emails = (n: number) => `${n} ${n === 1 ? 'email' : 'emails'}`;

// quiet: nothing was sent and nothing went wrong, so there is nothing to report.
export function buildCronEmailReport(r: CronEmailReport): { text: string; alert: boolean; quiet: boolean } {
  const lines: string[] = [];
  const problems: string[] = [];
  const cronSent = r.expiry.expired + r.expiry.expiringSoon
    + sentOf(r.passes.reminders.result) + sentOf(r.passes.planner.result) + sentOf(r.passes.wraps.result)
    + (r.passes.checkins ? sentOf(r.passes.checkins.result) : 0)
    + (r.passes.briefs ? sentOf(r.passes.briefs.result) : 0)
    + (r.passes.posting ? sentOf(r.passes.posting.result) : 0);

  lines.push(`Sent by the daily run: <b>${cronSent}</b> of ${r.budget} budget`);
  if (r.expiry.expired + r.expiry.expiringSoon > 0) {
    lines.push(`• Pro expiry notices: ${r.expiry.expired + r.expiry.expiringSoon}`);
  }

  for (const key of ['reminders', 'planner', 'wraps', 'checkins', 'briefs', 'posting'] as const) {
    const pass = r.passes[key];
    if (!pass) continue;
    const { result, cap, stillDue } = pass;
    if ('error' in result) {
      lines.push(`• ${LABEL[key]}: crashed (${escapeTelegramHtml(result.error)})`);
      problems.push(`${LABEL[key]} crashed, check the server logs`);
      continue;
    }
    let line = `• ${LABEL[key]}: ${result.sent} sent`;
    if (result.failed > 0) line += `, ${result.failed} failed`;
    if (stillDue && stillDue > 0) {
      const heldByCap = cap <= 0 || result.sent + result.failed >= cap;
      line += `, ${stillDue} waiting`;
      problems.push(heldByCap
        ? `${stillDue} ${LABEL[key].toLowerCase()} held back by the daily limit (${cap > 0 ? `room for ${cap}` : 'no room left'}), they go out tomorrow`
        : `${stillDue} ${LABEL[key].toLowerCase()} still due after failed sends, retried tomorrow`);
    }
    if (result.failed > 0 && !(stillDue && stillDue > 0)) problems.push(`${result.failed} ${LABEL[key].toLowerCase()} failed to send`);
    lines.push(line);
  }

  const sinceH = Math.max(1, Math.round((r.date.getTime() - r.other.since.getTime()) / 3_600_000));
  lines.push(`Other emails (signup codes, receipts, contact) in the last ${sinceH}h: ${r.other.sent} sent${r.other.failed ? `, ${r.other.failed} failed` : ''}`);
  if (r.other.failed > 0) problems.push(`${r.other.failed} signup, receipt or contact ${r.other.failed === 1 ? 'email' : 'emails'} failed since the last report`);

  const limited = r.limitedInRun + r.other.limited;
  if (limited > 0) problems.unshift(`Resend refused ${emails(limited)} for hitting its limit`);
  if (cronSent >= r.budget) problems.push(`The daily budget of ${r.budget} is fully used`);

  const alert = problems.length > 0;
  const head = alert ? '⚠️ <b>Email report: some emails did not go out</b>' : '📧 <b>Email report</b>';
  const body = [head, ...lines];
  if (alert) body.push('', ...problems.map(p => `🚨 ${p}`));
  const aiActive = !!r.ai && !r.ai.quiet;
  if (aiActive) body.push('', '🤖 <b>AI</b>', ...r.ai!.lines);
  return { text: body.join('\n'), alert, quiet: !alert && cronSent + r.other.sent === 0 && !aiActive };
}
