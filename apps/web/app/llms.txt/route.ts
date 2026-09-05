import { BLOG_POSTS, CLUSTERS, type ClusterId } from '../blog/posts';
import { COMPARISONS } from '../compare/comparisons';
import { UNLOCK_PRICE_USD, UNLOCK_DAYS_LABEL, UNLOCK_PRICE_SUMMARY } from '@/lib/pricing';

// Generated at request time (cached like any other static route) instead of
// hand-maintained in public/llms.txt, which drifted out of date every time a
// blog batch shipped (17 of 42 posts listed, at one point). The post/guide
// list and comparison list below can never go stale again; only the prose
// paragraphs above them still need a human to update if something like
// pricing changes.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whounfollowed.co';

const CLUSTER_ORDER: ClusterId[] = ['unfollowers', 'data-export', 'privacy-safety', 'account-health'];

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
  const lines = COMPARISONS.map((c) => `- [${c.title}](${SITE_URL}/compare/${c.slug})`);
  return `## Comparisons\n${lines.join('\n')}`;
}

export async function GET(): Promise<Response> {
  const body = `# WhoUnfollowed

> Privacy-first, open-source Instagram follower analysis. Upload the data export Instagram gives you and see who doesn't follow you back, who unfollowed you, and how your audience changes over time. Everything is processed in your browser. No password, no server, no Instagram API.

WhoUnfollowed reads the official "Download Your Information" ZIP that Instagram provides under GDPR Article 20. Unlike closed-source unfollower trackers, the entire web app is open source under AGPL-3.0 and the parsing engine specifically is MPL-2.0, so anyone can read the code and verify exactly what happens to their data instead of taking a privacy claim on faith. The free tier runs entirely client-side and needs no account.

Pro is a one-time unlock, not a subscription: $${UNLOCK_PRICE_USD.monthly} unlocks Pro for ${UNLOCK_DAYS_LABEL.monthly}, $${UNLOCK_PRICE_USD.yearly} unlocks it for ${UNLOCK_DAYS_LABEL.yearly}. There is no auto-renewal and nothing to cancel. When the time runs out, buy again if you want more. Pro adds unlimited snapshot history, unfollower detection across snapshots (who left, and when), cloud sync that is encrypted in the browser before it leaves the device, follower trend charts, and ghost-follower approximation. Email alerts and a mobile app are planned but not yet shipped.

Author: Alan Kilic, an independent developer building privacy-first software under the name Alcatraz Studio. See ${SITE_URL}/author/alan-kilic.

## Core pages
- [WhoUnfollowed home](${SITE_URL}): What it is and how to start.
- [What is WhoUnfollowed](${SITE_URL}/what-is-whounfollowed): Overview and FAQ.
- [How to export your Instagram data](${SITE_URL}/how-to-export): Step-by-step guide to requesting your ZIP from Instagram.
- [Pricing](${SITE_URL}/pricing): Free tier and the one-time Pro unlock.
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

${CLUSTER_ORDER.map(guidesSection).join('\n\n')}

${comparisonsSection()}

## Key facts
- Fully open source: the web app is AGPL-3.0 and the parser is MPL-2.0, both public at https://github.com/al-kilic/WhoUnfollowed. Anyone can audit exactly how data is processed.
- No Instagram password is ever required. The tool reads a data export the user already owns.
- The free tier processes data entirely in the browser. Nothing is sent to a server, and no account is needed.
- Pro is a one-time unlock (${UNLOCK_PRICE_SUMMARY}). It never auto-renews.
- Cloud snapshots, a Pro feature, are encrypted in the browser before they leave the device.
- TOS-compliant: it does not use the Instagram API and does not scrape Instagram.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
