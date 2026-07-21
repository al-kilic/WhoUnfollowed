// Plain data, no 'use client' directive. Must stay this way: page.tsx (a
// Server Component) imports this to build FAQPage JSON-LD, and importing a
// non-component value from a 'use client' module into server code is
// unreliable in production builds (works in dev, breaks at runtime after a
// production build). Keep FAQ content here, not inside WhatIsContent.tsx.
export const faqItems = [
  { q: 'Is WhoUnfollowed free?', a: 'Yes. Seeing your full non-followers list, mutual followers, and fans is free with no account required. Pro ($4.99/month) adds snapshot history, growth charts, and unfollow alerts.' },
  { q: 'Does WhoUnfollowed need my Instagram password?', a: 'No. There is no Instagram login on WhoUnfollowed. You upload a ZIP file Instagram emails directly to you. Your password is never involved.' },
  { q: 'Will Instagram ban my account for using WhoUnfollowed?', a: 'No. WhoUnfollowed uses Instagram\'s official GDPR data export. You are not using a third-party API, not scraping Instagram, and not violating any Terms of Service.' },
  { q: 'How long does it take to get results?', a: 'About 15 minutes end to end. 30 seconds to request your export, a few minutes for Instagram to email it, and 2 seconds for WhoUnfollowed to parse it.' },
  { q: 'Is WhoUnfollowed open source?', a: 'The core parser (packages/core) is MPL-2.0 licensed and public on GitHub. You can read exactly what happens to your data. The web app is AGPL-3.0, and anyone can self-host it, but Pro features (snapshot history across devices, email alerts, trend charts) require the cloud service because they depend on server infrastructure.' },
  { q: 'Does WhoUnfollowed work on iPhone and Android?', a: 'Yes. You can request your Instagram export and upload the ZIP from any mobile browser.' },
];
