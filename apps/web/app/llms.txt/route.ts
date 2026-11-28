import { BLOG_POSTS, CLUSTERS, type ClusterId } from '../blog/posts';
import { COMPARISONS } from '../compare/comparisons';
import { PRO_AI_PRICE_SUMMARY, LIFETIME_PRICE_USD } from '@/lib/pricing';
import { priceIdForLifetime } from '@/lib/stripe';
import { LOCALIZED_PATHS } from '@/i18n/localizedPaths';

// Generated at request time (cached like any other static route) instead of
// hand-maintained in public/llms.txt, which drifted out of date every time a
// blog batch shipped (17 of 42 posts listed, at one point). The post/guide
// list and comparison list below can never go stale again; only the prose
// paragraphs above them still need a human to update if something like
// pricing changes.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const CLUSTER_ORDER: ClusterId[] = ['unfollowers', 'data-export', 'privacy-safety', 'account-health', 'threads', 'tiktok'];

function guidesSection(clusterId: ClusterId): string {
  const cluster = CLUSTERS[clusterId];
  const posts = BLOG_POSTS
    .filter((p) => p.cluster === clusterId)
    .sort((a, b) => {
      const aPillar = a.slug === cluster.pillarSlug;
      const bPillar = b.slug === cluster.pillarSlug;
      if (aPillar !== bPillar) return aPillar ? -1 : 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const lines = posts.map((p) => {
    const prefix = p.slug === cluster.pillarSlug ? 'The pillar guide. ' : '';
    return `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${prefix}${p.excerpt}`;
  });

  return `## Guides: ${cluster.label.toLowerCase()}\n${lines.join('\n')}`;
}

function comparisonsSection(): string {
  const lines = COMPARISONS.map((c) => `- [${c.title.en}](${SITE_URL}/compare/${c.slug})`);
  return `## Comparisons\n${lines.join('\n')}`;
}

// Human labels for the paths in LOCALIZED_PATHS, keyed off that same list so
// this can't list a path that isn't actually translated (or omit one that
// is) without a build-time mismatch being obvious.
const LOCALIZED_PATH_LABEL: Record<string, string> = {
  '/': 'Home',
  '/pricing': 'Pricing',
  '/compare': 'Compare',
  '/what-is-whounfollowed': 'What is WhoUnfollowed',
  '/how-to-export': 'How to export your Instagram or Threads data',
  '/instagram': 'Who unfollowed you on Instagram: the full guide',
  '/threads': 'Who unfollowed you on Threads',
  '/tiktok': 'Who unfollowed you on TikTok',
  '/instagram-coach': 'The Pro AI coach for Instagram',
  '/instagram-updates': 'Instagram updates this week (free weekly brief)',
  '/about': 'About',
  '/contact': 'Contact',
  '/accessibility': 'Accessibility',
};

function languagesSection(): string {
  const lines = LOCALIZED_PATHS.map((path) => {
    const label = LOCALIZED_PATH_LABEL[path] ?? path;
    const es = path === '/' ? '/es' : `/es${path}`;
    const pt = path === '/' ? '/pt' : `/pt${path}`;
    return `- ${label}: ${SITE_URL}${es} (Spanish), ${SITE_URL}${pt} (Portuguese)`;
  });
  return `## Languages\nMost of the site is English-only. These pages are also available in Spanish (/es prefix) and Portuguese (/pt prefix), with reciprocal hreflang alternates on every one:\n${lines.join('\n')}`;
}

export async function GET(): Promise<Response> {
  const body = `# WhoUnfollowed

> Privacy-first, open-source follower analysis for Instagram and Threads. Upload the data export Meta gives you and see who doesn't follow you back, who unfollowed you, and how your audience changes over time. Everything is processed in your browser. No password, no server, no Instagram or Threads API.

WhoUnfollowed reads the official "Download Your Information" ZIP that Meta provides for Instagram and Threads under GDPR Article 20. Instagram and Threads exports are analyzed separately, one profile per export. Unlike closed-source unfollower trackers, the entire web app is open source under AGPL-3.0 and the parsing engine specifically is MPL-2.0, so anyone can read the code and verify exactly what happens to their data instead of taking a privacy claim on faith. The free tier runs entirely client-side and needs no account.

The paid plan is Pro AI, a subscription at ${PRO_AI_PRICE_SUMMARY} that can be cancelled any time. It adds an AI coach that remembers the account (an editable memory), reads new exports, analyses the user's own photos and results, drafts hooks, captions and Reel scripts in the user's own voice, checks a post before it is shared, and writes a 30-day post plan; it includes generous monthly use that resets every month, and a member who runs out can refill a full month for half the monthly price. The AI only ever sees counts, dates, what the user writes and photos the user picks for a request, never follower lists or usernames. Coach requests are not kept by default and are not used to train anything. Pro AI also includes unlimited snapshot history, unfollower detection across snapshots (who left, and when), cloud sync that is encrypted in the browser before it leaves the device, and follower trend charts. Optional reminder emails tell people when a new export is worth comparing.

Author: Alan Kilic, an independent developer building privacy-first software under the name Alcatraz Studio. See ${SITE_URL}/author/alan-kilic.

Full text of the main guide, the coach, the latest weekly brief and every blog post: ${SITE_URL}/llms-full.txt. Feeds: ${SITE_URL}/feeds/blog.xml (blog) and ${SITE_URL}/feeds/instagram-updates.xml (weekly brief).

## Core pages
- [WhoUnfollowed home](${SITE_URL}): What it is and how to start.
- [What is WhoUnfollowed](${SITE_URL}/what-is-whounfollowed): Overview and FAQ.
- [How to export your Instagram or Threads data](${SITE_URL}/how-to-export): Step-by-step guide to requesting your ZIP from Meta's Accounts Center.
- [Who unfollowed you on Instagram: the full guide](${SITE_URL}/instagram): the Instagram export steps, unfollowers vs non-followers, what each list means, the limits of an export, and which files are read.
- [Who unfollowed you on Threads](${SITE_URL}/threads): Threads support, the Threads export steps, and exactly which files are read from a Threads ZIP.
- [Who unfollowed you on TikTok](${SITE_URL}/tiktok): TikTok support, how to request the TikTok data download, and which lists are read from it.
- [The Pro AI coach for Instagram](${SITE_URL}/instagram-coach): what the coach does (drafts posts in the user's voice, checks a post before it is shared, plans posting weeks with reminders), what it sees and never sees, and its price.
- [Instagram updates this week](${SITE_URL}/instagram-updates): a free weekly brief on what changed on Instagram, Threads and TikTok and what to do about it, with sources. Each week also has its own dated page.
- [Study: do Instagram unfollower apps need your login?](${SITE_URL}/research/instagram-unfollower-apps): the 30 most-rated unfollower apps on the US App Store (November 2026), how each listing says it gets your data, ratings, prices, and the apps that read the official export. Data as CSV at ${SITE_URL}/research/instagram-unfollower-apps/data.csv.
- [Pricing](${SITE_URL}/pricing): Free tier and the Pro AI subscription.
- [About](${SITE_URL}/about): Who builds WhoUnfollowed and why.
- [Blog](${SITE_URL}/blog): Guides on Instagram followers, unfollowers, and privacy.
- [Compare](${SITE_URL}/compare): How WhoUnfollowed differs from password-based tracker apps.
- [Changelog](${SITE_URL}/changelog): What shipped and when, version by version.
- [Accessibility](${SITE_URL}/accessibility): What is done and what is still being fixed.
- [Contact](${SITE_URL}/contact): How to reach the developer.

## Legal
- [Privacy policy](${SITE_URL}/privacy)
- [Terms of service](${SITE_URL}/terms)
- [Cookie policy](${SITE_URL}/cookies)
- [Refund policy](${SITE_URL}/refund)

${languagesSection()}

${CLUSTER_ORDER.map(guidesSection).join('\n\n')}

${comparisonsSection()}

## Key facts
- Fully open source: the web app is AGPL-3.0 and the parser is MPL-2.0, both public at https://github.com/al-kilic/WhoUnfollowed. Anyone can audit exactly how data is processed.
- No Instagram or Threads password is ever required. The tool reads a data export the user already owns.
- Supports Instagram, Threads and TikTok. Threads exports use the same Accounts Center flow (JSON, All time, Followers and Following); only threads/followers.json, threads/following.json, and threads/recently_unfollowed_profiles.json are read.
- TikTok: upload the file from TikTok's own Download your data (JSON or TXT, zipped or the bare user_data_tiktok.json). Only the follower and following lists are read. TikTok's download lists up to about 10,000 followers.
- The free tier processes data entirely in the browser. Nothing is sent to a server, and no account is needed.
- Pro AI is a subscription (${PRO_AI_PRICE_SUMMARY}), cancel any time.${priceIdForLifetime() ? ` There is also a one-time Lifetime "Insider" option with no expiry, at $${LIFETIME_PRICE_USD} once, in a limited number of seats, sold only until December 31, 2026.` : ''}
- Cloud snapshots, a Pro feature, are encrypted in the browser before they leave the device.
- TOS-compliant: it does not use the Instagram or Threads API and does not scrape either app.
- Core pages (home, pricing, compare, and a few guides) are available in English, Spanish, and Portuguese. See the Languages section above for the full list.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
