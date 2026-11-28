import 'server-only';
import type { AppLocale } from '@/i18n/routing';
import { localizedPathname } from '@/i18n/localizedPathname';
import { C, emailLayout, escapeHtml, type EmailResult } from './templates';
import { getBriefEmailContent, getCheckinEmailContent, getPostingEmailContent, type CheckinEmailContent, type PostFormatLabel } from './proAiContent';
import { PLATFORM_NAME } from '@/lib/platform';
import type { Platform } from '@ig-tracker/core';
import { subscriptionConfirmationEmail, type SubscriptionConfirmation } from './billingTemplates';
import type { GoalProgress } from '@/lib/ai/goalMath';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://whounfollowed.co';

// Sent once from the Stripe webhook when a Pro AI subscription starts. The
// legal content (price, renewal, cancel, start-now, cancel rights) lives in
// billingTemplates.ts so the Refill and Lifetime emails share it.
export function proAiConfirmationEmail(opts: SubscriptionConfirmation): EmailResult {
  return subscriptionConfirmationEmail(opts);
}

// Goal check-in: progress from the latest export, and a nudge to upload a new
// one. Goals are per platform; one email lists every goal, each under its
// platform name when there is more than one.
export type CheckinGoalOpts = { platform: Platform; deadlineDays?: number | null } & (
  | { kind: 'followers'; target: number; progress: GoalProgress }
  | { kind: 'posts_week' | 'per_post'; target: number; current: number }
);
export interface CheckinEmailOpts { locale: AppLocale; goals: CheckinGoalOpts[] }

function goalLines(g: CheckinGoalOpts, c: CheckinEmailContent, n: (x: number) => string): { lines: string[]; subject: string } {
  const deadline = typeof g.deadlineDays === 'number' ? [c.deadline(g.deadlineDays)] : [];
  if (g.kind === 'followers') {
    const p = g.progress;
    return {
      lines: [
        c.progress(n(p.current), n(g.target), p.pct),
        c.status[p.status],
        ...(p.perWeekSoFar !== null || p.perWeekNeeded !== null
          ? [c.pace(p.perWeekSoFar !== null ? n(p.perWeekSoFar) : null, p.perWeekNeeded !== null ? n(p.perWeekNeeded) : null)]
          : []),
        ...deadline,
        ...(p.status === 'done' ? [] : [c.nudge(PLATFORM_NAME[g.platform])]),
      ],
      subject: c.subject(n(p.current), n(g.target)),
    };
  }
  return { lines: [c.habit[g.kind](n(g.current), n(g.target)), ...deadline, c.habitNudge], subject: c.subject(n(g.current), n(g.target)) };
}

export function checkinEmail(opts: CheckinEmailOpts): EmailResult {
  const c = getCheckinEmailContent(opts.locale);
  const n = (x: number) => x.toLocaleString(opts.locale);
  const parts = opts.goals.map((g) => ({ g, ...goalLines(g, c, n) }));
  const multi = parts.length > 1;
  const subject = multi ? c.subjectMulti(parts.length) : (parts[0]?.subject ?? c.title);
  const url = `${APP_URL}${localizedPathname('/app/plan/goals', opts.locale)}`;
  const text = `${parts.map((x) => `${multi ? `${PLATFORM_NAME[x.g.platform]}: ` : ''}${x.lines.join(' ')}`).join(' ')} ${url} ${c.footer}`;
  const para = (l: string) => `<p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:${C.dim};">${escapeHtml(l)}</p>`;
  const body = parts.map((x) => `${multi ? `<h2 style="margin:16px 0 6px;font-size:15px;font-weight:600;color:${C.ink};">${escapeHtml(PLATFORM_NAME[x.g.platform])}</h2>` : ''}${x.lines.map(para).join('')}`).join('');
  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 8px;font-size:21px;font-weight:600;color:${C.ink};">${c.title}</h1>
        ${body}
      </td></tr>
      <tr><td style="padding:12px 30px 0;">
        <a href="${url}" style="display:inline-block;background:${C.teal};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:10px;">${c.button}</a>
      </td></tr>
      <tr><td style="padding:20px 30px 30px;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:${C.mute};">${c.footer}</p>
      </td></tr>
    </table>`;
  return { subject, html: emailLayout({ locale: opts.locale, preview: c.preview, contentHtml: content }), text };
}

// "This week's brief is out", once per brief, for members who turned it on.
export function briefEmail(opts: { date: string; locale: AppLocale }): EmailResult {
  const c = getBriefEmailContent(opts.locale);
  const label = new Date(`${opts.date}T12:00:00Z`).toLocaleDateString(opts.locale, { day: 'numeric', month: 'long', timeZone: 'UTC' });
  const url = `${APP_URL}${localizedPathname('/app/plan/brief', opts.locale)}`;
  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 8px;font-size:21px;font-weight:600;color:${C.ink};">${c.title}</h1>
        <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:${C.dim};">${c.body}</p>
      </td></tr>
      <tr><td style="padding:12px 30px 0;">
        <a href="${url}" style="display:inline-block;background:${C.teal};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:10px;">${c.button}</a>
      </td></tr>
      <tr><td style="padding:20px 30px 30px;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:${C.mute};">${c.footer}</p>
      </td></tr>
    </table>`;
  return { subject: c.subject(label), html: emailLayout({ locale: opts.locale, preview: c.preview, contentHtml: content }), text: `${c.title}. ${c.body} ${url} ${c.footer}` };
}

// "Today is one of your posting days", for members who turned it on. Names the
// planned post when there is one (format plus the idea, cut short).
export function postingEmail(opts: { locale: AppLocale; post: { format: string; idea: string } | null; tomorrow?: boolean }): EmailResult {
  const base = getPostingEmailContent(opts.locale);
  // The "day before" email: same layout, tomorrow's wording.
  const c = opts.tomorrow ? { ...base, ...base.tomorrow } : base;
  const url = `${APP_URL}${localizedPathname('/app/plan', opts.locale)}`;
  const format = opts.post ? (c.formats[opts.post.format as PostFormatLabel] ?? opts.post.format) : null;
  const idea = opts.post ? (opts.post.idea.length > 140 ? `${opts.post.idea.slice(0, 139).trimEnd()}…` : opts.post.idea) : '';
  const lead = format ? c.withPost(format) : c.noPost;
  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:30px 30px 0;">
        <h1 style="margin:0 0 8px;font-size:21px;font-weight:600;color:${C.ink};">${c.title}</h1>
        <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:${C.dim};">${escapeHtml(lead)}</p>
        ${idea ? `<p style="margin:0 0 10px;padding:12px 14px;border-radius:10px;background:#f3f5f5;font-size:14px;line-height:1.6;color:${C.ink};">${escapeHtml(idea)}</p>` : ''}
      </td></tr>
      <tr><td style="padding:12px 30px 0;">
        <a href="${url}" style="display:inline-block;background:${C.teal};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:10px;">${c.button}</a>
      </td></tr>
      <tr><td style="padding:20px 30px 30px;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:${C.mute};">${c.footer}</p>
      </td></tr>
    </table>`;
  return { subject: c.subject(format), html: emailLayout({ locale: opts.locale, preview: c.preview, contentHtml: content }), text: [c.title, lead, idea, url, c.footer].filter(Boolean).join(' ') };
}
