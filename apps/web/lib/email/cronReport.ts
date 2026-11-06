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
  };
  // Emails sent outside the cron (signup codes, receipts, contact form) since
  // the previous report or the last restart.
  other: { sent: number; failed: number; limited: number; since: Date };
  // Sends Resend refused for hitting its limit during this run.
  limitedInRun: number;
}

const LABEL = { reminders: 'Check-again reminders', planner: 'Planner nudges', wraps: '3-month wraps' } as const;

const sentOf = (r: PassResult) => ('sent' in r ? r.sent : 0);

export function buildCronEmailReport(r: CronEmailReport): { text: string; alert: boolean } {
  const lines: string[] = [];
  const problems: string[] = [];
  const cronSent = r.expiry.expired + r.expiry.expiringSoon
    + sentOf(r.passes.reminders.result) + sentOf(r.passes.planner.result) + sentOf(r.passes.wraps.result);

  lines.push(`Sent by the daily run: <b>${cronSent}</b> of ${r.budget} budget`);
  if (r.expiry.expired + r.expiry.expiringSoon > 0) {
    lines.push(`• Pro expiry notices: ${r.expiry.expired + r.expiry.expiringSoon}`);
  }

  for (const key of ['reminders', 'planner', 'wraps'] as const) {
    const { result, cap, stillDue } = r.passes[key];
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
  if (r.other.failed > 0) problems.push(`${r.other.failed} signup/receipt/contact emails failed since the last report`);

  const limited = r.limitedInRun + r.other.limited;
  if (limited > 0) problems.unshift(`Resend refused ${limited} emails for hitting its limit`);
  if (cronSent >= r.budget) problems.push(`The daily budget of ${r.budget} is fully used`);

  const alert = problems.length > 0;
  const head = alert ? '⚠️ <b>Email report: some emails did not go out</b>' : '📧 <b>Email report</b>';
  const body = [head, ...lines];
  if (alert) body.push('', ...problems.map(p => `🚨 ${p}`));
  return { text: body.join('\n'), alert };
}
