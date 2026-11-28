import { fmt, type StudyStats } from './stats';

// Copy for the study page (English for now, like the blog). Built from the
// computed stats so every number matches the data table.
export function studyContent(s: StudyStats) {
  return {
    meta: {
      title: 'Do Instagram Unfollower Apps Need Your Login? We Checked the Top 30',
      description: `We read the App Store listings of the ${s.n} most-rated Instagram unfollower apps. ${s.needsAccount} need your account, ${s.unstated} don't say how they get your data, and none reads Instagram's own export.`,
    },
    eyebrow: 'Research · November 2026',
    h1: 'Do Instagram unfollower apps need your login?',
    h1Sub: `We checked the ${s.n} most-rated ones on the App Store.`,
    lead: `Instagram doesn't tell you who unfollowed you, so millions of people install an app that will. We read the App Store listing of every one of the ${s.n} most-rated Instagram unfollower apps in the US store and sorted them by one question: how do they get your data?`,
    findingsH: 'What we found',
    tiles: [
      { n: `${s.readsExport} of ${s.n}`, t: "say they read Instagram's official data export, the one way that never touches your account." },
      { n: `${s.needsAccount} of ${s.n}`, t: `need your Instagram account: ${s.stated} say you sign in, ${s.features} list features that only work inside your account.` },
      { n: `${s.unstated} of ${s.n}`, t: "don't say anywhere in their listing how they get your followers." },
      { n: `${s.weekly} of ${s.n}`, t: 'list a weekly subscription (where a price is shown, $2.99 to $4.99 a week).' },
      { n: `${s.stale} of ${s.n}`, t: 'have not been updated in more than a year.' },
      { n: `${s.profileViewers} of ${s.n}`, t: "claim to show who viewed your profile, which Instagram doesn't share with anyone." },
    ],
    gapH: 'The safe apps are almost invisible',
    gap: `We found ${s.exportApps} apps whose listing says they read your official export instead of asking you to log in. Together they have ${fmt(s.exportRatings)} ratings. The top ${s.n} have ${fmt(s.topRatings)}, about ${fmt(s.ratio)} times more. The biggest export-based app has ${fmt(s.biggestExport)} ratings.`,
    barLabel: `How the top ${s.n} apps get your data`,
    legend: { account: 'Needs your Instagram account', unstated: "Doesn't say", export: 'Reads your official export' },
    whyH: 'Why it matters',
    why: [
      "Instagram's terms don't allow accessing or collecting information in unauthorized ways, and accounts that use login-based apps can be flagged, limited or locked.",
      'An app signed in to your account can do anything you can: read your messages, follow and unfollow, post. You are trusting a developer you have never heard of with all of it.',
      'Instagram already gives you everything an unfollower check needs, for free: your followers and following lists, in the data export from Accounts Center. No app needs your password to compare them.',
    ],
    tableH: `All ${s.n} apps`,
    tableNote: 'Ranked by number of App Store ratings (US). "Evidence" quotes the app\'s own listing. Prices are the ones the listing shows; blank means the listing doesn\'t list them.',
    cols: ['#', 'App', 'Ratings', 'Last update', 'How it gets your data', 'Evidence from the listing', 'Prices listed'],
    access: { stated: 'Says you sign in', features: 'Needs your account', unstated: "Doesn't say" },
    exportH: 'Apps that read your official export',
    exportNote: 'These listings say they work from the data export you download from Instagram, with no login.',
    exportCols: ['App', 'Developer', 'Ratings', 'Last update'],
    methodH: 'How we did it',
    method: [
      `On ${'November 27, 2026'} we searched Apple's public App Store data (US store) for 10 terms: unfollowers, who unfollowed me, unfollow tracker, followers tracker, instagram followers, followers reports, non followers, followers unfollowers, ghost followers, unfollowers instagram.`,
      'We kept apps that track Instagram followers or unfollowers or analyze your Instagram account, and left out Instagram itself and apps that sell followers, likes or reposts. Then we ranked them by number of ratings and took the top 30.',
      'For each app we read its full App Store description by hand. "Says you sign in" means the listing says so. "Needs your account" means it lists features that can only work inside your account, such as viewers of your own stories, following or unfollowing for you, or your Facebook friend list. Everything else is "Doesn\'t say".',
      'We also looked up every app we could find that says it reads the official export, including ones named in web articles.',
    ],
    limitsH: 'What this study does not show',
    limits: [
      'We read listings, not code. An app may work differently from what its listing says, and "doesn\'t say" doesn\'t mean an app is unsafe.',
      'Ratings and prices change daily, and the App Store differs by country. This is a snapshot of the US store on one day.',
      'WhoUnfollowed is in this market: we make a web tool that reads the official export. That is why we checked, and why the data and method are here for you to verify.',
    ],
    faqH: 'Questions',
    faq: [
      { q: 'Do Instagram unfollower apps need your password?', a: `Most of the popular ones need access to your account. Of the ${s.n} most-rated unfollower apps on the US App Store in November 2026, ${s.needsAccount} either say you sign in or list features that only work inside your account, and ${s.unstated} don't say how they get your data. None says it reads Instagram's official data export.` },
      { q: 'Is there a safe way to see who unfollowed you on Instagram?', a: "Yes. Request your followers and following lists in Instagram's Accounts Center (Download your information, JSON, All time) and compare two exports taken at different times. Tools that read that export, like WhoUnfollowed, never need your password or log in to your account." },
      { q: 'Can an app show who viewed my Instagram profile?', a: `No. Instagram does not share who viewed your profile with anyone, so apps that claim to show profile viewers are guessing at best. ${s.profileViewers} of the ${s.n} apps we checked make that claim.` },
      { q: 'How much do Instagram unfollower apps cost?', a: `Most are free to download and charge a subscription inside the app. ${s.weekly} of the top ${s.n} list a weekly plan (where the price is shown, $2.99 to $4.99 a week), and the monthly plans we saw ran from $0.99 to $12.99.` },
    ],
    citeH: 'Use this data',
    cite: 'You are free to cite and republish these numbers with a link to this page. Download the full table as CSV.',
    csv: 'Download the data (CSV)',
    ctaH: 'Check yours without a password',
    ctaSub: "Upload the export Instagram gives you and see who doesn't follow you back, in your browser. Free, no login.",
    cta: 'Upload your Instagram ZIP',
    compare: 'See our app-by-app comparisons',
  };
}

export type StudyContent = ReturnType<typeof studyContent>;
