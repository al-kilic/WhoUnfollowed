import { BLOG_POSTS } from '../blog/posts';
import { PRO_AI_PRICE_USD, PRO_AI_PRICE_SUMMARY } from '@/lib/pricing';
import { getBrief, listBriefDates } from '@/lib/briefs';
import { getInstagramPageContent } from '../[locale]/instagram/content';
import { getCoachPageContent } from '../[locale]/instagram-coach/content';

// The long companion to /llms.txt: the full text of the pages AI answer
// engines quote most (Instagram guide, the coach, the latest weekly brief and
// every blog post), so a crawler gets the facts in one fetch. Built from the
// same content the pages render, so it can't drift from them.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const qa = (items: { q: string; a: string }[]) => items.map((f) => `### ${f.q}\n${f.a}`).join('\n\n');

export async function GET(): Promise<Response> {
  const ig = getInstagramPageContent('en');
  const coach = getCoachPageContent('en', { monthly: `$${PRO_AI_PRICE_USD.monthly}`, yearly: `$${PRO_AI_PRICE_USD.yearly}` });
  const latest = (await listBriefDates())[0];
  const brief = latest ? (await getBrief(latest, 'en', false))?.editions.find((e) => e.id === 'general')?.markdown : null;

  const posts = BLOG_POSTS.map((p) => `## ${p.title}\nURL: ${SITE_URL}/blog/${p.slug}\nPublished: ${p.date}\n\n${p.body.trim()}${p.faq?.length ? `\n\n### Frequently asked questions\n\n${qa(p.faq)}` : ''}`).join('\n\n---\n\n');

  const body = `# WhoUnfollowed, full text

> WhoUnfollowed shows who unfollowed you and who doesn't follow you back on Instagram, Threads and TikTok, from the official data export you download yourself. No password, and the export is read in your browser. The web app is open source (AGPL-3.0) and so is the parser (MPL-2.0). Seeing who doesn't follow you back is free with no account. Pro AI (${PRO_AI_PRICE_SUMMARY}, cancel any time) adds who unfollowed you by name, every export kept, and a coach that remembers your account.

The short index is at ${SITE_URL}/llms.txt. This file holds the full text.

# Who unfollowed you on Instagram: the full guide
URL: ${SITE_URL}/instagram

${ig.intro}

## ${ig.stepsH}
${ig.steps.map((s, i) => `${i + 1}. ${s.t}: ${s.b}`).join('\n')}

## ${ig.listsH}
${ig.lists.map((l) => `- ${l.t}: ${l.b}`).join('\n')}

## ${ig.limitsH}
${ig.limits.map((l) => `- ${l.t}: ${l.b}`).join('\n')}

## ${ig.faqH}
${qa(ig.faq)}

# The Pro AI coach for Instagram
URL: ${SITE_URL}/instagram-coach

${coach.intro}

## ${coach.whyH}
${coach.why.map((i) => `- ${i.t}: ${i.b}`).join('\n')}

## ${coach.doH}
${coach.do.map((i) => `- ${i.t}: ${i.b}`).join('\n')}

## ${coach.seesH}
${coach.sees} ${coach.never}

## ${coach.priceH}
${coach.priceBody} ${coach.priceFree}

## ${coach.faqH}
${qa(coach.faq)}
${brief && latest ? `
# Latest weekly brief (${latest})
URL: ${SITE_URL}/instagram-updates/${latest}

${brief.replace(/^# /m, '## ').trim()}
` : ''}
# Blog

${posts}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
