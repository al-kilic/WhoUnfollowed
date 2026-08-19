import type { ArtVariant } from './BlogArt';

/** Topic clusters for the pillar-and-cluster internal-linking structure. */
export type ClusterId = 'unfollowers' | 'data-export' | 'privacy-safety' | 'account-health';

export interface BlogPost {
  slug: string;
  /** Topic cluster this post belongs to (pillar-and-cluster SEO structure). */
  cluster: ClusterId;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  primaryKeyword: string;
  /** Abstract-geometric cover illustration shown on cards and the article hero. */
  art: ArtVariant;
  /**
   * Optional real cover photo (self-hosted under /public/blog). When set, it is
   * shown on the card and article hero instead of the abstract `art`. `art` is
   * kept as a fallback. Photos are free-licensed from Unsplash (no attribution
   * required); source slugs are noted next to each post below.
   */
  image?: string;
  /** Accessible/SEO alt text for the cover illustration or photo. */
  imageAlt: string;
  /**
   * Topic-specific end-of-post call to action. Names the pain from THIS post
   * and points at WhoUnfollowed as the fix, instead of a one-size-fits-all
   * prompt. Falls back to a generic CTA when absent. `proNudge`, when set,
   * adds a second line linking to /pricing for tracking-over-time posts
   * (snapshot history, unfollow alerts, ghost/charts).
   */
  cta?: {
    heading: string;
    body: string;
    buttonLabel: string;
    proNudge?: string;
  };
  body: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-did-i-lose-followers-overnight-on-instagram',
    cta: {
      heading: 'Find out exactly who dropped off.',
      body: 'An overnight dip has names attached to it. Upload your own Instagram export and WhoUnfollowed shows precisely who left, in your browser, in about two minutes. No password, nothing uploaded.',
      buttonLabel: 'See who unfollowed you',
      proNudge: 'Want to catch the next drop the moment it happens? Pro keeps your snapshot history and emails you when someone unfollows.',
    },
    cluster: 'unfollowers',
    title: 'Why Did I Lose Followers Overnight on Instagram?',
    metaTitle: 'Why Did I Lose Followers Overnight on Instagram?',
    metaDescription: 'Woke up with fewer followers? Here are the real reasons Instagram counts drop overnight, from bot purges to deactivations, and how to see who left.',
    excerpt: 'You went to bed at 8,200 followers and woke up at 8,050. Nobody sent you a note explaining it. Here are the actual reasons counts drop overnight, and how to find out exactly who dropped off.',
    date: 'July 2, 2026',
    readTime: '5 min',
    tag: 'Guide',
    primaryKeyword: 'why did I lose followers overnight on Instagram',
    art: 'ratio',
    // Unsplash: JKUTrJ4vK00 (analytics graphs on a laptop screen)
    image: '/blog/lost-followers-overnight.jpg',
    imageAlt: 'A laptop screen showing analytics dashboards and graphs, representing tracking an overnight drop in Instagram followers',
    body: `You didn't post anything controversial. You didn't change your username. But the number went down while you slept, and Instagram offers no explanation. A follower count that drops overnight feels personal, but most of the time it isn't about you at all.

Here are the real reasons the number moves, in rough order of how often they're the cause.

## 1. Instagram purged fake and bot accounts

This is the most common reason for a sudden, larger drop. Instagram periodically sweeps its platform and removes accounts it identifies as fake, spam, or bot-operated. When it does, every real account those bots were "following" loses them all at once. If you lost a chunk of followers overnight across many accounts at scale, a platform purge is the likely explanation, and there is nothing wrong with your content.

The upside: these were never real people. They inflated your count and dragged down your engagement rate. Losing them is a cleaner audience, even if the number stings for a day. This is closely related to the [ghost followers problem](/blog/instagram-ghost-followers-how-to-find-and-remove-them).

## 2. Real people unfollowed you

The ordinary one. People reassess who they follow, clear out their feed, or simply lose interest. A handful of unfollows a day is normal for any active account. Instagram never tells the person you unfollowed, and it never tells you either, which is why this feels invisible until you check the number. We covered exactly what is and isn't notified in [does Instagram notify when you unfollow someone](/blog/does-instagram-notify-when-you-unfollow-someone).

## 3. Accounts were deactivated or deleted

When someone deactivates their account (temporarily or permanently), they disappear from your followers list until they come back. A wave of deactivations, common after platform controversies or at the start of a new year, shows up on your end as followers vanishing for no reason you can see.

## 4. You got blocked, or you blocked someone

Blocking is mutual. If someone blocks you, they drop off your followers. If you block or remove a follower, same result. None of it generates a notification, so it lands as a silent decrement.

## 5. A viral post attracted follows that didn't stick

If a reel popped off recently, it may have pulled in follows from people who liked one video but had no real interest in your account. Those follows often reverse within a few days once the post stops circulating. A brief spike followed by a dip is usually this, not a penalty.

## The problem: the number tells you nothing

Here's the frustrating part. Instagram shows you a count, but it never shows you the delta. You can see that you lost 150 followers. You cannot see which 150. And you cannot tell a bot purge (good) from a real person you care about unfollowing (worth knowing) just by staring at a smaller number.

To actually understand a drop, you need to compare who followed you before against who follows you now.

![Instagram and other social media app icons on a phone home screen](/blog/lost-followers-overnight-2.jpg)

## How to see exactly who left

Instagram is required under GDPR to give you a copy of your own follower data. You can request it any time, and it includes your complete followers list. Take one export today and another in a couple of weeks, and the difference between them is your precise list of who unfollowed.

### Step 1: Export your data

In Instagram, go to Settings, then "Your activity," then "Download your information." Choose "Followers and following," set the format to JSON, and submit. The link usually arrives by email within a few hours. (Full walkthrough: [how to download your Instagram data](/blog/how-to-download-your-instagram-data).)

### Step 2: Compare two exports over time

Drop your first export into [WhoUnfollowed](/). It reads the file inside your browser, so nothing is uploaded. When you add a second export later, it shows you exactly who dropped off between the two dates, by name. That's how you tell a bot purge from a real unfollow: a purge is a pile of dead-looking accounts, a real unfollow is someone you recognize.

No app needs your Instagram password to do this. If one asks for it, [close the tab](/blog/why-instagram-follower-trackers-ask-for-your-password).

## The honest takeaway

An overnight drop is almost always one of the five reasons above, and most of them are harmless or even good for your account's health. The number alone will drive you a little crazy because it hides the one thing you actually want to know: who. Keep your own record, compare it over time, and the mystery goes away.`,
  },
  {
    slug: 'how-to-download-your-instagram-data',
    cta: {
      heading: 'Got your export? Put it to work.',
      body: 'Once your ZIP arrives, WhoUnfollowed reads it in your browser and turns it into a clear list of who does not follow you back and who unfollowed you. No password, no upload to any server.',
      buttonLabel: 'Analyze your export free',
    },
    cluster: 'data-export',
    title: 'How to Download Your Instagram Data (Step by Step)',
    metaTitle: 'How to Download Your Instagram Data (Step by Step)',
    metaDescription: 'A plain walkthrough for requesting your Instagram data export: where the setting is, JSON vs HTML, how long it takes, and what is actually inside the ZIP file.',
    excerpt: 'Instagram lets you download a full copy of your own data, including your complete followers and following lists. Here is exactly where the setting is, which format to pick, and what you get.',
    date: 'July 2, 2026',
    readTime: '5 min',
    tag: 'Guide',
    primaryKeyword: 'how to download your Instagram data',
    art: 'search',
    // Unsplash: hdQGAz1pQ_M (a person holding a phone showing an Instagram profile)
    image: '/blog/download-instagram-data.jpg',
    imageAlt: 'A person holding a phone showing an Instagram profile, representing requesting your Instagram data export',
    body: `Instagram buries this feature, but it is one of the most useful things you can do with your account. Under GDPR Article 20, the platform has to give you a portable copy of your own data on request, and that includes your full followers and following lists, your posts, your messages, and more.

You do not need anyone's app or your password shared with a third party to get it. Here is the whole process.

## Where to find the setting

The menu wording shifts slightly between app versions, but the path is stable:

- **On the mobile app:** Profile, then the menu (☰) in the top right, then Settings and activity. Scroll to "Your activity," then tap "Download your information."
- **On desktop:** Go to your profile, open Settings, then find "Your activity" and "Download your information." You can also go straight to the Accounts Center download page from your browser.

Instagram may ask you to confirm your password (its own login prompt, not a third party) before it starts the request.

## The one setting that matters: JSON, not HTML

When you request the export, Instagram asks for a format. You get two choices, and the difference matters if you plan to actually analyze the data.

- **JSON** is structured data. It is the format tools can read cleanly and compare over time. Pick this one.
- **HTML** is a set of web pages meant for casual human browsing. It is harder for tools to parse reliably.

Choose **JSON**. If you already requested HTML, it can still work with a good parser, but JSON is the clean path.

![A person at a desk using a laptop to review data on screen](/blog/download-instagram-data-2.jpg)

## Narrow the request so it comes back fast

By default Instagram tries to export everything, which for an old account can be gigabytes and can take days. You don't need all of it to see your followers.

When you set up the request, choose to customize the information instead of "all available information," and select just **"Followers and following."** Set the date range to "All time." A narrow request like this usually comes back within a few hours instead of days.

## How long it takes

For a focused followers-and-following request, expect a few hours, sometimes faster. For a full account export, Instagram warns it can take up to 14 days, though it is often quicker. You will get an email from Instagram with a download link when it is ready. The link expires after a few days, so grab it when it lands.

## What is actually inside the ZIP

You will download a ZIP archive. If you open it, the files that matter for follower analysis live in one folder:

- \`connections/followers_and_following/followers_1.json\` is your followers list. Very large accounts get this split across \`followers_2.json\`, \`followers_3.json\`, and so on.
- \`connections/followers_and_following/following.json\` is the list of accounts you follow.

Each entry holds a username, a profile link, and a timestamp for when the connection was made. You do not have to open or understand any of this yourself. A tool reads it for you.

## What to do with it

The export is just data until you compare the two lists. The moment you diff your followers against your following, you get the answers Instagram hides:

- Who you follow that [doesn't follow you back](/blog/who-doesnt-follow-you-back-on-instagram)
- Who [unfollowed you](/blog/how-to-see-who-unfollowed-you-on-instagram) since your last export
- Which followers are likely [inactive or ghosts](/blog/instagram-ghost-followers-how-to-find-and-remove-them)

Drop the ZIP into [WhoUnfollowed](/) and it reads the file entirely in your browser. Nothing is uploaded to a server. You can switch off your wifi before you drop the file in, and it still works, which is the simplest proof that your data never leaves your device.

## A note on safety

The reason to get comfortable with the official export is that it removes any excuse to hand your password to a follower-tracking app. Those apps log in as you and pull data through Instagram's private API, which breaks Instagram's Terms of Use and is a common reason accounts get restricted. The export Instagram gives you is already yours. A good tool just reads it, no password required.

## Why the Wait Exists

A "Followers and following" request usually comes back in a few hours, but a full account archive can take up to 14 days, and it's worth knowing why. Instagram doesn't generate your export on demand the instant you click the button. The request goes into a batch processing queue that compiles data across multiple internal systems: your profile, your posts, your messages, your connections, each stored differently and pulled together only when someone asks for a copy. A narrow request touches one of those systems. A full archive touches all of them, which is the entire reason narrowing the request to just your connections data is worth doing even if you eventually want the rest.

## Narrow Request vs Full Archive, Side by Side

- **Followers and following only:** typically a few hours, a file usually under a few megabytes, contains just your connections data with timestamps.
- **Full "all available information":** up to 14 days, can run into gigabytes for an active account, includes posts, stories, messages, comments, ad interests, and login history alongside your connections data.

If your goal is follower analysis, the narrow request gets you everything you need without the wait or the file size.

## If the Export Never Arrives

A download link that doesn't show up within the expected window usually has one of a few explanations. Check your spam or promotions folder first. Instagram's export emails sometimes land there, especially on the first request from a given account. If it's genuinely been longer than the estimate (a few hours for a narrow request, 14 days for a full archive), submit a fresh request rather than waiting indefinitely. Also worth knowing: the download link Instagram sends expires after a few days. If you requested the export a while back and only just found the email, the link may already be dead, in which case a new request is the only fix.

## Mobile vs Desktop: What Actually Differs

The setting lives in the same place conceptually on both, but the path to it looks different enough to trip people up. On mobile, it's nested under your profile menu and "Settings and activity." On desktop, Instagram increasingly routes this through the shared Accounts Center rather than a page unique to Instagram, since Accounts Center is shared across Instagram, Facebook, and Threads for anyone with linked accounts. If you manage multiple Meta accounts, double check you're requesting the export for the right one. Accounts Center makes it easy to be logged into several at once.

## What to Do With the File Afterward

Once you've uploaded the ZIP somewhere that reads it locally, like WhoUnfollowed, there's no ongoing reason to keep the file in your Downloads folder indefinitely, though keeping the last one or two exports is genuinely useful. Having a prior export on hand is what lets you compare against a newer one later and see exactly who unfollowed you in between. Store a couple of recent exports somewhere you'll remember, delete the rest, and treat the file the same way you'd treat any personal data export: useful to keep briefly, not something to leave scattered across every device you own.`,
  },
  {
    slug: 'is-it-safe-to-mass-unfollow-on-instagram',
    cta: {
      heading: 'Unfollow the right people, safely.',
      body: 'Before you mass unfollow, see exactly who does not follow you back so you only cut dead weight. WhoUnfollowed builds that list from your own export, in your browser, with no password and nothing stored.',
      buttonLabel: 'Get your non-follower list',
    },
    cluster: 'privacy-safety',
    title: 'Is It Safe to Mass Unfollow on Instagram?',
    metaTitle: 'Is It Safe to Mass Unfollow on Instagram?',
    metaDescription: 'Thinking of unfollowing a lot of accounts at once? Here is how Instagram\'s action limits work, what triggers a block, and a safer way to clean up.',
    excerpt: 'Cleaning up who you follow is healthy. Doing it too fast, or with the wrong app, is how accounts get temporarily blocked. Here is where the line actually is.',
    date: 'July 2, 2026',
    readTime: '5 min',
    tag: 'Growth',
    primaryKeyword: 'is it safe to mass unfollow on Instagram',
    art: 'split',
    // Unsplash: z3kBG5xIhjo (a smartphone showing the Instagram icon)
    image: '/blog/mass-unfollow-safe.jpg',
    imageAlt: 'A smartphone displaying the Instagram logo on a plain background, representing unfollowing accounts on Instagram',
    body: `Unfollowing accounts that don't follow you back is one of the fastest ways to tidy up your presence and improve your [follow ratio](/blog/instagram-follow-ratio-what-it-means-how-to-improve-it). The instinct to blast through the whole list in one sitting is understandable. It is also how people get their account temporarily blocked.

The short version: unfollowing is safe. Mass unfollowing, done fast or through a sketchy app, is not. Here is why, and where the line sits.

## Instagram has action limits (it just won't tell you the number)

Instagram enforces rate limits on repeated actions, including follows and unfollows, to fight spam and automation. It deliberately does not publish the exact thresholds, because a published number is a number bots would tune against. What is well established from years of user reports:

- Rapid, repetitive unfollowing in a short window is the pattern that trips the system.
- Newer accounts and accounts with little history get less rope than established ones.
- The usual penalty is an "Action Blocked" message that temporarily stops you from following or unfollowing, typically for a few hours up to a couple of days. Repeat offenses stretch the block.

A rough, conservative rule people use is to keep unfollows spaced out, in the range of a few dozen per hour rather than hundreds, with pauses. The goal is to look like a person, not a script.

## What actually triggers a block

It isn't the total number so much as the speed and the pattern. Instagram's systems watch for:

- **Bursts.** Two hundred unfollows in ten minutes reads as automation.
- **Machine rhythm.** Perfectly even timing between actions is a giveaway. Humans are irregular.
- **Third-party automation.** Apps that unfollow on your behalf are the biggest red flag of all.

![A hand holding a phone open to the Instagram login screen](/blog/mass-unfollow-safe-2.jpg)

## The real danger is the "mass unfollow app," not the unfollowing

Search for a way to unfollow everyone at once and the results fill with apps that promise to do it automatically. This is where accounts actually get hurt, for two separate reasons.

First, these apps require your Instagram username and password so they can act as you. That breaks Instagram's Terms of Use on its own, and it means an automated tool is now hammering the action limits from your account. When the block comes, it lands on you, not the app.

Second, you have handed your credentials to a third party whose business is unclear. That is the exact pattern we broke down in [why follower trackers ask for your password](/blog/why-instagram-follower-trackers-ask-for-your-password). A password is worth something to these apps, and a breach of their servers puts your login in a dump.

There is no version of a bulk auto-unfollow app that is both effective and safe. The more effective it is at speed, the faster it trips Instagram's limits.

## The safer way to clean up your following list

You don't need to unfollow everyone. You need to unfollow the right accounts, deliberately, at a human pace. That starts with knowing who they are.

### Step 1: Get your list of non-followers

Instagram won't show you who you follow that doesn't follow back. Your data export will. Request it (here's [how to download your Instagram data](/blog/how-to-download-your-instagram-data)), then drop the ZIP into [WhoUnfollowed](/). It reads the file in your browser and hands you every account you follow that doesn't follow you back, on one screen. Nothing is uploaded, and no password is involved.

### Step 2: Triage, don't blast

Not every non-follower should go. Brands and creators you follow for content are fine to keep. The accounts worth removing are the ones you followed hoping for a follow back that never came. WhoUnfollowed sorts them so you can make real decisions instead of guessing.

### Step 3: Unfollow manually, in sittings

Do the unfollowing yourself, inside the Instagram app, a batch at a time. It is slower than a magic button, but it never gets you blocked, and it keeps a human in the loop deciding who stays. Spread a large cleanup across a few days rather than one marathon.

## The bottom line

Is it safe to mass unfollow on Instagram? Unfollowing thoughtfully, at a human pace, is completely safe. Unfollowing hundreds of accounts in minutes, especially through an app that wants your password, is how you earn an action block or worse. Get the exact list of who's worth removing, then trim it by hand. Slower is the whole point.`,
  },
  {
    slug: 'how-to-see-who-unfollowed-you-on-instagram',
    cta: {
      heading: 'See who unfollowed you, safely.',
      body: 'No risky login. Upload the export Instagram already gives you and WhoUnfollowed shows the exact names in your browser in about two minutes. The parser is open source, so you can verify it yourself.',
      buttonLabel: 'See who unfollowed you',
      proNudge: 'Checking regularly? Pro stores your history and alerts you the moment someone leaves.',
    },
    cluster: 'unfollowers',
    title: 'Who Unfollowed You on Instagram? How to See (Without Getting Banned)',
    metaTitle: 'Who Unfollowed You on Instagram? How to See',
    metaDescription: 'Most follower trackers put your account at risk. Here\'s how to see who unfollowed you using Instagram\'s own data export, no password required.',
    excerpt: 'Every popular "who unfollowed me" tool works the same way: they ask for your Instagram password, then use it to call Instagram\'s API on your behalf. That\'s a TOS violation. Here\'s the safe alternative.',
    date: 'May 15, 2026',
    readTime: '4 min',
    tag: 'Guide',
    primaryKeyword: 'who unfollowed me on Instagram',
    art: 'search',
    // Unsplash: Ebb8fe-NZtM (hand holding a phone showing Instagram Insights)
    image: '/blog/who-unfollowed-hero.jpg',
    imageAlt: 'A hand holding a phone showing Instagram Insights with reach and account activity stats',
    body: `The short answer: Instagram will not tell you who unfollowed you, but you can see it yourself by comparing two exports of your own data over time. No password or third-party app required.

If you typed "who unfollowed me instagram" into Google hoping for a direct answer, you're not alone. It's one of the most common searches around this problem, and Instagram simply doesn't have a built-in screen for it. The method below is the closest thing to that answer that actually exists.

Most follower trackers work fine, right until your account gets flagged, restricted, or permanently disabled.

The reason is straightforward. These tools ask for your Instagram password so they can log in as you, call Instagram's private API, and pull your follower data. Instagram explicitly bans this in its Terms of Use. When their systems detect unusual API activity (and they do), the account that gets punished is yours, not the app's.

There is a safer way. Instagram is legally required to give you a copy of your own data under GDPR Article 20. That includes your full followers and following lists. You request the file directly from Instagram's settings, download it, and hand it to a tool that reads it locally in your browser. No password. No API. No risk.

![A hand holding a phone beside a laptop, entering a numeric code to unlock an account](/blog/who-unfollowed-inline.jpg)

## Step 1: Request Your Data Export from Instagram

Open Instagram on mobile or desktop. Go to Settings, then "Your activity," then "Download your information." Select [JSON format, not HTML](/blog/instagram-data-export-json-vs-html). Choose "Followers and following" from the data categories. Submit the request.

Instagram typically delivers the export within a few hours, though [it can take longer for larger accounts](/blog/how-long-does-an-instagram-data-request-take). You'll get an email with a download link.

## Step 2: Download the ZIP File

Click the link in the email and download your file. It's a ZIP archive containing your account data. The files you need are inside the \`connections/followers_and_following/\` folder.

## Step 3: Upload the ZIP to WhoUnfollowed

Go to [whounfollowed.co](/) and drop your ZIP into the upload zone. The app reads the file entirely inside your browser. Nothing is sent to a server. You can disconnect from the internet before uploading if you want to verify this yourself.

If you want to see who specifically unfollowed you between two points in time, upload a second ZIP from a later date. WhoUnfollowed diffs them and shows you exactly who dropped off.

## What You'll See

- [People you follow who don't follow you back](/blog/who-doesnt-follow-you-back-on-instagram)
- New followers since your last export
- Mutual followers
- Unfollowers (when comparing two exports)

## Why This Approach Is Different

Search "instagram unfollow tracker" and almost every result asks for your login before showing you anything. That's not an oversight in their product design. Credential access is often how they build their data business. WhoUnfollowed was built specifically to not need it. The ZIP your Instagram account generates is already yours. We just read it, entirely on your device, with no login step anywhere in the process.

### Is there an app to see who unfollowed you on Instagram?

Yes. WhoUnfollowed is exactly that: an app, not an Instagram feature, built for the sole purpose of showing you who unfollowed you. Some people search for this as an "unfollow checker," others call it a tracker, but it's the same job either way: comparing two exports and showing you the difference. The difference from most of the results you'll find searching for one is what it asks of you first. Password-based apps want your Instagram login before they show you anything. This one only asks for the ZIP file Instagram already emailed you, and it reads that file in your browser rather than sending it anywhere.

## Why Instagram Doesn't Just Show You This Directly

It's a fair question. Instagram already has both lists internally, follower and following, so a "who unfollowed me" screen is well within its technical reach. It doesn't build one, and the likely reason is behavioral, not technical. Surfacing every unfollow would turn a quiet, low-friction action into a visible, socially charged one. People would think twice before unfollowing an ex, an old coworker, or a brand they got tired of, and that friction cuts against Instagram's interest in people following and unfollowing freely. The gap between what the platform could show and what it does show is exactly the space that data-export tools fill.

## Non-Followers, Unfollowers, and Ghosts: Know the Difference

These three terms get used interchangeably, but they describe different things and knowing which one you actually want to see saves time.

- **Non-followers** are accounts you currently follow that have never followed you back. You can find this from a single export. No history needed.
- **Unfollowers** are accounts that followed you at some point and stopped. Finding these requires two exports taken at different times, so the tool can diff them and show you who dropped off the list.
- **Ghost followers** are accounts that still follow you but show no sign of being an active, engaged person: no posts, no profile photo, or a long-dormant history. They're a subset of your followers, not your following, and they matter for engagement rate more than for the unfollower question. See [our full breakdown of ghost followers](/blog/instagram-ghost-followers-how-to-find-and-remove-them) if that's what you're actually trying to solve.

If your goal is specifically "who stopped following me," you want the unfollowers workflow, which means keeping at least two exports on hand.

## How Often You Should Actually Check

There's no need to export weekly. For most accounts under 10,000 followers, natural churn is small day to day, and checking too often just means comparing snapshots that barely differ. A monthly export is enough to catch meaningful movement without turning it into a habit you obsess over. The exception is right after something notable: a viral post, a public controversy, or a big content pivot. Those are the moments worth a fresh export on both sides, since that's when unfollows cluster.

## Mistakes That Waste the Effort

A few habits undercut the whole point of doing this safely:

- **Requesting HTML instead of JSON.** HTML is fine to skim by eye but strips the timestamps that make comparison reliable. Pick JSON every time, covered in more depth in [our JSON vs HTML breakdown](/blog/instagram-data-export-json-vs-html).
- **Only ever taking one export.** A single snapshot tells you who doesn't follow you back right now. It cannot tell you who unfollowed you, because there's nothing to compare it against.
- **Deleting the old export after checking it once.** Keep your last few exports somewhere safe. They're small JSON files, and having them on hand is what makes the next comparison possible.
- **Falling back to a password-based app out of impatience.** The official export can take a few hours. That wait is the entire reason the safe method has zero ban risk. Skipping it defeats the purpose.

## Quick Answers

**Can I see who unfollowed me today, right now, with no prior export?** No. Without a previous snapshot to compare against, there's nothing to diff. The earliest you can start tracking unfollowers is from your very next export forward.

**Does this work for private accounts?** Yes. Your data export includes your own followers and following lists regardless of whether your account is public or private, since it's your data either way.

**Will the person know I checked?** No. Reading your own export is entirely local to your device and involves no interaction with the other account at all. It's the same privacy profile as looking at your own following list, just organized usefully.

**Is there a limit to how often I can request an export?** Instagram doesn't publish a hard cap, but requesting one every day is unnecessary and slow to process anyway. Monthly is a reasonable cadence for most accounts.

**What if I only have one export and want to check right now?** You can still see everything except unfollowers: your current non-followers, your mutuals, and your full following list broken out clearly. That's genuinely useful on its own. The unfollower-specific view is the only piece that has to wait for a second export.

**Does this method work on accounts with hundreds of thousands of followers?** Yes, though the export itself gets paginated into multiple files (\`followers_1.json\`, \`followers_2.json\`, and so on) rather than one giant file. A tool built to read the export format handles the merge automatically, so it makes no practical difference to how you use it.

If a tool asks for your Instagram password, close the tab.`,
  },
  {
    slug: 'instagram-follow-ratio-what-it-means-how-to-improve-it',
    cta: {
      heading: 'Fix your ratio at the source.',
      body: 'A cleaner follow ratio starts with cutting the accounts that do not follow you back. WhoUnfollowed finds them in your own export, in your browser, with no password required.',
      buttonLabel: 'See who to unfollow',
      proNudge: 'Pro charts your follower and following counts over time so you can watch the ratio actually improve.',
    },
    cluster: 'account-health',
    title: 'Your Instagram Follow Ratio: What It Means and How to Actually Improve It',
    metaTitle: 'Instagram Follow Ratio: What It Means & How to Fix It',
    metaDescription: 'Your follow ratio affects how Instagram\'s algorithm treats your account. Here\'s what a healthy ratio looks like and the one lever you can pull to improve it.',
    excerpt: 'Your follow ratio is a single number that signals a lot about your account\'s health, to the algorithm and to anyone who visits your profile. Most creators don\'t know what theirs is.',
    date: 'May 15, 2026',
    readTime: '4 min',
    tag: 'Growth',
    primaryKeyword: 'Instagram follow ratio',
    art: 'ratio',
    // Unsplash: bMWHu8wU1Vk (analytics dashboard on a screen)
    image: '/blog/follow-ratio-hero.jpg',
    imageAlt: 'An analytics dashboard on a screen showing user metrics, top countries, and charts',
    body: `Your follow ratio is simple arithmetic: divide your follower count by the number of accounts you follow.

An account with 4,000 followers that follows 400 people has a ratio of 10:1. An account with 4,000 followers following 3,800 people has a ratio just above 1:1. Both have the same follower count. The algorithm does not treat them the same.

## Why the Ratio Matters

Instagram's recommendation systems use engagement rate as a core signal, but your follow-to-following ratio provides context. A high ratio tells the system (and anyone looking at your profile) that people seek you out. A low ratio suggests you've been following accounts hoping they'll follow back, which is a common growth-hack behavior that Instagram's systems are trained to recognize and discount.

For creators with 1,000 to 50,000 followers, a ratio somewhere between 3:1 and 10:1 is generally healthy. Below 1:1 and you're following more people than follow you, which is where the credibility problem starts.

## The One Lever You Can Actually Pull

![A hand holding a phone with the Instagram logo on the screen](/blog/follow-ratio-inline.jpg)

Growing followers takes time. Cleaning up your following list can happen this week.

After running an Instagram follower analysis, most accounts discover a meaningful percentage of people they follow who never followed back. Some of these accounts posted once in 2021 and never again. Some are brands that ran follow-for-follow campaigns and then unfollowed everyone. They're still on your following list, dragging your ratio down, offering no reciprocal value.

[Triaging these accounts](/blog/how-to-clean-up-who-you-follow-on-instagram) (deciding which non-followers to unfollow) is the fastest way to move your ratio without waiting for organic growth. Just pace yourself: [mass-unfollowing too fast carries its own risk](/blog/is-it-safe-to-mass-unfollow-on-instagram).

WhoUnfollowed's triage list shows you every account you follow that doesn't follow you back, sorted by how long you've followed them. You can work through them account by account and make deliberate decisions rather than guessing from memory.

## How to Check Your Current Ratio

You can calculate it manually from your profile page. Or [export your Instagram data](/blog/how-to-download-your-instagram-data) and upload it to WhoUnfollowed, and the Radar dashboard surfaces your ratio alongside your full follower breakdown: non-followers, mutual follows, recent unfollowers, in one view.

## One Caveat Worth Naming

Chasing a high ratio by mass-unfollowing is a different problem. Instagram's systems flag accounts that unfollow large numbers of people rapidly, the same way they flag accounts that follow too aggressively. The goal isn't the number itself. It's a following list that actually reflects who you're interested in. The ratio is a signal, not a score to game.

## What a Good Ratio Looks Like by Account Type

A single "good" number doesn't apply evenly across account types, because the follow behavior expected of each is different.

- **Personal accounts** naturally sit closer to 1:1. You follow friends, they follow you back, and there's no reason to expect a lopsided ratio. A personal account with a 10:1 ratio usually means it's being used more like a creator account.
- **Creator and influencer accounts** are expected to have a higher ratio, since the whole model is an audience following one person who doesn't need to follow thousands back. Anywhere from 3:1 up to 20:1 or higher reads as normal for an established creator.
- **Brand accounts** sit somewhere in between. Brands typically follow a small, deliberate list (partners, employees, a handful of customers) against a much larger follower base, so ratios in the 5:1 to 50:1 range are common and expected.

Context matters more than the raw number. A photographer with 2,000 followers and a 4:1 ratio is in a completely healthy spot. The same ratio on a brand account with 200,000 followers would actually look low for that category.

## What a Bad Ratio Actually Costs You

The ratio itself isn't a ranking factor Instagram publishes, but it correlates with two things that do matter. First, a low ratio (following far more than you're followed by) is a pattern shared with follow-for-follow spam accounts, and Instagram's spam-detection systems are tuned to recognize that shape of behavior, even if your account isn't actually spam. Second, and more practically, a low ratio hurts you with humans, not just algorithms. Anyone who visits your profile before deciding whether to follow you sees that ratio instantly, and a account following 4,000 people to get 4,200 followers reads as someone chasing numbers rather than building something people actually want to be part of. That perception costs you real follows you'd otherwise get.

## Building Ratio the Slow, Real Way

Trimming non-followers moves the ratio fast, but it's a one-time fix. The number keeps climbing only if new followers keep arriving, and that part has no shortcut: it comes from content people actually want to see and share. The realistic approach combines both. Clean up the following side once, so the ratio isn't artificially dragged down by dead weight, then let the follower side grow through consistent posting. Treat the cleanup as clearing the deck, not as the growth strategy itself.

## Tracking Ratio Over Time

A ratio is a snapshot, and one number in isolation doesn't tell you whether you're trending up or down. The more useful view is a ratio measured at two points, a month apart, so you can see the direction, not just the current state. WhoUnfollowed's history feature keeps successive exports so you can watch your ratio move over time instead of eyeballing it from memory.

## Quick Answers

**Is a 1:1 ratio bad?** Not inherently. For a personal account used mainly to keep up with friends, 1:1 is completely normal. It only becomes a signal worth acting on for creator or brand accounts, where audiences and algorithms expect a wider gap.

**Does unfollowing inactive accounts hurt my reach?** No. Accounts that never engaged with your content weren't contributing to your reach in the first place. Removing them only affects the ratio, not the actual people seeing your posts.

**How fast should I unfollow non-followers?** Slowly. A handful to a few dozen per day is safe. Unfollowing hundreds in a single session is the exact pattern Instagram's automation detection is built to catch, covered in more detail in [is it safe to mass unfollow](/blog/is-it-safe-to-mass-unfollow-on-instagram).

**Should I follow back everyone who follows me, to keep the ratio close to 1:1?** No. Following back indiscriminately defeats the purpose. The ratio is a proxy for genuine interest, not a number to force into a shape. Follow accounts you're actually interested in, and let the ratio reflect that.

**Does the ratio matter for a brand-new account with under 100 followers?** Barely. At that scale, the ratio swings wildly with every single follow or unfollow and carries almost no signal. It becomes meaningful once an account has enough followers that the number stabilizes, generally somewhere past a few hundred.

**Is there a single ideal ratio to aim for?** No, and treating it that way is the trap this whole piece is about. A creator at 10:1 and a personal account at 1:1 can both be perfectly healthy for what they are. Judge your ratio against accounts genuinely similar to yours in size and category, not a universal target pulled from a growth blog that never specifies who it's actually talking about.

Clean your list thoughtfully. The ratio will follow.`,
  },
  {
    slug: 'why-instagram-follower-trackers-ask-for-your-password',
    cta: {
      heading: 'Here is the tracker that never asks.',
      body: 'WhoUnfollowed reads the export Instagram gives you, entirely in your browser, so there is nothing to log into and no password to hand over. The whole thing is open source, so you never have to take our word for it.',
      buttonLabel: 'Try the no-password tracker',
    },
    cluster: 'privacy-safety',
    title: 'Why Instagram Follower Trackers Ask for Your Password (It\'s Not an Accident)',
    metaTitle: 'Why Follower Trackers Want Your Instagram Password',
    metaDescription: 'Instagram follower tracking apps ask for your password because credentials are the product. Here\'s what\'s actually happening and what to use instead.',
    excerpt: 'The follower tracking apps that ask for your Instagram password aren\'t doing it because it\'s the easiest technical solution. It\'s because your credentials have value to them.',
    date: 'May 15, 2026',
    readTime: '5 min',
    tag: 'Privacy',
    primaryKeyword: 'Instagram follower tracker password',
    art: 'lock',
    // Unsplash: _t-gqsF8du4 (Instagram login screen beside a phone)
    image: '/blog/trackers-password-hero.jpg',
    imageAlt: 'An Instagram login screen asking for a username and password',
    body: `Open any "who unfollowed me on Instagram" app and read their onboarding flow. Within two screens, they'll ask you to log in with your Instagram credentials.

The framing is always the same: it's for convenience, it's secure, thousands of people use it. What they don't explain is why they need your password to show you a list of your own followers, or what they're doing with it once you hand it over.

## The Technical Reality

Instagram has a public API, but it doesn't expose follower/following data freely. To pull that information programmatically, these apps authenticate as you using your username and password. That means Instagram's servers see what looks like you logging in from a third-party application and requesting data at scale.

This is explicitly against Meta's Terms of Use. Section 3 of Meta's terms prohibits accessing data through automated means without permission. The Instagram Platform Policy goes further, banning apps from collecting user credentials to impersonate users on their platform.

When Instagram's systems detect this behavior (and they do, at scale), the account flagged is yours. The app continues running. [Bans and restrictions from third-party follower trackers](/blog/can-you-get-banned-for-using-a-follower-tracker-on-instagram) are common enough that Instagram's own Help Center addresses them directly.

## Why They Ask Anyway

If credential-based access violates TOS and risks user accounts, why does every mainstream follower tracker still require it?

Because credentials are worth something.

An app with access to millions of Instagram login pairs has built something valuable: a dataset of authenticated accounts. Some of these apps have been caught reselling data, using accounts for bot networks, or monetizing the follower graph data itself. Even apps with no malicious intent create a liability. When their servers get breached, your Instagram password is in that dump. If you reuse that password anywhere else, the exposure multiplies.

## There Is a Safe Alternative

![A sign-in screen offering Continue with Google and Sign in with Apple](/blog/trackers-password-inline.jpg)

Instagram is legally required under GDPR to give you a copy of your own data, including your complete followers and following lists, in a portable format. You request it directly from Instagram's settings. They email you a download link. You get a ZIP file with your data.

No app needs your password to read a file you already have.

WhoUnfollowed reads that ZIP file in your browser. The file never leaves your device. The core parsing code is open source under the MPL-2.0 license and public on GitHub. You can verify the behavior yourself before uploading anything.

## The Practical Test

Before using any Instagram tool, [ask one question](/blog/are-instagram-follower-trackers-safe): does it need my password to function?

If yes, it is accessing Instagram's systems by impersonating you. Your account assumes all the risk. The app assumes none.

If no, if it works with a data export you control, then the incentive structure is different. The tool only stays useful if you keep using it voluntarily. That's a better alignment than one where your credentials are the product.

## How These Apps Work Under the Hood

Understanding the mechanism makes the risk concrete instead of abstract. When you enter your username and password into a third-party tracker, the app doesn't get some special sanctioned access. It uses your credentials to log in exactly as if you had typed them into Instagram yourself, then holds onto the resulting session so it can keep calling Instagram's private, internal API endpoints on your behalf, the same endpoints the official app uses. Instagram's systems don't see "a tracking app checking follower counts." They see your account logging in from an unfamiliar client and hitting endpoints at a rate and pattern no human scrolling the app would produce. That mismatch is exactly what automated abuse detection is built to catch.

## Why "Free" Trackers Need a Business Model

A follower-tracking app with no subscription fee and no ads still costs money to run: servers, development, support. If a free app isn't charging you directly, something else is paying for it, and the most common answer is your data. An app holding working Instagram logins for a large user base has something to sell or lease: a dataset of active accounts, a pool of sessions to route automated engagement through, or the follower-graph data itself packaged for marketers. None of this requires malicious intent from day one. It's simply what "free" has to mean when the product has real infrastructure costs and no other revenue.

## What Actually Happens When It Goes Wrong

The failure modes aren't hypothetical. Instagram's own Help Center documents account restrictions tied to third-party access, and the pattern is consistent: a burst of automated-looking activity from a login the account doesn't recognize triggers a checkpoint, a temporary action block, or in repeat cases a permanent suspension. None of this requires the app itself to have bad intentions. Even a tracker built in good faith that authenticates too aggressively, or gets flagged as a client Instagram doesn't allowlist, produces the same result for the person whose password it's holding. The account absorbing the consequence is always yours, never the app's.

## How to Spot a Risky Tracker Before You Install One

A short checklist catches most of them before you hand anything over:

- **It asks for your Instagram username and password within the first couple of screens.** This is the single biggest tell. A tool built around the data-export model never needs this.
- **It promises features Instagram's own app doesn't offer**, like "see who viewed your profile." Nothing legitimate can deliver this, because Instagram doesn't expose profile-view data to anyone, including itself in most cases.
- **Permissions or onboarding mention "connecting your account" rather than "uploading a file."** Connecting implies ongoing API access. Uploading implies a one-time file read.
- **There's no way to verify what it does with your data.** A tool with public, auditable source for its data-handling logic (open core) gives you something to check. A closed app asking for your password gives you nothing but a privacy policy to trust.

## If You've Already Given a Tracker Your Password

Damage control is straightforward, and worth doing even if nothing looks wrong yet. Go to Instagram's Settings, then "Security," then "Login activity" to see every device and session currently logged into your account, and log out anything unfamiliar. Change your Instagram password, and if you reused that password anywhere else (email, banking, other social accounts), change it there too, since credential-stuffing attacks rely on exactly that kind of reuse. Finally, revoke the tracker's access explicitly under "Apps and websites" in settings if it shows up there. None of this undoes any damage already done, but it closes the door on further access going forward.

## Is There Ever a Legitimate Reason to Share Credentials?

Occasionally. Instagram's own official "Meta Business Suite" and verified partner integrations, the kind a large brand or agency might use for scheduling posts, go through Meta's actual OAuth authorization flow rather than a raw username and password field. That flow shows you exactly what permissions you're granting and lets you revoke them from inside Instagram's own settings at any time, and it never has your literal password pass through the third party's servers at all. The distinction that matters isn't "did I authenticate with something," it's whether the authorization happened through Meta's own system, where you stay in control, or through a plain login form owned by the app itself, where you don't.`,
  },
  {
    slug: 'who-doesnt-follow-you-back-on-instagram',
    cta: {
      heading: 'Get the full list in two minutes.',
      body: 'Stop checking profiles one by one. Upload your Instagram export and WhoUnfollowed lists everyone who does not follow you back, in your browser, with no password and nothing stored.',
      buttonLabel: 'See who doesn\'t follow back',
    },
    cluster: 'unfollowers',
    title: 'How to See Who Doesn\'t Follow You Back on Instagram (Free, No App)',
    metaTitle: 'See Who Doesn\'t Follow You Back on Instagram',
    metaDescription: 'Find every account you follow that doesn\'t follow you back. Free, no app, no password. Read your own Instagram data export right in your browser.',
    excerpt: 'Instagram has no button that shows who you follow but who doesn\'t follow you back. Here\'s how to get the exact list in about two minutes, for free, without an app or your password.',
    date: 'June 25, 2026',
    readTime: '4 min',
    tag: 'Guide',
    primaryKeyword: 'who doesn\'t follow you back on Instagram',
    art: 'split',
    // Unsplash: rncny1536Xs (hand holding a phone open to an Instagram profile grid)
    image: '/blog/no-follow-back-hero.jpg',
    imageAlt: 'A hand holding a phone open to an Instagram profile grid',
    body: `Instagram makes this deliberately hard. There is no button that shows you the people you follow who don't follow you back. You can open your following list and check profiles one at a time, but on an account with a few hundred follows that is an evening you will not get back.

The accounts you are looking for have a name: non-followers. These are people you follow who don't follow you in return. They are not the same as [unfollowers](/blog/how-to-see-who-unfollowed-you-on-instagram), who are accounts that used to follow you and stopped (finding those takes two exports compared over time). Non-followers you can find right now, from a single file, in about two minutes.

Here is how, without an app and without ever typing your Instagram password.

## Skip the apps that want your login

Search "who doesn't follow me back" and the app stores fill with trackers that ask you to log in with your Instagram username and password. Don't. Those apps work by logging in as you and pulling data through Instagram's private API, which breaks Instagram's Terms of Use and is a common reason accounts get restricted or banned. The account taking the risk is yours. The app takes none.

You do not need any of that to read a list of your own follows.

## Use the data Instagram already owes you

![A phone on a marble desk beside a laptop, showing an Instagram profile feed](/blog/no-follow-back-inline.jpg)

Under GDPR Article 20, Instagram has to give you a copy of your own data, including your full followers and following lists. You request it from inside the app, Instagram emails you a download link, and you get a ZIP file. That file is everything you need.

### Step 1: Request your export

Open Instagram. Go to Settings, then "Your activity," then "Download your information." Choose "Followers and following," [set the format to JSON, not HTML](/blog/instagram-data-export-json-vs-html), and submit. Instagram usually emails the link within a few hours.

### Step 2: Download the ZIP

Open the email, download the file, and keep it somewhere you can find it. The lists you need live inside the \`connections/followers_and_following/\` folder, but you don't have to open anything yourself.

### Step 3: Drop it into WhoUnfollowed

Go to [whounfollowed.co](/) and drop the ZIP onto the page. It reads the file inside your browser tab and shows you, on one screen, every account you follow that doesn't follow you back. No login, nothing uploaded. You can turn off your wifi before you drop the file in and it still works, which is the simplest way to prove the data never leaves your device.

## What to do with the list

Seeing the names is the start. The goal is a cleaner, more mutual account.

- **Separate the ones that matter.** Brands and creators you follow for content are fine to keep. The accounts worth reviewing are the people you followed expecting a follow back.
- **Watch your ratio.** Following far more people than follow you reads as low-effort to both the algorithm and to anyone who lands on your profile. [Trimming non-followers](/blog/instagram-follow-ratio-what-it-means-how-to-improve-it) moves the number in the right direction.
- **Work in one pass.** WhoUnfollowed hands you the full list at once and opens profiles in new tabs, so you can triage in a single sitting instead of hunting one by one.

## The honest version

This will not magically grow your audience. What it does is remove the guesswork. Instead of wondering who is and isn't following you, you get the exact list in a couple of minutes, for free, without handing your password to anyone.

If a tool asks for your Instagram login to do this, close the tab. The file Instagram gives you is already yours. A good tool just reads it.`,
  },
  {
    slug: 'instagram-ghost-followers-how-to-find-and-remove-them',
    cta: {
      heading: 'Surface your likely ghosts.',
      body: 'WhoUnfollowed reads your own export in your browser to map your real, reciprocal audience and separate it from dead weight. No password needed.',
      buttonLabel: 'Analyze your audience free',
      proNudge: 'Pro approximates ghost followers by flagging long-tenure accounts that never engaged back.',
    },
    cluster: 'account-health',
    title: 'Instagram Ghost Followers: How to Find and Remove Them',
    metaTitle: 'Instagram Ghost Followers: Find & Remove Them',
    metaDescription: 'Ghost followers quietly drag down your engagement rate. Here\'s what they are, how to spot them from your own Instagram data, and how to clean them out safely.',
    excerpt: 'Ghost followers are the inactive and fake accounts padding your follower count while tanking your engagement rate. Here\'s how to find them without a sketchy app.',
    date: 'June 25, 2026',
    readTime: '5 min',
    tag: 'Growth',
    primaryKeyword: 'Instagram ghost followers',
    art: 'ghost',
    // Unsplash: 15r9RAOy38Q (glowing 3D social media logos on a dark background)
    image: '/blog/ghost-followers-hero.jpg',
    imageAlt: 'Glowing 3D social media app logos including Instagram on a dark background',
    body: `Your follower count says 8,000. Your posts get 90 likes. Something doesn't add up, and the gap usually has a name: ghost followers.

Ghost followers are accounts that follow you but never engage. Some are abandoned profiles. Some are bots from a long-forgotten follow-for-follow phase. Some are fakes you never bought but inherited when a giveaway or a shoutout sent a wave of junk accounts your way. They inflate the number at the top of your profile and quietly poison the metric that actually matters.

## Why ghost followers hurt more than they help

Instagram does not rank you by follower count. It ranks individual posts by how the people who see them react, mostly in the first hour. That is your engagement rate, and it is closely tied to [your follow ratio](/blog/instagram-follow-ratio-what-it-means-how-to-improve-it): interactions divided by reach.

![A dark analytics dashboard showing engagement metrics like click-through rate and quality score](/blog/ghost-followers-inline1.jpg)

Ghost followers sit in the denominator and never touch the numerator. Every dead account that follows you makes your engagement rate look worse to the algorithm, which then shows your post to fewer people, which lowers engagement further. A bloated follower count with a thin engagement rate also reads as bought to brands, which is the opposite of what you want if you ever pitch a partnership.

## The honest part: you can't get a perfect list

Instagram does not hand anyone a verified "these are bots" list, and any app that claims a 100% accurate ghost-follower scan is guessing or lying. What you can do is approximate, using signals that genuinely correlate with dead accounts.

The strongest signal you fully control is in your own data export: accounts that followed you a long time ago with no reciprocal relationship. Old, one-directional, and silent is the classic ghost profile.

## How to find them from your own data

You don't need to log in anywhere or pay for a scanner. Instagram is required under GDPR to give you your own follower data.

## Step 1: Export your data

In Instagram, go to Settings, then "Your activity," then "Download your information." Choose "Followers and following," [pick JSON](/blog/instagram-data-export-json-vs-html), and submit. The download link arrives by email, usually within a few hours.

## Step 2: Read it locally

Drop the ZIP into [WhoUnfollowed](/). It reads the file in your browser and maps your followers against your following, including how long each relationship has existed. Nothing is uploaded.

![A laptop on a desk showing an analytics dashboard with user-activity charts](/blog/ghost-followers-inline2.jpg)

## Step 3: Review the approximations, don't bulk-blast

WhoUnfollowed flags long-tenure, non-reciprocal followers as likely-inactive candidates. Treat that as a shortlist to review, not a kill list to run automatically. Open a few profiles. An account with no posts, no profile photo, and a username full of random digits is a safe remove. A quiet friend who just never likes anything is not.

## Removing them without getting flagged

Two safe ways to clear a ghost follower:

- **Remove the follower.** Open their profile, tap the menu, and choose "Remove follower." They drop off your count without being notified or blocked.
- **Block then unblock.** This force-removes stubborn bot accounts. Use it sparingly.

Whatever you do, [go slowly](/blog/is-it-safe-to-mass-unfollow-on-instagram). Instagram's systems flag accounts that remove or block in rapid bursts, the same way they flag aggressive following. A handful of removals across a session is fine. Hundreds in ten minutes is a way to get yourself restricted.

## The realistic outcome

Clearing ghosts will probably shrink your follower number. That feels bad for a day. What you get in exchange is an engagement rate that reflects real people, which is the number the algorithm and any serious brand actually care about. A smaller, real audience beats a big, hollow one every time.`,
  },
  {
    slug: 'does-instagram-notify-when-you-unfollow-someone',
    cta: {
      heading: 'Unfollow quietly, and know who did it to you.',
      body: 'Instagram will not tell you who unfollowed you either. WhoUnfollowed will: upload your export and see the exact names in your browser. No password, nothing uploaded.',
      buttonLabel: 'See who unfollowed you',
    },
    cluster: 'unfollowers',
    title: 'Does Instagram Notify Someone When You Unfollow Them?',
    metaTitle: 'Does Instagram Notify When You Unfollow Someone?',
    metaDescription: 'Wondering if Instagram tells people when you unfollow, block, or remove them? Here is exactly what is and is not notified, and how to find out who left.',
    excerpt: 'Short answer: no, Instagram does not send an unfollow notification. Here is the full breakdown of what Instagram does and does not tell people about your actions.',
    date: 'June 25, 2026',
    readTime: '4 min',
    tag: 'Guide',
    primaryKeyword: 'does Instagram notify when you unfollow someone',
    art: 'bell',
    // Unsplash: mw6Onwg4frY (two hands typing on a phone)
    image: '/blog/notify-unfollow-hero.jpg',
    imageAlt: 'Two hands typing a message on a phone keyboard',
    body: `The short answer is no. Instagram does not send a notification when you unfollow someone. The person won't get an alert, a banner, or a message. So if you're wondering whether they'll know the moment it happens, they won't, at least not through anything Instagram tells them. The only way they can tell is by noticing your follower relationship changed, either by remembering you followed them or by checking a list.

That said, "unfollow" is one of several actions people mix up, and Instagram treats each of them differently. Here is the complete picture.

![A phone lock screen showing push notifications from messaging and social apps](/blog/notify-unfollow-inline1.jpg)

## What Instagram does NOT notify

- **Unfollowing.** No notification. The account silently leaves their followers list. Do people get notified when you unfollow them on Instagram? No, not even a hint.
- **Removing a follower.** If you remove someone who follows you (Profile, menu, "Remove follower"), they are not told. They simply stop following you.
- **Blocking.** Instagram never announces a block. The other person is not notified, though they may infer it later because your profile stops being visible to them.
- **Muting.** Completely invisible. Muting someone's posts or stories is never shared with them.
- **Viewing a profile or a regular post.** There is no "seen your profile" feature. Anyone claiming to show you your profile visitors is guessing or scamming.

## What Instagram DOES notify

- **Following someone.** New follows trigger a notification.
- **Likes and comments.** The account owner is notified.
- **Story views.** The poster can see exactly who viewed their story while it is live.
- **Screenshots in vanish-mode chats.** Disappearing photos sent in a private vanish-mode chat trigger an alert. Regular posts and stories do not.

## So how would anyone know you unfollowed them?

They would have to track it deliberately. Without help, a person can only notice you unfollowed by remembering the prior state, which is unreliable past a handful of accounts. Can someone tell if you unfollow them on Instagram just by opening the app? Only if they happen to check your profile or their own followers list at the right moment and remember what it looked like before. This is exactly the gap that [follower tracking](/blog/how-to-see-who-unfollowed-you-on-instagram) exists to fill, and it works both ways: if you want to know who unfollowed you, you face the same problem.

## How to actually find out who unfollowed you

You can't get a notification for it, so you reconstruct it by comparing two snapshots of your data over time.

![A hand holding a smartphone](/blog/notify-unfollow-inline2.jpg)

Instagram gives you [your follower list on demand under GDPR](/blog/how-to-download-your-instagram-data). Export it now, export it again in a few weeks, and the difference between the two is your list of unfollowers.

[WhoUnfollowed](/) does that comparison for you. You upload the data export Instagram emails you, it reads the file in your browser, and when you add a second export later it shows exactly who dropped off between the two dates. No password, no notification to anyone, nothing sent to a server.

## The takeaway

When you unfollow someone on Instagram, are they notified? No. Unfollowing, removing, blocking, and muting are all silent. Instagram keeps your social moves private, which is good for you and inconvenient when you are on the receiving end. The only reliable way to see who unfollowed you is to keep your own record and compare it over time.`,
  },
  {
    slug: 'can-you-get-banned-for-using-a-follower-tracker-on-instagram',
    cta: {
      heading: 'The tracker that can\'t get you banned.',
      body: 'Nothing to log into means nothing for Instagram to flag. WhoUnfollowed only reads the export you already own, in your browser, and the code is open source so you can check exactly what it does.',
      buttonLabel: 'Try the safe way',
    },
    cluster: 'privacy-safety',
    title: 'Can You Get Banned for Using a Follower Tracker on Instagram?',
    metaTitle: 'Can You Get Banned for Using an Instagram Follower Tracker?',
    metaDescription: 'Yes, follower trackers that ask for your Instagram login can get your account flagged or banned. Here is why, and the method that carries zero risk.',
    excerpt: 'Short answer: the ones that ask for your Instagram login can get your account flagged, checkpointed, or banned. The ones that read your own data export cannot. Here is the difference.',
    date: 'July 3, 2026',
    readTime: '5 min',
    tag: 'Privacy',
    primaryKeyword: 'can you get banned for using a follower tracker on instagram',
    art: 'lock',
    // Unsplash: sLevDCcgmUI (a risk gauge cube reading low/medium/high on a keyboard)
    image: '/blog/banned-tracker-hero.jpg',
    imageAlt: 'A cube showing a low-to-high risk gauge sitting on a keyboard, representing ban risk from follower tracker apps',
    body: `The short answer: yes, but only with a certain kind of tracker. Any app that asks you to log in with your Instagram username and password can get your account flagged, checkpointed, or permanently banned, because it violates Instagram's terms of service. A tool that reads the data export Instagram gives you carries no ban risk at all, because it never touches your account.

That distinction is the whole story. Let's break it down.

## Why password-based trackers get accounts banned

When you hand your login to a follower tracker, the app logs into Instagram as you, usually from a data center server. Instagram's Platform Policy explicitly prohibits third-party services from storing your password or accessing your account on your behalf. It is not a gray area.

Instagram detects this the way you would expect: a login from an unfamiliar server IP, automated request patterns, activity that does not match a human tapping through the app. When the system flags it, the consequences escalate:

- A checkpoint challenge that forces you to reset your password
- A temporary lock on your account
- Shadow-limiting, where your reach quietly drops
- In repeat cases, a permanent ban

You might use one of these apps for months with no problem. Or you might lose an account you spent years building. The risk is real, it is documented across creator forums, and you cannot predict when it lands. We covered the mechanics in [why Instagram follower trackers ask for your password](/blog/why-instagram-follower-trackers-ask-for-your-password).

## The kind of tracker that cannot get you banned

There is a second category most people do not know exists. Instead of logging into your account, it reads a file you already own.

Under GDPR Article 20, Instagram is legally required to give you a copy of your own data on request. That includes your full followers and following lists. You request the export from Instagram's settings, they email you a ZIP file, and a tracker reads that file to show you who does not follow you back and who unfollowed you.

Nothing logs into your account. Nothing hits Instagram's servers. There is no automated access for Instagram to detect, because there is no access at all. This is exactly how [WhoUnfollowed](/) works, with no login step anywhere in the flow, and it is why it carries zero ban risk. The parsing code is open source, so that's not a claim you have to take on trust.

## How to tell which kind you are using

One question settles it: does the tool ask for your Instagram password?

- If yes, it is accessing your account directly, and your account is exposed.
- If no, and it asks you to upload a data export instead, it never touches your account.

## Is it safe to unfollow people after you find your non-followers?

Finding your non-followers is completely safe, because reading a data export is passive. Acting on the list is a separate question. Unfollowing hundreds of accounts in a burst can trip Instagram's spam limits regardless of what tool showed you the list. We covered the safe pace in [is it safe to mass unfollow on Instagram](/blog/is-it-safe-to-mass-unfollow-on-instagram).

## The takeaway

You can get banned for using a follower tracker, but only if it asks for your login. Choose a tool that reads your own Instagram export instead, and the ban question disappears entirely. Same answers, none of the exposure.`,
  },
  {
    slug: 'are-instagram-follower-trackers-safe',
    cta: {
      heading: 'See what a safe tracker looks like.',
      body: 'No login, no password, no data leaving your device. WhoUnfollowed reads your own Instagram export in your browser, and the parser is open source, so safety is something you can verify, not just trust.',
      buttonLabel: 'Try it free',
    },
    cluster: 'privacy-safety',
    title: 'Are Instagram Follower Trackers Safe?',
    metaTitle: 'Are Instagram Follower Trackers Safe? What to Check First',
    metaDescription: 'Most Instagram follower trackers are not safe: they store your password and send it to their servers. Here is how to check one before you use it.',
    excerpt: 'Most are not. The ones that ask for your Instagram login put your account and your data at risk. Here is the checklist to judge any tracker, and the one model that is safe by design.',
    date: 'July 3, 2026',
    readTime: '5 min',
    tag: 'Privacy',
    primaryKeyword: 'are instagram follower trackers safe',
    art: 'lock',
    // Unsplash: FnA5pAzqhMM (a gold padlock and credit cards on a keyboard)
    image: '/blog/trackers-safe-hero.jpg',
    imageAlt: 'A padlock and credit cards resting on a keyboard, representing the safety risk of handing over Instagram credentials',
    body: `Most Instagram follower trackers are not safe. The majority ask for your Instagram username and password, store your credentials on their servers, and send your data off your device. That combination puts both your account and your privacy at risk. A small number are safe by design, because they never ask for your login at all. Whether you call them trackers or unfollow checkers, the safety question is the same. Here is how to tell them apart.

## What makes a follower tracker unsafe

Three things, usually all at once:

- **It asks for your Instagram password.** Handing your login to a third party breaks Instagram's terms and can get your account flagged or banned. See [can you get banned for using a follower tracker](/blog/can-you-get-banned-for-using-a-follower-tracker-on-instagram).
- **It sends your data to a server.** Once your follower list leaves your device, you have no control over how it is stored, who can see it, or whether it is sold. Several tracker apps have been caught harvesting and reselling user data.
- **It is a black box.** If you cannot see what the code does, you are trusting a privacy policy instead of verifying behavior.

## The checklist: judge any tracker in 30 seconds

Before you use one, ask:

- Does it ask for my Instagram login? If yes, stop.
- Does my data get uploaded to their server, or is it processed on my device?
- Can I see the source code, or at least a clear explanation of what happens to my data?
- Does it need an account and personal details just to show me a list?

A safe tool answers those cleanly: no login, processed locally, open and auditable, no account required.

## The model that is safe by design

Instagram already gives you your own data. Under GDPR Article 20 you can request a full export of your followers and following lists, and Instagram emails you a ZIP file. A safe tracker reads that file and nothing else.

[WhoUnfollowed](/) is built this way on purpose. You upload the export Instagram sent you, your browser reads it locally, and the result appears in about two seconds. No password, no server upload, no account. The parsing code is open source, so anyone can verify exactly what it does with your data. It's sitting on GitHub right now if you want to check it yourself instead of trusting a claim on a landing page. If you want to see who left, start with [how to see who unfollowed you on Instagram](/blog/how-to-see-who-unfollowed-you-on-instagram).

## So are they safe or not?

As a category, no. As a specific choice, it depends entirely on one thing: whether the tool touches your account. If it reads a data export you already own, it is safe. If it asks for your password, it is not. Pick accordingly.`,
  },
  {
    slug: 'how-long-does-an-instagram-data-request-take',
    cta: {
      heading: 'The moment your export lands.',
      body: 'As soon as your ZIP arrives, drop it into WhoUnfollowed and get your non-follower and unfollower lists in your browser, in about two minutes. No password, nothing uploaded.',
      buttonLabel: 'Analyze your export',
    },
    cluster: 'data-export',
    title: 'How Long Does an Instagram Data Request Take?',
    metaTitle: 'How Long Does an Instagram Data Request Take?',
    metaDescription: 'A Followers and Following export from Instagram usually arrives in minutes. A full archive can take up to 48 hours. Here is what affects the wait.',
    excerpt: 'A focused Followers and Following export usually lands in a few minutes. A full archive can take up to 48 hours. Here is exactly what determines the wait.',
    date: 'July 3, 2026',
    readTime: '4 min',
    tag: 'Guide',
    primaryKeyword: 'how long does an instagram data request take',
    art: 'search',
    // Unsplash: ft0-Xu4nTvA (a flip clock showing the time)
    image: '/blog/data-request-time-hero.jpg',
    imageAlt: 'A flip clock displaying the time, representing the wait time for an Instagram data export',
    body: `A small, focused Instagram data request usually arrives within a few minutes. If you select only your Followers and Following in JSON format, most people get the email in under five minutes. A full account archive, with photos, videos, and messages, is a much larger job and can take anywhere from a few hours up to 48 hours.

The size of what you ask for is the single biggest factor. Here is the full picture.

## What determines the wait

- **How much you request.** Followers and Following is tiny, often under 1MB, so Instagram builds it fast. Your entire archive can be several gigabytes and takes far longer.
- **Format.** JSON exports are quick to generate, and JSON is the format you want anyway because it includes follow timestamps. See [JSON vs HTML](/blog/instagram-data-export-json-vs-html).
- **Platform load.** During high-traffic periods Instagram queues these jobs, so the same request can be instant one day and slow the next.
- **Account size.** A very large account with millions of followers naturally takes longer to package.

## How to get your export as fast as possible

Request only what you need. You do not need your whole archive to see who unfollowed you. In Instagram's export flow, deselect everything except Followers and Following, choose JSON, and set the date range to All time. That keeps the file small and the wait short. The full walkthrough is in [how to download your Instagram data](/blog/how-to-download-your-instagram-data).

## What if it has not arrived?

If nothing shows up after 15 minutes:

- Check your spam or promotions folder. The email comes from security-noreply@instagram.com.
- Confirm the request actually submitted. Sometimes the first attempt silently fails, so try again.
- Remember Instagram throttles requests to roughly one every 14 days per account.
- On rare occasions, even a small export can take up to 48 hours during busy periods.

Once the email arrives, the download link stays valid for four days. Grab the ZIP promptly.

## After the download

The moment you have the ZIP, the slow part is over. Reading it is instant. Drop the file into [WhoUnfollowed](/) and it shows who does not follow you back in about two seconds, all in your browser, with nothing sent to a server. If you upload a second export later, you also see exactly [who unfollowed you](/blog/how-to-see-who-unfollowed-you-on-instagram) in between.`,
  },
  {
    slug: 'instagram-data-export-json-vs-html',
    cta: {
      heading: 'Either format works here.',
      body: 'JSON or HTML, WhoUnfollowed reads whichever one you picked, right in your browser, and shows who does not follow you back. No password, nothing stored.',
      buttonLabel: 'Upload your export',
    },
    cluster: 'data-export',
    title: 'Instagram Data Export: JSON vs HTML (Which to Pick and Why)',
    metaTitle: 'Instagram Data Export: JSON vs HTML (Which to Choose)',
    metaDescription: 'Choose JSON for your Instagram data export. It includes the follow timestamps that HTML leaves out, and tools can read it. Here is the difference.',
    excerpt: 'Pick JSON. It includes the follow timestamps HTML leaves out, and it is the format analysis tools actually read. HTML is only for eyeballing in a browser. Here is why it matters.',
    date: 'July 3, 2026',
    readTime: '4 min',
    tag: 'Guide',
    primaryKeyword: 'instagram data export json vs html',
    art: 'split',
    // Unsplash: ieic5Tq8YMk (a laptop screen showing lines of code)
    image: '/blog/json-vs-html-hero.jpg',
    imageAlt: 'A computer screen filled with code, representing the structured JSON format of an Instagram data export',
    body: `When Instagram asks whether you want your data export as JSON or HTML, choose JSON. It contains the follow timestamps that HTML strips out, and it is the structured format that analysis tools can actually read. HTML is only useful for scrolling through your data by eye in a browser. If you plan to do anything with the file, JSON is the answer.

Here is what actually separates them.

## What JSON gives you that HTML does not

Both formats contain your followers and following lists. The difference is what surrounds each name.

- **Timestamps.** JSON records the moment each follow happened. That is how a tool can tell a long-tenure follower from a recent one, and how [ghost follower](/blog/instagram-ghost-followers-how-to-find-and-remove-them) approximation works. HTML usually drops this.
- **Structure.** JSON is machine-readable by design. A parser can load it directly. HTML is a web page meant for human eyes, so tools have to fight the markup to extract anything.
- **Size and speed.** JSON is lean. HTML wraps every entry in layout code, making the file bigger and slower to process.

## When HTML is fine

Exactly one case: you only want to open the file yourself and read it in a browser, with no tool involved, and you do not care when anyone followed you. For anything beyond casual reading, it falls short.

## What the JSON actually holds

You never have to read it yourself, but here is the shape. Each entry is a small block holding the username, a link to the profile, and a timestamp marking when the follow happened. That timestamp is the useful part. It is a Unix time value, and it is what lets a tool sort your followers by how long they have been with you.

## Picking JSON in the export flow

When you request your data, Instagram shows a format toggle. Set it to JSON, select only Followers and Following, and choose the All time date range. Step-by-step screenshots are in [how to download your Instagram data](/blog/how-to-download-your-instagram-data).

## Then what?

Drop the JSON export into [WhoUnfollowed](/). It reads the file in your browser, matches your followers against your following, and shows who does not follow you back in about two seconds. Nothing is uploaded, no password is involved, and because you picked JSON, the follow timestamps come through for the deeper analysis.`,
  },
  {
    slug: 'can-you-see-who-unfollowed-you-on-instagram',
    cta: {
      heading: 'Yes, and here is how.',
      body: 'Instagram hides it, but your own export does not. Upload it to WhoUnfollowed and see the exact people who unfollowed you, in your browser, with no password required.',
      buttonLabel: 'See who unfollowed you',
      proNudge: 'Pro keeps every snapshot and emails you whenever someone new drops off.',
    },
    cluster: 'unfollowers',
    title: 'Can You See Who Unfollowed You on Instagram?',
    metaTitle: 'Can You See Who Unfollowed You on Instagram?',
    metaDescription: 'Instagram does not show you who unfollowed you and sends no notification. But you can reconstruct it from your own data export. Here is how.',
    excerpt: 'Not directly. Instagram never tells you who unfollowed you and sends no notification. But you can reconstruct it from your own data export by comparing two snapshots. Here is how.',
    date: 'July 3, 2026',
    readTime: '4 min',
    tag: 'Guide',
    primaryKeyword: 'can you see who unfollowed you on instagram',
    art: 'search',
    // Unsplash: 9OeW6Thad0Q (the Instagram logo displayed on an iPhone)
    image: '/blog/see-who-unfollowed-hero.jpg',
    imageAlt: 'The Instagram logo displayed on a phone screen, representing checking your own account for who unfollowed you',
    body: `Not from inside the app. Instagram does not show you who unfollowed you, and it never sends a notification when someone does. The follower count drops, but the app will not tell you which account left. You can, however, work it out yourself by comparing two copies of your own follower list over time. That method is completely safe and needs no password.

Here is why the app hides it, and how to see it anyway.

## Why Instagram will not tell you

Instagram deliberately keeps unfollowing quiet. The person you unfollow is never notified, and neither are you when someone unfollows you. This is a privacy choice on their end, and it applies both ways. We broke down exactly what is and is not notified in [does Instagram notify someone when you unfollow them](/blog/does-instagram-notify-when-you-unfollow-someone).

The result is a frustrating gap: you can see that you lost 40 followers, but not which 40. Staring at a smaller number tells you nothing about who actually left, and it cannot separate a [bot purge](/blog/why-did-i-lose-followers-overnight-on-instagram) from a real person you cared about.

## The method that actually works

Since Instagram will not hand you the list, you reconstruct it from your own data:

- Request a data export from Instagram. Under GDPR you have the right to your followers and following lists, and Instagram emails you a ZIP.
- Save that as your baseline snapshot.
- A few weeks later, request a second export.
- Compare the two. Anyone in the first list but missing from the second unfollowed you in between.

That comparison is the only reliable way to see unfollowers, because it works from a record you control rather than a live view Instagram refuses to give you.

## Doing it without the manual work

You do not have to compare two files by hand. [WhoUnfollowed](/) does it for you. You upload the export Instagram sent you, it reads the file in your browser, and when you add a later export it shows exactly who dropped off between the two dates. No password, no server, nothing that touches your account. The full walkthrough is the pillar guide, [how to see who unfollowed you on Instagram](/blog/how-to-see-who-unfollowed-you-on-instagram).

## The short version

You cannot see who unfollowed you directly, and no app can do it safely by logging into your account. But your own Instagram export, compared over time, gives you the exact list. That is the honest answer, and it is the only one that does not put your account at risk.`,
  },
  {
    slug: 'what-is-a-good-follower-to-following-ratio-on-instagram',
    cta: {
      heading: 'Tighten your ratio today.',
      body: 'The fastest lever is cutting accounts that do not follow you back. WhoUnfollowed finds them in your own export, in your browser, with no password.',
      buttonLabel: 'See who to unfollow',
    },
    cluster: 'account-health',
    title: 'What Is a Good Follower-to-Following Ratio on Instagram?',
    metaTitle: 'What Is a Good Follower-to-Following Ratio on Instagram?',
    metaDescription: 'A follower-to-following ratio above 1.0 looks healthy, above 2.0 signals real influence. Here is what the number means and why chasing it is a trap.',
    excerpt: 'Above 1.0 reads as healthy, and above 2.0 signals genuine pull. But the ratio is a vanity metric with real limits. Here is what a good number looks like, and when to ignore it.',
    date: 'July 3, 2026',
    readTime: '5 min',
    tag: 'Growth',
    primaryKeyword: 'good follower to following ratio on instagram',
    art: 'ratio',
    // Unsplash: j06gLuKK0GM (a small gold balance scale)
    image: '/blog/follow-ratio-good-hero.jpg',
    imageAlt: 'A small brass balance scale with two pans, representing the Instagram follower-to-following ratio',
    body: `As a rough guide, a follower-to-following ratio above 1.0 looks healthy, meaning you have more followers than accounts you follow. Above 2.0 starts to signal genuine influence, and established creators often sit well beyond that. But the ratio is a vanity metric with real limits, and chasing it blindly leads to bad decisions. Here is what the number actually tells you.

## How the ratio is calculated

It is simple: divide your follower count by the number of accounts you follow.

- 1,000 followers and 500 following gives a ratio of 2.0
- 1,000 followers and 2,000 following gives a ratio of 0.5

A ratio under 1.0 means you follow more people than follow you back. That is normal for a new or growing account, and nothing to panic about.

## What counts as a good ratio

There is no single right number, but rough bands help:

- **Below 1.0:** common for new accounts and heavy engagers. Fine early on.
- **1.0 to 2.0:** balanced and healthy for most personal and small creator accounts.
- **Above 2.0:** signals that people seek you out more than you seek them. Typical of creators with real pull.

Context matters more than the raw figure. A niche expert with 3,000 engaged followers is in better shape than someone with a 5.0 ratio built on bought followers. The deeper mechanics are in the pillar guide, [your Instagram follow ratio and how to improve it](/blog/instagram-follow-ratio-what-it-means-how-to-improve-it).

## Why chasing the ratio is a trap

The fastest way to improve your ratio is to mass-unfollow everyone who does not follow you back. That can help, but done carelessly it backfires:

- Aggressive unfollowing can trip Instagram's spam limits. Pace it, as covered in [is it safe to mass unfollow](/blog/is-it-safe-to-mass-unfollow-on-instagram).
- Cutting people purely for the number can cost you real connections and mutuals.
- A high ratio inflated by [ghost followers](/blog/instagram-ghost-followers-how-to-find-and-remove-them) is a worse position than a lower ratio of engaged, real people.

## The healthier way to improve it

Improve the ratio as a byproduct, not a goal. Trim accounts you follow that add nothing and do not follow you back, keep the mutuals and the people you genuinely want in your feed, and let real followers accumulate through good posts.

To do the trimming cleanly, you need to see who does not follow you back. [WhoUnfollowed](/) shows that list from your own Instagram export, with no password and nothing sent to a server. You decide who to keep and who to drop, and your ratio moves on its own.`,
  },
  {
    slug: 'whats-inside-your-instagram-data-download',
    cta: {
      heading: 'Turn the ZIP into answers.',
      body: 'The followers and following files are just lists until something compares them. WhoUnfollowed does that in your browser and shows who does not follow you back. No password, nothing uploaded.',
      buttonLabel: 'Analyze your download',
    },
    cluster: 'data-export',
    title: "What's Actually Inside Your Instagram Data Download",
    metaTitle: "What's Inside Your Instagram Data Download (The ZIP Explained)",
    metaDescription: 'Your Instagram data download is a ZIP with a few small JSON files: followers, following, pending requests, recently unfollowed. Here is what each contains.',
    excerpt: "The ZIP Instagram sends you is smaller and simpler than it sounds. Here is exactly what is inside it, file by file, and why the timestamps matter more than anything else in there.",
    date: 'July 15, 2026',
    readTime: '4 min',
    tag: 'Guide',
    primaryKeyword: "what's inside instagram data download",
    art: 'split',
    // Unsplash: XN4T2PVUUgk (a stack of thick white folders)
    image: '/blog/whats-inside-download-hero.jpg',
    imageAlt: 'A stack of white binders and folders, representing the small set of files inside an Instagram data export ZIP',
    body: `Your Instagram data download is not the sprawling archive people expect. If you requested just Followers and Following (as [the export guide](/blog/how-to-download-your-instagram-data) recommends), the ZIP holds a handful of small JSON files, usually well under 1MB combined. Here is exactly what is in it.

## The core files

- **followers_1.json** (or followers_2.json, followers_3.json for larger accounts): every account that follows you
- **following.json**: every account you follow
- **pending_follow_requests.json**: accounts you have asked to follow who have not accepted yet, if any
- **recently_unfollowed_profiles.json**: a short, Instagram-maintained list of accounts you recently unfollowed

That last one is worth pausing on. Instagram keeps a small rolling log of your own recent unfollows, but it is short and temporary, not a substitute for tracking [who unfollowed you](/blog/how-to-see-who-unfollowed-you-on-instagram) over time yourself.

## What each entry actually looks like

Every account in these files is a small JSON object, not just a username. Each one carries the same three fields:

- **value**: the username
- **href**: a direct link to their profile, like https://www.instagram.com/username
- **timestamp**: a Unix time value marking when the follow relationship was recorded

Three fields, every time: the username, a direct link to their profile, and a timestamp.

## Why the timestamp is the important part

The username and link are easy to guess. The timestamp is not, and it is the one field that actually unlocks anything. It is what lets a tool calculate how long someone has followed you, tell a brand-new follower from a two-year one, and build a growth timeline instead of a flat list. This only shows up reliably if you chose JSON format. HTML exports carry the same relationships but usually drop the timestamp entirely, which is exactly why [JSON is the recommended format](/blog/instagram-data-export-json-vs-html).

## What is not in there

No password, no private messages, no photos, nothing beyond the connections themselves if you selected only Followers and Following. Instagram's full archive (which nobody needs for this) can include posts, stories, and message history, several gigabytes of data you do not have to touch. The focused export is small on purpose.

## Why this matters for a privacy-first tool

Because the whole file is just a few small, plain JSON documents, a tool like [WhoUnfollowed](/) can read it entirely inside your browser in about two seconds. There is no server involved because there does not need to be. The parser that reads these exact files is open source (MPL-2.0), so anyone can check that this description of the file matches the code that touches it.`,
  },
  {
    slug: 'how-to-clean-up-who-you-follow-on-instagram',
    cta: {
      heading: 'Start your cleanup with the list.',
      body: 'Cleaning up is easy once you can see who does not follow you back. WhoUnfollowed builds that list from your export, in your browser, with no password and nothing uploaded.',
      buttonLabel: 'Get your cleanup list',
    },
    cluster: 'account-health',
    title: 'How to Clean Up Who You Follow on Instagram (The Safe Way)',
    metaTitle: 'How to Clean Up Who You Follow on Instagram Safely',
    metaDescription: 'Cleaning up who you follow on Instagram safely means pacing your unfollows, not mass-unfollowing everyone who does not follow back. Here is a safe method.',
    excerpt: "A clean following list beats a big one. Here is how to trim it deliberately, without tripping Instagram's spam limits or losing accounts you actually wanted to keep.",
    date: 'July 15, 2026',
    readTime: '5 min',
    tag: 'Growth',
    primaryKeyword: 'clean up who you follow on instagram',
    art: 'ratio',
    // Unsplash: KWZa42a1kds (a hand holding a phone showing the Instagram sign-up screen)
    image: '/blog/clean-up-follow-hero.jpg',
    imageAlt: 'A hand holding a phone open to the Instagram app, representing reviewing and trimming a following list',
    body: `Cleaning up who you follow on Instagram safely means going through your list deliberately and unfollowing at a measured pace, not mass-unfollowing everyone who does not follow back in one sitting. The list itself is the easy part. The discipline is in how you act on it.

## Start with the actual list, not guesswork

You cannot clean up what you cannot see. Most people only have a vague sense of who they follow, built up over years of taps. The first real step is getting the full, current list of everyone you follow that does not follow you back, which is exactly what [WhoUnfollowed](/) shows from your own Instagram export, free, with no login.

## Sort before you touch anything

Once you have the list, resist the urge to start unfollowing immediately. Go through it once and sort each account into a category:

- **Drop**: no reason to keep following, inactive, irrelevant, or you do not recognize them
- **Keep anyway**: brands, public figures, or accounts you follow for content, not reciprocity
- **Not sure yet**: needs a second look later

This sorting pass, sometimes called triage, is the actual clean-up work. The unfollowing itself is just execution once you have decided.

## Unfollow in small batches, not all at once

Instagram rate-limits bulk actions, and unfollowing dozens of accounts back to back in a short window can trigger a temporary action block on your account. The safe approach:

- Unfollow in batches of 20 to 30 at a time
- Space batches out over a few hours or days rather than one long session
- Stop immediately if Instagram shows any warning or blocks an action

The full mechanics and safe limits are covered in [is it safe to mass unfollow on Instagram](/blog/is-it-safe-to-mass-unfollow-on-instagram). If you are cleaning up hundreds of accounts, plan for days, not minutes.

## Do not confuse a clean list with a good ratio

Cleaning up who you follow will naturally improve your [follow ratio](/blog/instagram-follow-ratio-what-it-means-how-to-improve-it), but that should be a side effect, not the goal. Cutting accounts purely to move a number can cost you real mutuals and people whose content you actually wanted. Judge each account on its own, not just on whether it follows back.

## Watch for ghost followers on the other side

While you are cleaning up who you follow, it is worth checking the other direction too: dormant accounts that follow you but never engage, sometimes called [ghost followers](/blog/instagram-ghost-followers-how-to-find-and-remove-them). They do not need action the way non-follow-backs do, but they explain a lot about why your engagement rate looks lower than your follower count suggests.

## The safe version, summarized

See the full list first, sort it deliberately, unfollow in small paced batches, and never touch your password or a third-party login to do it. That is the entire safe method, and it starts with a free upload, no account required.`,
  },
  {
    slug: 'instagram-follower-tracker-without-login',
    cta: {
      heading: 'A tracker with no login, for real.',
      body: 'WhoUnfollowed never asks you to sign into Instagram. It reads the export you download yourself, in your browser, and the code is open source. Upload it and see who unfollowed you in about two minutes.',
      buttonLabel: 'Try it without logging in',
    },
    cluster: 'privacy-safety',
    title: 'Instagram Follower Tracker Without Login: Do They Exist?',
    metaTitle: 'Instagram Follower Tracker Without Login: Do They Exist?',
    metaDescription: 'Yes, a genuine no-login Instagram follower tracker exists: it reads the data export Instagram already gives you. Here is how to tell the real ones apart.',
    excerpt: "Yes, but you have to know what to actually look for. Plenty of trackers claim to need 'no login' while still asking for your Instagram password somewhere in the flow. Here is the real distinction.",
    date: 'July 15, 2026',
    readTime: '4 min',
    tag: 'Privacy',
    primaryKeyword: 'instagram follower tracker without login',
    art: 'lock',
    // Unsplash: DeD4qZmVFdM (a 3D render of the Instagram icon)
    image: '/blog/no-login-tracker-hero.jpg',
    imageAlt: 'A stylized 3D render of the Instagram app icon, representing a follower tracker that needs no Instagram login',
    body: `Yes, genuine no-login Instagram follower trackers exist, but the phrase gets abused. Search "instagram unfollow tracker" and you'll find dozens of apps making that promise, and most of them still authenticate with Instagram somewhere in the actual flow, just worded to sound safer than it is. Here is how to tell a real one from a relabeled one.

## The trick some trackers use

"No login" can technically mean a few different things, and only one of them is actually safe:

- **No separate signup for our app, but connect your Instagram**: this still means handing over your Instagram credentials or an OAuth token tied to your account. The tracker's own signup is skipped, but Instagram access is not.
- **No password typed into our app directly**: some tools redirect you to an Instagram-branded login page first, then capture a session token afterward. You never type your password into their form, but your account is still connected to a third party.
- **No Instagram interaction at all**: the tool never touches Instagram in any way. This is the only version that is actually risk-free, and it works by reading a file you already have instead of connecting to your account.

The first two are marketing language stretched to imply the third. Only the third one is genuinely true to what "no login" should mean.

## Why the real version needs your data export instead

A tracker that touches Instagram in any form, even briefly, is doing something Instagram's own Platform Policy prohibits for third parties. That is the whole reason [these tools carry ban risk](/blog/can-you-get-banned-for-using-a-follower-tracker-on-instagram): the risk comes from the connection itself, not from typing a password into a specific box.

The only way to genuinely skip that connection and still get real answers is to work from data you already own. Instagram is required under GDPR Article 20 to give you your own followers and following lists on request. [Requesting that export](/blog/how-to-download-your-instagram-data) takes a few minutes, and once you have it, a tracker can read it locally without ever reaching Instagram's servers.

## How to check if a tracker is the real thing

Before using any Instagram follower tracker, ask one direct question: does it, at any point, ask you to log into Instagram or authorize an app connection? If the answer is yes in any form, it is not a true no-login tool, regardless of what its landing page says. If the answer is genuinely no, and it instead asks you to upload a file, that is the real version.

[WhoUnfollowed](/) works this second way. You upload the ZIP Instagram emails you, your browser reads it, and the app never sends a single request to Instagram. There is no account connection to misuse because none exists, which is also why the parsing code is [published open source](/blog/why-instagram-follower-trackers-ask-for-your-password) rather than something you have to take on faith.

## The short answer

A real no-login Instagram follower tracker exists and works by reading your own official data export, not by connecting to your account under a friendlier name. If a tool asks for Instagram access at any point, it is not what "no login" is supposed to mean.`,
  },
  {
    slug: 'deactivated-or-blocked-on-instagram-how-to-tell',
    cta: {
      heading: 'Tell a real unfollow from a deactivation.',
      body: 'WhoUnfollowed compares your own exports to show exactly who is gone from your followers, so you can separate a genuine unfollow from a deactivated account. In your browser, with no password.',
      buttonLabel: 'Check who\'s gone',
    },
    cluster: 'unfollowers',
    title: 'Deactivated, Deleted, or Blocked? How to Tell What Happened on Instagram',
    metaTitle: 'Deactivated or Blocked on Instagram? How to Tell',
    metaDescription: 'Someone vanished from your followers list. Here is how to tell if they deactivated, deleted their account, or blocked you, no app or password needed.',
    excerpt: "They're gone from your list and Instagram won't say why. Deactivated, deleted, and blocked leave three different fingerprints. Here's how to read them without logging into anyone's account but your own.",
    date: 'July 21, 2026',
    readTime: '5 min',
    tag: 'Guide',
    primaryKeyword: 'how to tell if someone deactivated or blocked you on Instagram',
    art: 'search',
    // Unsplash: 0I21xHfgw0E (a hand holding a phone showing a folder of social media apps including Instagram)
    image: '/blog/deactivated-or-blocked-hero.jpg',
    imageAlt: 'A hand holding a phone showing a folder of social media apps including Instagram, representing checking why someone disappeared from a followers list',
    body: `Someone you used to see in your followers or following list is gone, and Instagram gives you nothing. No banner, no note, no explanation. It could be four completely different things: they deactivated, they deleted their account, they blocked you, or they just quietly unfollowed. Each one leaves a slightly different trail. Here is how to read it.

## The quick answer

If their profile shows "Sorry, this page isn't available" for you but a mutual friend can still see it, you were blocked. If it is unavailable for everyone, including you logged into a different account, they deactivated or deleted. If their profile looks completely normal and you simply do not see them in your followers or following list anymore, they unfollowed you.

## Deactivated: temporary, and it looks the same to everyone

Deactivating an Instagram account hides it from the entire platform, not just you. According to [Instagram's own Help Center](https://help.instagram.com/139886812848894), a deactivated profile disappears from search, posts stop showing, and the account owner is the only one who can bring it back, simply by logging in again. There is no time limit. Someone can leave their account deactivated for a day or a year.

Signs you are looking at a deactivation, not a block:
- Their profile shows as unavailable to you **and** to people who were never connected to them.
- In a shared group chat, their display name may flip to "Instagram User" and their profile photo disappears, since deactivation pulls their identity from every surface at once.
- Old comments and tags they left on posts often still show their username, just with a dead link behind it.

## Deleted: the same look, with a 30-day window

Deletion is deactivation's permanent sibling, and for the first month it is genuinely indistinguishable from the outside. When someone requests deletion, Instagram hides the account immediately and starts a 30-day grace period. If they log back in during that window, the deletion cancels and everything returns exactly as it was. If they never log back in, the account and its data are erased for good once the 30 days pass.

There is no outward signal that separates "deactivated" from "deleted, still inside the 30-day window." Both look identical to you: profile unavailable, no explanation. The only real test is time. If the profile is still gone after a month or two with no sign of returning, deletion is the more likely explanation, though there is no way to confirm it from outside the account.

## Blocked: visible to everyone except you

A block is the one case where the profile is not actually gone, it is just gone for you specifically. Per [Instagram's Help Center on blocking](https://help.instagram.com/447613741984126), a block removes the mutual follow relationship, hides your profile and Stories from them, and hides their profile from you. Nobody is notified when a block happens.

The tell is asymmetry. A blocked profile:
- Shows "Sorry, this page isn't available" only to you, while other accounts (including a friend's, or a logged-out browser) can still open it normally.
- Stops appearing in your search results entirely, even by exact username.
- Freezes any DM thread you had. Old messages stay visible, but nothing sends or delivers.
- Leaves old likes and comments they made on your posts removed, since blocking retroactively strips their interactions too.

If a mutual friend can pull up the profile and you cannot, that is a block, not a deactivation.

## Unfollowed: the invisible one

The fourth option is the one people miss most often, because it produces zero symptoms on the profile itself. If someone simply unfollowed you, their account looks completely untouched: full profile, normal posts, searchable, DMs work fine. The only change is that they no longer appear in your followers list. [Instagram never sends a notification for this](/blog/does-instagram-notify-when-you-unfollow-someone) in either direction, which is exactly why it is so easy to miss and so hard to confirm just by looking.

## Why this happens overnight, in batches

If several accounts vanish from your followers count at once, it is rarely one dramatic event. It is usually a mix of the four things above landing in the same week, sometimes alongside a [platform-wide bot purge](/blog/why-did-i-lose-followers-overnight-on-instagram) that has nothing to do with any single person's decision. Trying to diagnose a multi-account drop by checking profiles one at a time gets slow fast, which is the real reason to keep records instead of guessing.

## The one method that does not rely on guessing

Checking profiles by hand works for one person you are curious about. It does not scale to "who exactly disappeared this month." For that, you need a record of who followed you before, compared against who follows you now.

Instagram is required under GDPR to hand you a full copy of your own followers and following lists on request. [Export your data](/blog/how-to-download-your-instagram-data), keep the file, and request a fresh one a few weeks later. The difference between the two is your exact list of who left, regardless of whether they deactivated, deleted, blocked you, or unfollowed.

[WhoUnfollowed](/) reads both exports in your browser and shows you exactly who dropped off between them. Nothing is uploaded, and no password is involved, since the whole comparison runs locally on the files Instagram already gave you. For the full walkthrough, see [how to see who unfollowed you on Instagram](/blog/how-to-see-who-unfollowed-you-on-instagram).

## Quick Answers

**Can a deactivated account still see my profile?** No. Deactivation logs them out of Instagram entirely until they choose to reactivate. While deactivated, they cannot browse, view, or interact with anything, including your profile.

**If I'm blocked, do I disappear from their followers list too?** Yes. Blocking is mutual in effect: it removes the follow relationship in both directions, even though only one person initiated the block.

**Does unblocking bring back the follow relationship?** No. Unblocking only restores visibility. Whatever follow relationship existed before the block does not come back automatically. Either person would need to follow again.

**Is there any official way to check whether I'm blocked?** Not directly. Instagram does not expose a "you are blocked" flag anywhere in the app. The asymmetry test (a mutual's view versus yours) is the most reliable signal available.

**Why does a deactivated account sometimes still show old comments?** Comments and tags are stored on the post they were made under, not fully tied to live profile data. The username often persists even though the profile behind it is temporarily unreachable.`,
  },
  {
    slug: 'how-to-unfollow-everyone-on-instagram-at-once',
    cta: {
      heading: 'Know who to cut before you start.',
      body: 'Bulk unfollowing is safer when you work from an exact list. WhoUnfollowed turns your export into a clean non-follower list in your browser, with no password and nothing stored.',
      buttonLabel: 'Get your non-follower list',
    },
    cluster: 'account-health',
    title: 'How to Unfollow Everyone on Instagram at Once (the Fastest Safe Way)',
    metaTitle: 'How to Unfollow Everyone on Instagram at Once',
    metaDescription: 'Want to unfollow everyone on Instagram fast? Here is the real pacing that avoids an action block, why bulk-unfollow apps backfire, and a realistic timeline.',
    excerpt: "There's no button that unfollows everyone at once. Here is the actual pacing that clears a large list as fast as Instagram allows without tripping a block.",
    date: 'July 21, 2026',
    readTime: '6 min',
    tag: 'Guide',
    primaryKeyword: 'how to unfollow everyone on instagram at once',
    art: 'split',
    // Unsplash: 5nmf-0oW2Mg (a hand scrolling on a phone showing social media apps)
    image: '/blog/how-to-unfollow-everyone-on-instagram-at-once-hero.jpg',
    imageAlt: 'A hand scrolling through a phone showing social media apps, representing unfollowing accounts on Instagram',
    body: `There is no button that unfollows everyone on Instagram at once. Instagram's app only lets you unfollow one account at a time, and it caps how many unfollows it will accept in a given stretch before flashing "Action Blocked." The fastest way to clear a large following list is not a shortcut around that cap, it is working right up against it: steady batches, spaced out, done by hand. Here is exactly how to do that as quickly as Instagram allows.

This is a companion to [is it safe to mass unfollow on Instagram](/blog/is-it-safe-to-mass-unfollow-on-instagram), which covers why the block happens. This post is the playbook: the actual pacing, the actual timeline, and what to do instead of downloading a bulk-unfollow app.

## Why "at once" isn't really possible

Instagram doesn't publish its rate limits, but years of user reports and the same pattern showing up across the app point to a consistent shape:

- **Unfollows are capped per hour and per day.** Established accounts have more room than new ones, but everyone hits a ceiling.
- **The block is temporary, not permanent.** You'll see "Try Again Later" or "Action Blocked," and following/unfollowing gets locked for anywhere from a few hours to a couple of days.
- **Repeat triggers extend the lockout.** Hit the limit twice in a week and the next block tends to be longer.

None of this is about total volume alone. Unfollowing 800 accounts over two weeks is fine. Unfollowing 800 accounts in twenty minutes is not, even though the number is identical. Speed is what gets flagged, not size.

## The pacing that actually clears a list fast

Think in sessions, not one long push. A conservative, widely used pace that keeps you under the radar:

1. **20 to 30 unfollows per session.** Do this manually inside the Instagram app, tapping "Following" on each profile.
2. **A short gap between sessions.** An hour or two between batches on the same day is enough for most established accounts. Newer or smaller accounts should stretch that further.
3. **A hard daily ceiling.** Keep total daily unfollows in the low hundreds at most. Above that, you're pushing into the range where blocks start showing up in user reports regardless of pacing.
4. **Stop the moment you see a warning.** If Instagram throws any kind of error or block, stop for the day. Pushing through it is what turns a few-hour lockout into a multi-day one.

This isn't a rule Instagram publishes anywhere, it's the pattern that keeps people out of trouble. Push faster than this and you're gambling on when, not if, the block lands.

## Get the list first, so you're not guessing mid-session

The slowest part of any cleanup isn't the tapping, it's figuring out who to tap on. Instagram doesn't show you a clean list of accounts that don't follow you back inside the app. Your own data export does.

Request your [Instagram data download](/blog/how-to-download-your-instagram-data), then run the ZIP through [WhoUnfollowed](/). It reads the file in your browser, no login and no password, and hands you every account you follow that doesn't follow you back on one screen. Having that list ready before you open the app means every session is pure execution, not searching.

If you want help deciding who actually stays on the list before you start unfollowing, [how to clean up who you follow on Instagram](/blog/how-to-clean-up-who-you-follow-on-instagram) walks through sorting it. This post assumes you've already decided who goes and just need the mechanics of getting through the list.

## Should you use a bulk-unfollow app to go faster?

It's tempting. These apps promise to clear hundreds or thousands of accounts automatically, no manual tapping required. They don't work the way they're pitched, for two concrete reasons.

First, automating unfollows doesn't raise Instagram's limits, it just hits them faster and more consistently, which is exactly the pattern Instagram's spam detection is built to catch. Machine-even timing between actions is one of the clearest automation signals there is. You'll trip the block sooner than doing it by hand, not later.

Second, and this is the bigger issue, every one of these apps needs your Instagram username and password to act on your behalf. That's a direct violation of Instagram's Terms of Use, and it hands your login to a third party whose security practices you have no way to verify. If their servers get breached, your credentials go with everyone else's. This is the same trade-off covered in [why follower trackers ask for your password](/blog/why-instagram-follower-trackers-ask-for-your-password), and it applies just as much to a tool that unfollows for you as one that tracks for you.

There is no version of a bulk-unfollow app that is both fast and safe. The faster it claims to work, the harder it's hammering the exact limit that gets accounts blocked.

## A realistic timeline

Here's what the paced, manual approach actually looks like for different list sizes, at roughly 150 to 200 unfollows a day split across a few sessions:

| Accounts to unfollow | Rough timeline |
|---|---|
| Under 100 | Same day, in 3 to 4 sessions |
| 300 to 500 | 2 to 3 days |
| 1,000 | About a week |
| 3,000+ | Two to three weeks |

Slower than a single tap, yes. But it's the version that finishes without a five-day lockout resetting your progress halfway through.

## Quick answers

**Can I select multiple accounts and unfollow them all at once on Instagram?** No. The app only supports unfollowing one profile at a time. That's a soft safety measure Instagram built into its own interface, and any tool claiming true multi-select bulk unfollow is operating outside the official app.

**Does the time of day matter?** Not meaningfully. What matters is total volume in a given window and the gaps between sessions, not whether you're doing it at 9am or 9pm.

**What happens if I get blocked anyway?** Stop unfollowing entirely until the block clears, usually a few hours to a couple of days. Trying again immediately, or switching to an automation app to "push through it," is how a short block turns into a long one.

## The bottom line

The fastest real way to unfollow everyone on Instagram is manual, paced batches against a list you already have, not an automated shortcut. Get your exact non-follower list from your own data export, work through it in sessions of 20 to 30, leave gaps between them, and skip anything that asks for your password. It takes days instead of minutes for a large list, but it's the version that actually finishes.`,
  },
  {
    slug: 'what-is-the-follow-unfollow-method-on-instagram',
    cta: {
      heading: 'See who followed then dropped you.',
      body: 'Anyone running the follow/unfollow trick on you shows up as an unfollower. Upload your own Instagram export and WhoUnfollowed lists exactly who left, in your browser, in about two minutes. No password, nothing uploaded.',
      buttonLabel: 'See who unfollowed you',
      proNudge: 'Pro keeps your snapshot history and emails you the moment someone follows then drops you.',
    },
    cluster: 'unfollowers',
    title: 'Someone Followed You, Then Unfollowed? The Follow/Unfollow Method',
    metaTitle: 'Followed You Then Unfollowed? The Follow/Unfollow Method',
    metaDescription: 'A new follower disappears days after you follow back. That is the follow/unfollow method. Here is why people do it and how to see exactly who unfollowed you.',
    excerpt: 'Someone follows you, you follow back, and a few days later they are gone. That is not random. It is a known tactic called the follow/unfollow method, and here is how to catch everyone who has pulled it on you.',
    date: 'July 24, 2026',
    readTime: '5 min',
    tag: 'Guide',
    primaryKeyword: 'follow unfollow instagram',
    art: 'split',
    // Unsplash: ZMlcuVf2URA (smartphone showing a folder of social media app icons)
    image: '/blog/follow-unfollow-method-hero.jpg',
    imageAlt: 'A hand holding a smartphone showing social media apps, representing spotting the follow and unfollow tactic on Instagram',
    body: `A new follower pops up. You follow back, maybe out of politeness. A few days later they are gone, and your count is exactly where it started. That is not a glitch, and it is rarely random. It is a deliberate tactic called the follow/unfollow method, and once you know the pattern you will see it everywhere. Here is why people do it, and how to find out exactly who has done it to you.

## What the follow/unfollow method is

The move is simple. Someone follows a large batch of strangers, usually people in one niche, hoping a chunk of them follow back out of curiosity or reflex. A few days later they unfollow everyone, keeping their own following count low so their profile still looks selective. You were never a person to them, just a coin flip in a numbers game. It goes by a few names, follow-for-follow, F4F, or just follow/unfollow, but the mechanics are always the same.

## How to tell it happened to you

One quiet unfollow is impossible to pin on anyone. The follow/unfollow method has a signature, though:

- The account followed you first, recently, with no real interaction.
- You followed back within a few days.
- They unfollowed shortly after, whether or not you reciprocated.
- Their own following count stays suspiciously low for their follower count. More on that in [what a good follower-to-following ratio looks like](/blog/what-is-a-good-follower-to-following-ratio-on-instagram).

Instagram will not flag any of this for you. It does not tell you when someone unfollows you, the same way it does not tell them when you unfollow. We covered exactly what is and isn't notified in [does Instagram notify when you unfollow someone](/blog/does-instagram-notify-when-you-unfollow-someone).

## How to see exactly who did it

You cannot catch follow/unfollowers from memory, but your own data catches them for you. Anyone who followed you and later left is simply an unfollower, and unfollowers are something you can see precisely:

1. Request your Instagram data export. It is free and official. Steps: [how to download your Instagram data](/blog/how-to-download-your-instagram-data).
2. Do it again a week or a month later.
3. Compare the two. Anyone in the first followers list but missing from the second unfollowed you, the follow/unfollowers included.

That comparison is the entire job of a [who-unfollowed-you tool](/blog/how-to-see-who-unfollowed-you-on-instagram). Upload the export Instagram gives you and it shows the exact names in your browser, with no password and no login.

## Should you do it back?

No. Running the follow/unfollow method yourself is the fastest way to earn an Instagram action block. Rapid, repetitive following and unfollowing is one of the clearest bot signals there is, and Instagram rate-limits it hard, usually somewhere around 30 to 60 actions an hour and 150 to 200 a day before the warnings start. If you want to clean up who you follow, do it deliberately and at a human pace. See [is it safe to mass unfollow on Instagram](/blog/is-it-safe-to-mass-unfollow-on-instagram) for the concrete limits.

## The bottom line

If a follower vanished days after you followed back, you were most likely on the receiving end of the follow/unfollow method. You cannot stop people from trying it, but you can see exactly who did it. Compare two of your own Instagram exports and every follow/unfollower shows up as what they really are: an unfollower. Our tool does that comparison in your browser, is fully open source, and never asks for your password.`,
  },
  {
    slug: 'instagram-unfollow-checker',
    cta: {
      heading: 'Be your own unfollow checker.',
      body: 'You do not need to trust an app with your login. Upload the export Instagram already gives you and WhoUnfollowed shows the exact names in about two minutes, in your browser. No password, and the code is open source.',
      buttonLabel: 'Check who unfollowed you',
      proNudge: 'Pro turns the monthly check into an automatic one, with saved history and email alerts.',
    },
    cluster: 'unfollowers',
    title: 'Instagram Unfollow Checker: How to Check Who Unfollowed You (Free)',
    metaTitle: 'Instagram Unfollow Checker: Check Who Unfollowed You Free',
    metaDescription: 'An Instagram unfollow checker shows who stopped following you. Here is how these checkers work, which ones are safe, and how to check for free without a password.',
    excerpt: 'Instagram shows your follower count dropping but never the name behind it. An unfollow checker fills that gap. Here is how they work, which are safe, and how to check for free without handing over your login.',
    date: 'July 25, 2026',
    readTime: '6 min',
    tag: 'Guide',
    primaryKeyword: 'instagram unfollow checker',
    art: 'search',
    // Unsplash: 2MBnS4np8i0 (close-up of a phone showing social media icons)
    image: '/blog/instagram-unfollow-checker-hero.jpg',
    imageAlt: 'A close-up of a smartphone showing social media app icons, representing an Instagram unfollow checker tool',
    body: `Instagram is happy to show you the number going down. It will never show you the part you actually care about, which person is attached to the drop. An Instagram unfollow checker, some people call it an unfollow tracker, is any tool that closes that gap. Here is how these checkers work, which kind is safe to use, and how to check who unfollowed you for free without handing your account to a stranger.

## Why Instagram hides this on purpose

Instagram removed any built-in "who unfollowed me" view years ago, and it has never come back. The reasoning is not complicated. A feature that spotlights every unfollow would make the platform feel worse and push people to unfollow more quietly, or leave. So the app shows you a running total and nothing else. Everything past that total, you have to reconstruct yourself. That is the entire reason unfollow checkers exist.

## What an unfollow checker actually does

Under the friendly label, every unfollow checker does the same simple thing. It takes two snapshots of your follower list at different points in time and compares them. Anyone who was in the older list but missing from the newer one unfollowed you. A checker is really just a diff tool for follower lists with a nice interface on top. That matters, because how a checker gets those two snapshots is the whole safety question.

## The two kinds of checker, and why one is risky

| Factor | Password apps | Official-export tools |
|---|---|---|
| How it gets your list | You hand over your Instagram login | You upload the export Instagram gives you |
| Who touches your account | A third-party server logs in as you | Nobody, it reads a file |
| Instagram terms | Violated, risks a ban | Fully allowed, it is your own data |
| Your password | Shared with strangers | Never involved |

The first kind is the one to avoid. Any checker that asks you to "log in with Instagram" is signing into your account from its own servers, which breaks Instagram's terms and is a common trigger for a ban. We go deeper on that in [why follower trackers ask for your password](/blog/why-instagram-follower-trackers-ask-for-your-password) and [can you get banned for using a follower tracker](/blog/can-you-get-banned-for-using-a-follower-tracker-on-instagram).

## How to check who unfollowed you, safely

The safe method uses data Instagram already gives you, with no login required:

1. Request your data export from Instagram. It is free and takes anywhere from a few minutes to a couple of days. Step by step: [how to download your Instagram data](/blog/how-to-download-your-instagram-data).
2. Upload the ZIP to a checker that runs on your own device instead of asking for your password. See [Instagram follower trackers that work without a login](/blog/instagram-follower-tracker-without-login).
3. Do it again next month and compare the two snapshots. The difference is your unfollower list.

The full walkthrough lives in our pillar guide, [how to see who unfollowed you on Instagram](/blog/how-to-see-who-unfollowed-you-on-instagram).

## What a good unfollow checker should (and should not) do

Before you trust any checker with your follower data, run it past this list:

- **No password, ever.** Your own export is all it needs.
- **Processing on your device.** The best checkers read the file in your browser, so your follower list never travels to a server.
- **Open source.** If you can read the code, you can verify exactly what the checker does with your data instead of taking a marketing page's word for it.
- **No login wall for basic results.** Seeing who unfollowed you should not require you to make an account first.

## Checker or tracker, same thing

If you have been searching for an "unfollow tracker" and finding "checker" tools, or the reverse, you are looking at the same category. The words are interchangeable. What separates one tool from another is not the label but the method: whether it reads a file you control, or logs into your account.

## The bottom line

An unfollow checker is only ever a follower-list diff, so the tool itself is not the risk. The risk is how it gets your list. Pick one that reads your own Instagram export, keeps the work on your device, and shows you its code. Ours does all three: upload your export, see who unfollowed in your browser, no password and nothing stored.`,
  },
  {
    slug: 'is-there-a-free-app-to-see-who-unfollowed-you-on-instagram',
    cluster: 'unfollowers',
    title: 'Is There a Free App to See Who Unfollowed You on Instagram?',
    metaTitle: 'Free App to See Who Unfollowed You on Instagram?',
    metaDescription: 'Looking for a free app to see who unfollowed you on Instagram? Here is the truth about those apps, why most are a bad trade, and the genuinely free, safe way.',
    excerpt: 'You searched for a free app to see who unfollowed you, and the stores are full of them. Here is what those apps actually cost you, and the genuinely free way that does not touch your password.',
    date: 'August 1, 2026',
    readTime: '6 min',
    tag: 'Guide',
    primaryKeyword: 'free app to see who unfollowed you on instagram',
    art: 'lock',
    image: '/blog/free-app-hero.jpg',
    imageAlt: 'A close-up of a smartphone screen showing a grid of app icons, representing the search for a free app to see who unfollowed you on Instagram',
    cta: {
      heading: 'Skip the app. See it free, right here.',
      body: 'No download, no login, no subscription. Upload the export Instagram already gives you and WhoUnfollowed shows who unfollowed you and who never followed back, in your browser. No password, and it is open source so you can check it.',
      buttonLabel: 'See who unfollowed you free',
    },
    body: `Search "free app to see who unfollowed you on Instagram" and the app stores hand you dozens of results: unfollowers for Instagram, unfollow trackers, an unfollowers APK for Android, even browser extensions promising a one-click list. Most are free to download. Almost none are actually free once you see what they take in exchange. Here is what these apps really cost, and the genuinely free way to see who unfollowed you that does not involve any of them.

## What "free" usually means for these apps

A free download is not the same as a free tool. The typical app to see who unfollowed you on Instagram makes its money in one of a few ways, and you are what it sells:

- **It wants your Instagram login.** To read your followers, the app signs into your account from its servers and calls Instagram's private API as you. That breaks Instagram's terms and is a common trigger for [a ban or action block](/blog/can-you-get-banned-for-using-a-follower-tracker-on-instagram). We explain why so many insist on this in [why follower trackers ask for your password](/blog/why-instagram-follower-trackers-ask-for-your-password).
- **It shows you three names, then asks for money.** "Free" gets you a teaser. The actual list is behind a subscription.
- **It sells the data.** A free unfollow tracker with no login wall and no subscription is often monetising the one asset you handed it.

So "best unfollow app for Instagram free" is close to a contradiction. The ones that are safe are rarely free, and the ones that are free are rarely safe.

## The APK and extension versions are the same trade

Searching for an unfollowers APK (the Android install file) or an unfollow Instagram extension for your browser does not change the math. An APK sideloaded outside the Play Store has even less oversight, and a browser extension that can read your Instagram session is one update away from doing whatever it wants with it. Same login, same risk, same reason accounts get flagged.

## The genuinely free, safe way

There is a version that is actually free and actually safe, and it needs no app at all. Instagram already gives you your own follower and following lists. You just have to ask.

1. Request your data export from Instagram. It is free, official, and built into the app under your settings. Step by step: [how to download your Instagram data](/blog/how-to-download-your-instagram-data).
2. Upload that file to a tool that reads it instead of logging into your account. That single difference is the whole line between safe and not.
3. See your non-followers straight away, and upload a second export later to see exactly who unfollowed you in between.

This is what WhoUnfollowed does. It reads the export in your browser, so your data never touches a server, it never asks for your Instagram password, and the full non-followers and unfollowers breakdown is free with no account required. Because the code is open source, you can confirm all of that yourself instead of trusting a store listing. If "no login" is the part you care about, there is more in [Instagram follower trackers without login](/blog/instagram-follower-tracker-without-login).

## What to check before trusting any tool

Whether it calls itself an app, an unfollow tracker, or an Instagram unfollow tool, run it past this first:

- Does it ask for your Instagram login? If yes, close the tab.
- Does it read your own export, or log into your account?
- Can you see the results for free without making an account?
- Is the code open, so the privacy claim is verifiable?

## The bottom line

The honest answer to "is there a free app to see who unfollowed you on Instagram" is that the safest free option is not an app at all. It is your own official export, read by a tool that never logs in as you. Skip the APK, skip the extension, skip the login screen, and get the same answer without the risk.`,
  },
  {
    slug: 'how-to-see-who-unfollowed-you-without-them-knowing',
    cluster: 'unfollowers',
    title: 'How to See Who Unfollowed You on Instagram Without Them Knowing',
    metaTitle: 'See Who Unfollowed You Without Them Knowing (Instagram)',
    metaDescription: 'Want to see who unfollowed you on Instagram without them knowing? The safe method is completely invisible. Here is how it works, with no login needed.',
    excerpt: 'The good news about checking who unfollowed you: done the right way, nobody ever finds out. Here is how to see who unfollowed you on Instagram without them knowing, and without logging in anywhere.',
    date: 'August 2, 2026',
    readTime: '5 min',
    tag: 'Guide',
    primaryKeyword: 'how to see who unfollowed you without them knowing',
    art: 'bell',
    image: '/blog/invisible-check-hero.jpg',
    imageAlt: 'An overhead view of a person quietly holding a smartphone at a table, representing checking who unfollowed you on Instagram without anyone knowing',
    cta: {
      heading: 'Check completely invisibly.',
      body: 'WhoUnfollowed reads your own Instagram export in your browser. It never logs into your account and never notifies anyone, so nobody, including the people who left, can tell you looked. No password required.',
      buttonLabel: 'See who unfollowed you',
      proNudge: 'Pro saves your history and quietly emails you when someone new unfollows, so you never have to check by hand.',
    },
    body: `There are really two worries hidden inside "how to see who unfollowed you on Instagram without them knowing." One: will the person get a notification that I looked? Two: do I have to log in somewhere sketchy to find out? The safe method answers both. It is completely invisible to the other person, and it never asks you to log in anywhere.

## Does Instagram tell someone you checked?

No. Instagram has no "viewed your profile" feature, and it does not notify anyone when you look at their account, unfollow them, or check whether they still follow you. It also never tells you when someone unfollows you, which is the whole reason "who unfollowed me on Instagram" is such a common search in the first place. The platform stays silent in both directions. We covered exactly what does and does not trigger a notification in [does Instagram notify when you unfollow someone](/blog/does-instagram-notify-when-you-unfollow-someone).

So checking who unfollowed you is invisible by default. The person who dropped you will never know you noticed. The only way that changes is if you use a tool that acts on your account.

## The part that can actually expose you

What can get you noticed is not looking, it is using an [Instagram unfollow tracker](/blog/instagram-unfollow-checker) that logs into your account to work. When an app signs in as you and starts hitting Instagram's servers, that activity is tied to your account. At best it earns you an action block. At worst, the person you were curious about is beside the point, because your own account is the one that gets flagged. An unfollow tracker that needs your password is the opposite of discreet.

## The invisible method: your own export

The way to see who unfollowed you without them knowing, and without exposing yourself, is to work from data Instagram already gives you:

1. Request your data export from Instagram. It happens quietly inside your own settings and nobody is notified. Steps: [how to download your Instagram data](/blog/how-to-download-your-instagram-data).
2. Upload it to a tool that reads the file instead of logging in. No login means no footprint on your account and nothing for anyone to see. See [follower trackers that work without login](/blog/instagram-follower-tracker-without-login).
3. To catch unfollows going forward, save this export and compare it against a later one.

WhoUnfollowed does exactly this. It reads your export in the browser, never logs into Instagram, never notifies anyone, and never asks for your password. Nobody, including the people who unfollowed you, has any way to know you looked.

## The bottom line

Seeing who unfollowed you on Instagram is private by design: Instagram tells no one, in either direction. The only way to lose that privacy is to use an unfollow tracker that logs into your account. Stick to your own export, read by a tool that never signs in as you, and the whole thing stays completely invisible.`,
  },
  {
    slug: 'do-instagram-unfollow-apps-actually-work',
    cluster: 'privacy-safety',
    title: 'Do "Who Unfollowed Me" Apps Actually Work?',
    metaTitle: 'Do "Who Unfollowed Me" Instagram Apps Actually Work?',
    metaDescription: 'Do those "who unfollowed me" apps and Instagram unfollow trackers actually work? Here is what they really do, why many fail, and the reliable alternative.',
    excerpt: 'Every "who unfollowed me" app promises the same thing. Some show wrong data, some want your login, some just stop working. Here is what is really going on under the hood, and what to use instead.',
    date: 'August 3, 2026',
    readTime: '6 min',
    tag: 'Guide',
    primaryKeyword: 'do who unfollowed me apps work',
    art: 'search',
    image: '/blog/apps-actually-work-hero.jpg',
    imageAlt: 'A close-up of a smartphone displaying an alert notification, representing whether follower tracker apps actually work reliably',
    cta: {
      heading: 'Use the one that can\'t break.',
      body: 'WhoUnfollowed reads your official Instagram export instead of logging into your account, so no API change can break it and nothing gets your account flagged. It is open source, so "does it work" is something you can verify, not hope for.',
      buttonLabel: 'Try the reliable way',
    },
    body: `Search "do who unfollowed me apps actually work" and you find a wall of five-star ratings sitting next to a wall of one-star reviews saying "showed me wrong data" and "stopped working after the update." Both are telling the truth, because whether an unfollow tracker works depends entirely on how it is built. Here is what is happening under the hood, and why the reliable option looks nothing like the apps.

## How most of these apps work, and why they break

The typical Instagram follower tracker logs into your account and calls Instagram's private, undocumented API to pull your follower list. That approach has three built-in failure modes:

- **Instagram changes its API and the app dies.** These are unofficial endpoints Instagram never promised to keep stable. When Instagram tweaks them, every app relying on them breaks at once. That is the "stopped working after the update" review, and it happens constantly.
- **Rate limits give you partial data.** To avoid detection, these apps can only pull so much so fast. On a large account they often grab an incomplete list, then report people as unfollowers who never left. That is the "wrong data" review.
- **Your account gets flagged.** Logging in from a third-party server and hammering the API is exactly the behavior Instagram polices. The app "working" can cost you [an action block or ban](/blog/can-you-get-banned-for-using-a-follower-tracker-on-instagram).

So "does it work" is the wrong question. Even when one of these works today, it is one Instagram update from breaking tomorrow, and it puts your account at risk the whole time.

## The newer "AI unfollow" apps do not fix this

A wave of tools now market themselves as "IG unfollow AI" or AI-powered follower trackers. The AI branding does not change the plumbing. If the app still needs your Instagram login to read your followers, it has the same API dependency and the same ban risk as the old ones. A smarter label on the same risky method is still the risky method.

## What actually works reliably

The only approach that does not break when Instagram changes its API is one that never touches Instagram's API at all. Instagram gives every user an official export of their own followers and following lists. A tool that reads that file has nothing to break:

- No login, so nothing to flag.
- No private API, so no update can kill it.
- The complete list every time, so no false unfollowers from rate limits.

That is how WhoUnfollowed works. You upload the export Instagram gives you, it is parsed in your browser, and you get an accurate non-followers and unfollowers breakdown. And because it is [open source on GitHub](https://github.com/al-kilic/WhoUnfollowed) (AGPL for the app, MPL for the parser), "does it actually work" is not something you take on faith. You can read the code that does the work. No closed-source app can offer that.

## The bottom line

Do "who unfollowed me" apps work? Sometimes, briefly, until Instagram changes something or rate-limits them into showing you wrong data, and often at the cost of your account. A tool that reads your own official export instead has none of those failure points, and if it is open source you can verify exactly what it does. That is the difference between an app that works until it doesn't and a method that just works.`,
  },
  {
    slug: 'how-often-should-you-check-who-unfollowed-you-on-instagram',
    cluster: 'unfollowers',
    title: 'How Often Should You Check Who Unfollowed You on Instagram?',
    metaTitle: 'How Often Should You Check Who Unfollowed You?',
    metaDescription: 'How often should you check who unfollowed you on Instagram? Here is a sane cadence by account type, and how to get alerted automatically instead of checking.',
    excerpt: 'Checking who unfollowed you every hour is a fast way to make yourself miserable. Here is a sane cadence based on how you actually use Instagram, and how to stop checking manually altogether.',
    date: 'August 4, 2026',
    readTime: '5 min',
    tag: 'Guide',
    primaryKeyword: 'how often should you check who unfollowed you',
    art: 'bell',
    image: '/blog/how-often-check-hero.jpg',
    imageAlt: 'A person planning on a desk calendar beside a laptop and phone, representing how often to check who unfollowed you on Instagram',
    cta: {
      heading: 'Stop checking. Get told instead.',
      body: 'Upload your export to WhoUnfollowed and it keeps each snapshot, so every check is an automatic comparison. See who unfollowed you in your browser, free, with no password.',
      buttonLabel: 'See who unfollowed you',
      proNudge: 'Pro keeps your full snapshot history and emails you the moment someone unfollows.',
    },
    body: `Once you can finally see who unfollowed you, it is tempting to check constantly. Resist that. Checking every hour turns a useful signal into low-grade anxiety, and follower counts wobble for reasons that have nothing to do with you. Here is a saner cadence, and a way to stop checking by hand entirely.

## Why checking too often backfires

Follower numbers move daily from things you cannot control: Instagram purging bot accounts, people deactivating, spam sweeps. If you check every few hours you are mostly reacting to noise, reading meaning into a single unfollow that was really just a bot getting removed. We break down those causes in [why you lose followers overnight](/blog/why-did-i-lose-followers-overnight-on-instagram). Checking less often, but consistently, filters out the noise and shows you the real pattern.

## A sane cadence by account type

There is no universal number, but a good rule is to match your checking to how fast your account actually changes:

- **Casual or personal account:** once a month is plenty. Unfollows are slow and mostly do not matter.
- **Growing creator (under ~10k):** every week or two. Often enough to spot a pattern, rare enough to stay sane.
- **Active creator or small brand:** weekly. Tie it to when you review your other numbers so it becomes routine, not a compulsion.
- **After a specific event** (a viral post, a collab, a controversial share): check once a few days later to see the real net effect, then return to your normal rhythm.

The goal is a trend line, not a live feed. One clean data point a week beats ten anxious ones a day.

## The catch with checking manually

Every manual check means requesting or re-uploading an export and comparing it to the last one. Do that weekly and it becomes a chore you quietly abandon after a month. That is the real reason most people stop tracking: not that they stopped caring, but that the manual loop is tedious.

## Let it check for you instead

This is exactly what an [Instagram unfollow tracker](/blog/instagram-unfollow-checker) with saved history is for. Upload your export to WhoUnfollowed and it keeps each snapshot, so every future check is an automatic comparison instead of a manual diff. On the free tier you can always upload a fresh export and see who unfollowed you since the last one, in your browser, with no password. Pro adds saved snapshot history and email alerts, so instead of remembering to check, you simply get told when someone unfollows you.

## The bottom line

Check who unfollowed you often enough to see the trend and rarely enough to keep your sanity: monthly for casual accounts, weekly for active ones, plus a one-off after any big moment. Better yet, stop checking manually. Let a tracker keep your history and tell you when it actually matters.`,
  },
  {
    slug: 'instagram-unfollow-not-working-still-shows-following',
    cluster: 'unfollowers',
    title: 'I Unfollowed Someone on Instagram, But It Still Shows Me Following Them',
    metaTitle: 'Instagram Unfollow Not Working? Still Shows Following',
    metaDescription: 'Unfollowed someone on Instagram but it still shows you following them? This is a known Instagram bug, not just you. Here is why it happens and how to check for sure.',
    excerpt: 'You tap unfollow, close the app, and open it again to find you are still following them. This has actually been happening to a lot of people, including several public figures. Here is what is going on.',
    date: 'August 5, 2026',
    readTime: '5 min',
    tag: 'Guide',
    primaryKeyword: 'instagram unfollow not working still shows following',
    art: 'bell',
    image: '/blog/unfollow-still-showing-hero.jpg',
    imageAlt: 'A close-up of a smartphone with a cracked screen, representing an Instagram unfollow action that failed or reverted',
    cta: {
      heading: 'Stop guessing. Get the real answer.',
      body: 'Instagram\'s own follow button can lag, glitch, or quietly revert. Your data export cannot. Upload it to WhoUnfollowed and see exactly who you follow and who follows you back, in your browser, with no password.',
      buttonLabel: 'Check your real follow status',
    },
    body: `You tap unfollow. The button changes to "Follow." You move on with your day. Then you open Instagram later and that same account is back in your following list, like nothing happened. If this just happened to you, you are not losing your mind and you did not imagine tapping the button. Instagram unfollow actions failing or silently reverting is a real, documented problem, not just a you problem.

## This has happened publicly, more than once

In early 2026, several public figures reported this exact issue with official accounts on Instagram. Singer Gracie Abrams said she had to unfollow the same account three separate times because it kept coming back. Demi Lovato posted that she had unfollowed an account twice in one day. Regular users reported the same thing in droves: accounts they never chose to follow just appeared in their following list, and unfollowing them did not stick.

Meta's own communications team responded publicly, saying people were not deliberately made to follow anything, but acknowledging that "it may take some time for follow and unfollow requests to go through." In plain terms: Instagram confirmed that unfollow actions can fail, lag, or get reversed on their end. That is not a rumor, it is an admission.

## Why this happens

A few different things can produce the same symptom:

- **Request lag.** Your tap sends a request to Instagram's servers, and under load or during a backend change, that request can fail silently instead of erroring out. The app shows the button change locally before confirming it server-side, so you see success even when it did not save.
- **App cache showing stale data.** Sometimes the unfollow did work, but your app is showing a cached version of your following list from before the change synced.
- **A genuine bug during a backend rollout.** The 2026 incident above happened alongside Instagram changing how certain accounts are handled. New code paths are exactly when this kind of bug tends to surface.

None of these are something you did wrong, and none of them mean your account is broken specifically.

## How to tell if it actually worked

Closing and reopening the app is not a reliable test, since it can be showing you the same stale cache that caused the confusion. A few things that actually work:

1. **Force-quit and reopen the app**, not just switch away and back. This clears the in-memory cache that a soft-switch does not.
2. **Check from a different device or the mobile web version** (instagram.com in a browser). If the account shows as unfollowed there but not in your app, it is a sync/cache issue on your device, not a failed unfollow.
3. **Wait and check again in a few hours.** If Meta's own statement is accurate, some of these requests simply take time to finish processing.
4. **Get the authoritative answer from your own data.** Instagram's live UI is exactly the layer that is glitching. Your official data export reads the underlying account record, not the app's local cache, which makes it the one source that cannot lie to you the way the follow button just did.

## If you are trying to find out who unfollowed you, not who you unfollowed

This bug runs in the other direction too. If someone unfollowed you and Instagram's notification or count is lagging, the visible number can look wrong for a while. That is a separate but related problem, covered in [does Instagram notify when you unfollow someone](/blog/does-instagram-notify-when-you-unfollow-someone) and [how to see who unfollowed you on Instagram](/blog/how-to-see-who-unfollowed-you-on-instagram).

## The bottom line

If you unfollowed someone and Instagram still shows you following them, you almost certainly did nothing wrong. Instagram has publicly acknowledged that follow and unfollow requests can lag or fail. Force-quitting the app and waiting usually resolves it. If you want certainty instead of a guess, your own data export shows your real following list as Instagram's servers actually have it, not what a glitchy button claims.`,
  },
  {
    slug: 'instagram-great-purge-2026-follower-drop',
    cluster: 'unfollowers',
    title: 'The Instagram "Great Purge" of 2026: What Happened to Everyone\'s Followers',
    metaTitle: 'Instagram "Great Purge" 2026: Why Your Followers Dropped',
    metaDescription: 'Lost a chunk of followers in 2026 and saw people calling it the "Great Purge"? Here is what actually happened, and how to tell if it hit your account or if real people left.',
    excerpt: 'If your follower count dropped hard in 2026 and you saw people online calling it the "Great Purge," you were not imagining it. Here is what that event actually was, and how to check whether it was bots or real people.',
    date: 'August 5, 2026',
    readTime: '6 min',
    tag: 'Guide',
    primaryKeyword: 'instagram great purge 2026',
    art: 'ghost',
    image: '/blog/great-purge-2026-hero.jpg',
    imageAlt: 'A close-up of a smartphone screen showing social media app icons, representing the 2026 Instagram mass account purge',
    cta: {
      heading: 'Find out what your drop actually was.',
      body: 'Bot purge or real unfollows, the only way to know for sure is to see the names. Upload your Instagram export to WhoUnfollowed and see exactly who left, in your browser, with no password.',
      buttonLabel: 'See who actually left',
    },
    body: `If you logged into Instagram sometime in 2026 and your follower count had dropped by a noticeable chunk overnight, with no post, no controversy, nothing you did, you were not alone. Creators, brands, and even celebrity accounts reported the same thing around the same window, and people started calling it the "Great Purge." Here is what that actually was, and how to tell if it touched your account.

## What the Great Purge actually was

Instagram ran a large-scale removal of accounts it identified as fake, spam, bot-operated, or otherwise inauthentic. This was not a rumor or a glitch, it was Instagram doing what it periodically does at a bigger scale than usual: cleaning bot and spam accounts off the platform. When those accounts get removed, every real account they were "following" loses that follower instantly, all at once. Do that across millions of fake accounts simultaneously and a lot of real users saw their numbers drop in a single day, hard enough that it became its own named moment online.

This is the same underlying mechanism covered in [why you lose followers overnight](/blog/why-did-i-lose-followers-overnight-on-instagram), just at a much bigger, more visible scale than a routine daily purge.

## How to tell if the Great Purge hit you

Not every drop in 2026 was the purge, and not everyone who lost followers that month lost them to it. A few signals that point to a bot purge specifically, rather than real people leaving:

- **The drop was sudden and large relative to your normal daily fluctuation**, not a slow bleed over days or weeks.
- **You cannot recall any specific post, comment, or controversy** that would explain real people choosing to leave.
- **The accounts that vanished, if you can check, had the classic ghost-follower signature**: little to no profile content, generic usernames, zero engagement history. More on identifying that pattern in [Instagram ghost followers](/blog/instagram-ghost-followers-how-to-find-and-remove-them).

If your drop does not match that pattern, especially if it was gradual or tied to something you posted, it is more likely real people, not a purge.

## Why this is actually a good thing, even though it stings

A bot account was never a real person seeing your content, engaging with it, or being a potential customer or fan. It only ever inflated your number and dragged down your real engagement rate, since Instagram measures how many of your followers actually interact with what you post. Losing accounts that were never real people is not a loss of audience, it is Instagram doing an accuracy correction. The count feels worse. The actual reach to real humans does not change.

## How to know for certain, instead of guessing

Instagram does not label which unfollows were a bot purge and which were a real person leaving. The only way to know for sure which is which is to look at the actual accounts that disappeared from your list. That requires comparing two snapshots of your followers, one from before the drop and one from after, and reviewing exactly who is in the difference.

That comparison is what [seeing who unfollowed you](/blog/how-to-see-who-unfollowed-you-on-instagram) is for. Upload your own Instagram export from before and after, and instead of a mystery number, you get the actual list of names, so you can judge for yourself whether it looks like bots or people you know.

## The bottom line

The 2026 "Great Purge" was a real, large-scale Instagram bot and spam removal, not a bug and not something you caused. If your drop was sudden, large, and unexplained by anything you posted, it was very likely this. If you want to know for certain rather than guess, compare your own before-and-after export and look at the actual names in the difference.`,
  },
  {
    slug: 'why-follower-count-doesnt-match-tracker',
    cluster: 'unfollowers',
    title: 'Why Doesn\'t Your Instagram Follower Count Match What a Tracker Shows?',
    metaTitle: 'Instagram Follower Count Wrong? Why Trackers Disagree',
    metaDescription: 'Your Instagram follower count and your unfollow tracker show different numbers. Here is why that happens, from caching lag to outdated tools, and how to get the real answer.',
    excerpt: 'Instagram says one number. Your tracker says another. Neither one is lying to you on purpose. Here is why follower counts drift out of sync, and how to get a number you can actually trust.',
    date: 'August 5, 2026',
    readTime: '5 min',
    tag: 'Guide',
    primaryKeyword: 'instagram follower count doesn\'t match tracker',
    art: 'ratio',
    image: '/blog/follower-count-mismatch-hero.jpg',
    imageAlt: 'A smartphone resting on printed charts and graphs, representing a mismatch between an Instagram follower count and a tracker',
    cta: {
      heading: 'Get a number you can actually trust.',
      body: 'A fresh export is the one source that cannot be stale or wrong the way a cached count can. Upload it to WhoUnfollowed and see your real, current follower and following lists, in your browser, with no password.',
      buttonLabel: 'Get your real numbers',
    },
    body: `You open the Instagram app and it says one follower count. You open an unfollow tracker, or even just switch to instagram.com in a browser, and it says something else, sometimes off by a handful, sometimes by a lot more. Neither number is necessarily wrong on purpose. Here is what actually causes the mismatch, and how to get an answer you do not have to second-guess.

## Instagram's own number can lag

The count shown at the top of your profile is not always recalculated live. Instagram frequently serves it from a cache to keep the app fast, and that cache can lag behind the true, current number by minutes or sometimes longer. If ten people followed you and three unfollowed in the same short window, your live count only reflects the net change of seven, and depending on caching, even that net number can take a moment to catch up. This is closely related to why counts can look strange right after [an overnight drop](/blog/why-did-i-lose-followers-overnight-on-instagram): the display is playing catch-up with reality, not reporting it live.

## Follows and unfollows happening at the same time

Your follower count is always a net number. If you are watching it in real time expecting it to only go up, it can look "wrong" simply because gains and losses are landing simultaneously and the number you see is gains minus losses, not gains alone.

## Third-party tools reading outdated data

Instagram periodically changes the structure of the data it exports, adding fields, renaming ones, or changing how relationships are represented. A tracker built against an older version of that structure can misread the new one, showing blank usernames, an inflated unfollower count, or a total that disagrees with Instagram's own number by a noticeable margin. This is a real, common cause of "why don't these numbers match," separate from whether the tracker itself is trustworthy, which is a different question covered in [do Instagram unfollow apps actually work](/blog/do-instagram-unfollow-apps-actually-work).

## Which number should you actually trust

Given all of the above, chasing the "real" live number is often the wrong goal. A count on a screen, whether it is Instagram's or a tracker's, is a snapshot that can be stale the moment you look at it. What does not go stale is a fresh export: it reflects your account's actual state at the exact moment you requested it, not a cached approximation.

1. Request a fresh export from Instagram whenever you want a real answer, not last week's. Steps: [how to download your Instagram data](/blog/how-to-download-your-instagram-data).
2. Read it with a tool that shows you the actual list of names, not just a summary number. A list you can scroll is much harder to get subtly wrong than a single count, and you can verify it yourself.
3. If a number still looks off, recount from the export rather than trusting any cached display, including the one inside Instagram's own app.

## The bottom line

Follower counts disagree because they are cached, because gains and losses net out in real time, and because tools can misread Instagram's data format after it changes. None of that means any single number is lying to you. It means a live count is a snapshot, not a guarantee. A fresh export read into a full list of names, not just a total, is the closest thing to a number you can actually trust.`,
  },
  {
    slug: 'instagram-instants-mutual-followers-who-unfollowed',
    cluster: 'unfollowers',
    title: 'Why Your Instagram Instants Audience Keeps Shrinking',
    metaTitle: 'Instagram Instants Audience Shrinking? Here Is Why',
    metaDescription: 'Instagram Instants only go to mutual followers. If your Instants audience feels smaller than it used to, some of those people unfollowed you. Here is how to check.',
    excerpt: 'Instagram Instants only reach people who still follow you back. If that list looks smaller than it used to, it is not your imagination, someone in it unfollowed you. Here is how the two connect, and how to see exactly who.',
    date: 'August 12, 2026',
    readTime: '5 min',
    tag: 'Guide',
    primaryKeyword: 'instagram instants audience shrinking',
    art: 'ghost',
    image: '/blog/instants-audience-hero.jpg',
    imageAlt: 'A close-up of a hand holding a smartphone taking a photo, representing sharing an Instagram Instant with mutual followers',
    cta: {
      heading: 'Find out who dropped from your list.',
      body: 'Instants only reach people who still follow you back, so a shrinking list usually means someone left. Upload your Instagram export to WhoUnfollowed and see exactly who unfollowed you, in your browser, with no password.',
      buttonLabel: 'See who unfollowed you',
    },
    body: `Instagram Instants launched globally on May 13, 2026, the disappearing, one-view photo feature that borrows heavily from BeReal and Snapchat. If you have been using it for a while, you may have noticed something: the list of people you can send an Instant to feels smaller than it used to. That is not your imagination, and it is not a bug. It is directly tied to who still follows you.

## What Instants actually are

An Instant is a quick, unedited photo, caption only, no filters, no camera roll uploads. It disappears after the first view or automatically after 24 hours, and it cannot be screenshotted. You take it, send it, and it is gone. The feature is built inside Instagram's existing social graph rather than as a separate app, which matters for the next part.

## Why your audience for it can shrink

Instants can only go to your Close Friends list or your mutual followers, meaning accounts that follow you and that you follow back. That single detail is the whole story. Your Instants audience is not a fixed list you set once. It is recalculated from your current, live mutual-follow relationships every time you open the sender.

If someone in that pool unfollows you, they stop being a mutual follow, and they quietly drop out of your eligible recipients the next time you go to send an Instant. You never get a notification about it. You just notice, eventually, that the list looks a little shorter than it did last month.

## It is not always an unfollow

A shrinking Instants list has a few possible causes, and unfollowing is only one:

- **They unfollowed you.** The most common cause. Once the mutual follow breaks, they are out of the pool.
- **You unfollowed them.** The same rule cuts both ways. If you cleaned up who you follow, some of those people leave your Instants pool too, even though they still follow you.
- **Their account was removed or deactivated.** Covered in more detail in [deactivated, deleted, or blocked, how to tell](/blog/deactivated-or-blocked-on-instagram-how-to-tell).
- **A Close Friends list change**, if you were sending to that list specifically rather than mutuals generally.

Instagram will not tell you which of these happened, the same way it never tells you [when someone unfollows you](/blog/does-instagram-notify-when-you-unfollow-someone). The recipient picker just quietly reflects whatever your current mutual-follow list happens to be.

## How to actually find out who left

Scrolling the Instants sender and trying to remember who used to be on it is not reliable, you are working from memory against a list that changes constantly. The accurate way is the same one that works for any unfollow question: compare your own follower data from two points in time.

1. Request your Instagram data export. Steps: [how to download your Instagram data](/blog/how-to-download-your-instagram-data).
2. Do it again later and compare the two.
3. Anyone missing from the newer list unfollowed you, and anyone who left your following list is someone you should expect to see missing from your Instants pool too.

That comparison is exactly what [seeing who unfollowed you on Instagram](/blog/how-to-see-who-unfollowed-you-on-instagram) covers in full. It reads your own export in your browser, so there is no password involved and nothing leaves your device.

## The bottom line

Instagram Instants only reach people who still follow you back, so watching that list shrink is actually a real, live signal about your follower relationships, even though Instagram never states it plainly. If you want to know exactly who caused the drop instead of guessing, your own data export gives you the real names, not a shrinking picker list you are trying to remember from last week.`,
  },
  {
    slug: 'instagram-audience-connections-does-it-show-unfollowers',
    cluster: 'unfollowers',
    title: 'Does Instagram\'s "Audience Connections" Show Who Unfollowed You?',
    metaTitle: 'Does Audience Connections Show Who Unfollowed You?',
    metaDescription: 'Instagram is testing an "Audience Connections" dashboard for creators. Does it actually show who unfollowed you, or just who engaged less? Here is what it really does.',
    excerpt: 'Instagram is testing a new creator dashboard that flags followers who have gone quiet. It sounds like the unfollow list creators have wanted for years. Here is what it actually shows, and what it still does not.',
    date: 'August 13, 2026',
    readTime: '6 min',
    tag: 'Guide',
    primaryKeyword: 'instagram audience connections unfollowers',
    art: 'search',
    image: '/blog/audience-connections-hero.jpg',
    imageAlt: 'A tablet displaying analytics charts on a desk beside a smartphone, representing Instagram\'s Audience Connections creator dashboard',
    cta: {
      heading: 'Get the list, not just the trend.',
      body: 'Audience Connections flags who has gone quiet. It does not name who unfollowed you. Upload your export to WhoUnfollowed and get the actual list, in your browser, with no password.',
      buttonLabel: 'See your real unfollow list',
    },
    body: `Instagram is beta testing a new feature inside the Professional Dashboard called Audience Connections, built to help creators understand their audience better. It highlights your top engaged followers, your new followers, and followers who have become less engaged over time. That last category sounds like exactly what creators have wanted for years: a built-in unfollow list. It is not quite that. Here is what Audience Connections actually shows, and where the gap still is.

## What the feature actually does

Audience Connections lives inside the Professional Dashboard, available to business and creator accounts. It groups your audience into a few buckets:

- **Top engaged followers**, the people who like, comment, and interact with your content most.
- **New followers**, the people who recently started following you.
- **Followers who have become less engaged over time**, people who used to interact and have gone quiet.

That third bucket is the one people are excited about, because it is the closest thing Instagram has ever offered to "here is who is drifting away from you."

## Less engaged is not the same as unfollowed

This is the important distinction. A follower flagged as "less engaged" is still following you. They just stopped liking or commenting as much as they used to. That is a real, useful signal about your content and your relationship with that follower, but it is not an unfollow, and it will never overlap perfectly with your actual unfollower list.

Someone can go completely quiet, never engage again, and still be sitting in your followers list a year later. Someone else can unfollow you the same day they last liked a post, and Audience Connections has no bucket for "gone entirely." The dashboard is built around engagement trends, not follow status changes, and those are genuinely different things. This is the same distinction covered in [Instagram ghost followers](/blog/instagram-ghost-followers-how-to-find-and-remove-them): a quiet follower and a gone follower are not the same problem.

## Why Instagram still does not show a direct unfollow list

Instagram has never shipped a plain "here is exactly who unfollowed you since last time" feature, in the Professional Dashboard or anywhere else, and Audience Connections does not change that. It confirmed once again in [does Instagram notify when you unfollow someone](/blog/does-instagram-notify-when-you-unfollow-someone) that the platform intentionally stays quiet on both follows and unfollows. A feature that surfaces engagement trends without naming exits fits that same pattern: useful insight, but stopping short of the one specific answer people actually want.

## How to get the real answer

If what you actually want is the names of people who unfollowed you, not an engagement trend, the dependable method has not changed:

1. Save a snapshot of your followers using your own Instagram export. See [how to download your Instagram data](/blog/how-to-download-your-instagram-data).
2. Do it again later.
3. Compare the two. Anyone missing is a real, confirmed unfollow, not an engagement guess.

That is the exact comparison covered in [how to see who unfollowed you on Instagram](/blog/how-to-see-who-unfollowed-you-on-instagram), done in your browser with your own data, no password required.

## The bottom line

Audience Connections is a genuinely useful addition for creators who want to understand engagement trends, and it is closer to an unfollow signal than anything Instagram has shipped before. But "less engaged" and "unfollowed" are still two different lists. If you need the real one, a before-and-after comparison of your own export remains the only way to get it.`,
  },
  {
    slug: 'does-unfollowing-someone-remove-them-as-your-follower',
    cluster: 'unfollowers',
    title: 'Does Unfollowing Someone Remove Them as Your Follower?',
    metaTitle: 'Unfollow vs Remove Follower on Instagram: The Difference',
    metaDescription: 'Does unfollowing someone on Instagram remove them as your follower too? No, they are two separate actions. Here is exactly what each one does.',
    excerpt: 'You unfollow someone, expecting a clean break. Instead they are still right there in your followers list. Here is why that happens: unfollowing and removing a follower are two completely different actions.',
    date: 'August 14, 2026',
    readTime: '5 min',
    tag: 'Guide',
    primaryKeyword: 'does unfollowing someone remove them as a follower',
    art: 'split',
    image: '/blog/unfollow-vs-remove-hero.jpg',
    imageAlt: 'A close-up of hands using a smartphone touchscreen, representing the difference between unfollowing someone and removing them as a follower on Instagram',
    cta: {
      heading: 'See both lists clearly.',
      body: 'Once you know unfollow and remove-follower are separate actions, the next step is seeing your real lists. Upload your export to WhoUnfollowed and see exactly who you follow, who follows you, and who left, in your browser, with no password.',
      buttonLabel: 'See your real lists',
    },
    body: `You unfollow someone expecting a clean break from them. Then you check your followers list and there they are, still following you, still able to see everything you post. This trips people up constantly, and the reason is simple once you know it: unfollowing someone and removing them as a follower are two completely separate actions on Instagram, and doing one does not do the other.

## The two actions, plainly

**Unfollowing** affects what you see. When you unfollow someone, their posts stop showing up in your feed. That is the entire effect. It says nothing about whether they still follow you, and if your account is public, they can keep seeing everything you post, exactly as before.

**Removing a follower** affects what they see. This is a separate action, found by opening your followers list, finding the account, and using the option to remove them. It ends their follow of you without blocking them. They stop seeing your posts in their feed, and if your account is private, they would need to send a new follow request to see your content again. Instagram does not notify them when you do this.

## Why this confuses people

Most people expect "unfollow" to be symmetrical, like it should undo a connection in both directions. It does not. Instagram treats "who you follow" and "who follows you" as two independent lists, and only one action affects each:

| Action | What it changes | Do they know? |
|---|---|---|
| Unfollow | Your following list. Their posts leave your feed. | No notification either way |
| Remove follower | Your followers list. You leave their feed. | No notification either way |

Neither action tells the other person anything, which lines up with how quiet Instagram stays about follow changes in general, covered in [does Instagram notify when you unfollow someone](/blog/does-instagram-notify-when-you-unfollow-someone).

## When you would use which one

- **Use unfollow** when you just want a lighter feed and do not care whether they still see your posts. This is the normal move for [cleaning up who you follow](/blog/how-to-clean-up-who-you-follow-on-instagram).
- **Use remove follower** when you specifically do not want someone seeing what you post anymore, without the more visible step of blocking them outright.
- **Use both** if you want a genuinely clean break in each direction.

## How this connects to who unfollowed you

Understanding this distinction matters for the reverse question too. If you are trying to figure out [who unfollowed you](/blog/how-to-see-who-unfollowed-you-on-instagram), you are specifically looking for people who used to be in your followers list and are not anymore, meaning either they unfollowed you, or you removed them and forgot. The two look identical from your side unless you remember which action you took. If you are also checking [who does not follow you back](/blog/who-doesnt-follow-you-back-on-instagram), that is the other list entirely, people you follow who never followed you or who unfollowed you without you removing anything.

## The bottom line

Unfollowing someone changes your feed. Removing a follower changes theirs. They are independent actions, and doing one has no effect on the other. Once that clicks, the confusing case of "I unfollowed them but they are still following me" stops being confusing. If you want to see your real following and followers lists side by side instead of guessing which action you took on who, your own Instagram export shows both, exactly as they stand today.`,
  },
  {
    slug: 'can-you-see-who-unfollowed-you-private-instagram-account',
    cluster: 'unfollowers',
    title: 'Can You See Who Unfollowed You on a Private Instagram Account?',
    metaTitle: 'Who Unfollowed You on a Private Instagram Account?',
    metaDescription: 'Yes, you can see who unfollowed you on a private Instagram account. Here is why the official export method works the same either way, and why it is the better choice for private accounts specifically.',
    excerpt: 'Your account is private for a reason, so handing a random app your login feels worse, not better. Here is why seeing who unfollowed you works exactly the same on a private account, and why the safe method matters even more here.',
    date: 'August 20, 2026',
    readTime: '5 min',
    tag: 'Guide',
    primaryKeyword: 'see who unfollowed you private instagram account',
    art: 'lock',
    image: '/blog/private-account-hero.jpg',
    imageAlt: 'A smartphone wrapped in a chain with a padlock, representing checking who unfollowed you on a private Instagram account',
    cta: {
      heading: 'Private account, same safe method.',
      body: 'Your export includes your real followers and following lists no matter your privacy setting. Upload it to WhoUnfollowed and see exactly who unfollowed you, in your browser, with no password and no login.',
      buttonLabel: 'See who unfollowed you',
    },
    body: `You keep your Instagram account private for a reason, so the idea of handing your login to some random "who unfollowed me" app feels worse than it would for a public account, not better. The good news is you do not have to. Seeing who unfollowed you works exactly the same on a private account as it does on a public one, and understanding why makes the case for the safe method even stronger here.

## Yes, it works the same either way

The official Instagram data export, the same one covered in [how to see who unfollowed you on Instagram](/blog/how-to-see-who-unfollowed-you-on-instagram), includes your own followers and following lists regardless of your privacy setting. Privacy on Instagram controls who can see your content and who has to request to follow you. It has no bearing on your own access to your own data. When you request your export, Instagram hands you the same complete followers and following files whether your account is public or private, because it is your data either way.

That means the whole method, compare two exports and see who is missing, works identically. There is no private-account version with fewer features or a smaller export.

## Why this matters more, not less, for private accounts

If your account is private, you likely already care more than average about who has access to your information. That instinct is correct, and it should extend to how you check who unfollowed you, not just to who can see your posts.

Password-based unfollow trackers, the apps that ask you to log in with your Instagram credentials, are a bigger risk here for a specific reason: a private account's entire value is that you control who sees it. Handing a third-party app your login means that app can technically see your private followers list, your private content, and act on your behalf, all outside the boundary you set up your account to enforce in the first place. For a public account the same risk exists, but a private account is precisely the case where the mismatch between "why I made this private" and "what I just gave this app access to" is the most obvious.

This is the same reasoning covered more generally in [why follower trackers ask for your password](/blog/why-instagram-follower-trackers-ask-for-your-password) and [can you get banned for using a follower tracker](/blog/can-you-get-banned-for-using-a-follower-tracker-on-instagram), it just lands harder when the account in question was set to private specifically to limit exposure.

## What actually changes for a private account (not much)

A couple of small, practical notes specific to private accounts:

- **Follow requests you have not accepted yet do not count as followers.** Your export reflects confirmed followers only, pending requests are a separate thing Instagram tracks elsewhere.
- **The export process itself is identical.** Same request flow, same file format, same wait time. Nothing about being private changes how you ask Instagram for your data.
- **You are still never notified**, in either direction. A private account does not change the fact that [Instagram stays quiet about unfollows](/blog/does-instagram-notify-when-you-unfollow-someone) no matter who can see your profile.

## How to do it

The steps are exactly the pillar guide's steps, with no private-account detour required:

1. Request your data export from Instagram's own settings. Full walkthrough: [how to download your Instagram data](/blog/how-to-download-your-instagram-data).
2. Upload it to a tool that reads the file locally instead of asking for your login. See [follower trackers that work without login](/blog/instagram-follower-tracker-without-login).
3. Do it again later and compare the two to see exactly who left.

## The bottom line

Being private does not limit what you can see about your own account, it only limits what other people can see. The safe, export-based way to check who unfollowed you works identically whether your account is public or private, and given that a private account exists specifically to control access, it is the one case where skipping a password-based app in favor of your own data matters most.`,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}

export interface Cluster {
  id: ClusterId;
  /** Human label for the topic series, shown in the article cluster block. */
  label: string;
  /** Slug of the pillar post that anchors the cluster. */
  pillarSlug: string;
}

export const CLUSTERS: Record<ClusterId, Cluster> = {
  'unfollowers':    { id: 'unfollowers',    label: 'Seeing who unfollowed you',       pillarSlug: 'how-to-see-who-unfollowed-you-on-instagram' },
  'data-export':    { id: 'data-export',    label: 'Exporting your Instagram data',   pillarSlug: 'how-to-download-your-instagram-data' },
  'privacy-safety': { id: 'privacy-safety', label: 'Tracker privacy and safety',      pillarSlug: 'why-instagram-follower-trackers-ask-for-your-password' },
  'account-health': { id: 'account-health', label: 'Account health and follow ratio', pillarSlug: 'instagram-follow-ratio-what-it-means-how-to-improve-it' },
};

