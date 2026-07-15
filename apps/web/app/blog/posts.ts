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
  body: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-did-i-lose-followers-overnight-on-instagram',
    cluster: 'unfollowers',
    title: 'Why Did I Lose Followers Overnight on Instagram?',
    metaTitle: 'Why Did I Lose Followers Overnight on Instagram?',
    metaDescription: 'Woke up with fewer followers? Here are the real reasons Instagram follower counts drop overnight, from bot purges to deactivations, and how to see exactly who left.',
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

The reason to get comfortable with the official export is that it removes any excuse to hand your password to a follower-tracking app. Those apps log in as you and pull data through Instagram's private API, which breaks Instagram's Terms of Use and is a common reason accounts get restricted. The export Instagram gives you is already yours. A good tool just reads it, no password required.`,
  },
  {
    slug: 'is-it-safe-to-mass-unfollow-on-instagram',
    cluster: 'privacy-safety',
    title: 'Is It Safe to Mass Unfollow on Instagram?',
    metaTitle: 'Is It Safe to Mass Unfollow on Instagram?',
    metaDescription: 'Thinking of unfollowing a lot of accounts at once? Here is how Instagram action limits work, what actually triggers a block, and a safer way to clean up your following list.',
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
    cluster: 'unfollowers',
    title: 'How to See Who Unfollowed You on Instagram (Without Getting Banned)',
    metaTitle: 'See Who Unfollowed You on Instagram Safely',
    metaDescription: 'Most follower trackers put your account at risk. Here\'s how to see who unfollowed you using Instagram\'s own data export, no password required.',
    excerpt: 'Every popular "who unfollowed me" tool works the same way: they ask for your Instagram password, then use it to call Instagram\'s API on your behalf. That\'s a TOS violation. Here\'s the safe alternative.',
    date: 'May 15, 2026',
    readTime: '4 min',
    tag: 'Guide',
    primaryKeyword: 'how to see who unfollowed you on Instagram',
    art: 'search',
    // Unsplash: Ebb8fe-NZtM (hand holding a phone showing Instagram Insights)
    image: '/blog/who-unfollowed-hero.jpg',
    imageAlt: 'A hand holding a phone showing Instagram Insights with reach and account activity stats',
    body: `Most follower trackers work fine, right until your account gets flagged, restricted, or permanently disabled.

The reason is straightforward. These tools ask for your Instagram password so they can log in as you, call Instagram's private API, and pull your follower data. Instagram explicitly bans this in its Terms of Use. When their systems detect unusual API activity (and they do), the account that gets punished is yours, not the app's.

There is a safer way. Instagram is legally required to give you a copy of your own data under GDPR Article 20. That includes your full followers and following lists. You request the file directly from Instagram's settings, download it, and hand it to a tool that reads it locally in your browser. No password. No API. No risk.

![A hand holding a phone beside a laptop, entering a numeric code to unlock an account](/blog/who-unfollowed-inline.jpg)

## Step 1: Request Your Data Export from Instagram

Open Instagram on mobile or desktop. Go to Settings, then "Your activity," then "Download your information." Select JSON format (not HTML). Choose "Followers and following" from the data categories. Submit the request.

Instagram typically delivers the export within a few hours, though it can take up to 14 days for larger accounts. You'll get an email with a download link.

## Step 2: Download the ZIP File

Click the link in the email and download your file. It's a ZIP archive containing your account data. The files you need are inside the \`connections/followers_and_following/\` folder.

## Step 3: Upload the ZIP to WhoUnfollowed

Go to [whounfollowed.co](/) and drop your ZIP into the upload zone. The app reads the file entirely inside your browser. Nothing is sent to a server. You can disconnect from the internet before uploading if you want to verify this yourself.

If you want to see who specifically unfollowed you between two points in time, upload a second ZIP from a later date. WhoUnfollowed diffs them and shows you exactly who dropped off.

## What You'll See

- People you follow who don't follow you back
- New followers since your last export
- Mutual followers
- Unfollowers (when comparing two exports)

## Why This Approach Is Different

Every other tracker in this space needs your credentials to function. That's not an oversight in their product design. Credential access is often how they build their data business. WhoUnfollowed was built specifically to not need it. The ZIP your Instagram account generates is already yours. We just read it.

If a tool asks for your Instagram password, close the tab.`,
  },
  {
    slug: 'instagram-follow-ratio-what-it-means-how-to-improve-it',
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

Triaging these accounts (deciding which non-followers to unfollow) is the fastest way to move your ratio without waiting for organic growth.

WhoUnfollowed's triage list shows you every account you follow that doesn't follow you back, sorted by how long you've followed them. You can work through them account by account and make deliberate decisions rather than guessing from memory.

## How to Check Your Current Ratio

You can calculate it manually from your profile page. Or upload your Instagram data export to WhoUnfollowed and the Radar dashboard surfaces your ratio alongside your full follower breakdown: non-followers, mutual follows, recent unfollowers, in one view.

## One Caveat Worth Naming

Chasing a high ratio by mass-unfollowing is a different problem. Instagram's systems flag accounts that unfollow large numbers of people rapidly, the same way they flag accounts that follow too aggressively. The goal isn't the number itself. It's a following list that actually reflects who you're interested in. The ratio is a signal, not a score to game.

Clean your list thoughtfully. The ratio will follow.`,
  },
  {
    slug: 'why-instagram-follower-trackers-ask-for-your-password',
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

When Instagram's systems detect this behavior (and they do, at scale), the account flagged is yours. The app continues running. Bans and restrictions from third-party follower trackers are common enough that Instagram's own Help Center addresses them directly.

## Why They Ask Anyway

If credential-based access violates TOS and risks user accounts, why does every mainstream follower tracker still require it?

Because credentials are worth something.

An app with access to millions of Instagram login pairs has built something valuable: a dataset of authenticated accounts. Some of these apps have been caught reselling data, using accounts for bot networks, or monetizing the follower graph data itself. Even apps with no malicious intent create a liability. When their servers get breached, your Instagram password is in that dump. If you reuse that password anywhere else, the exposure multiplies.

## There Is a Safe Alternative

![A sign-in screen offering Continue with Google and Sign in with Apple](/blog/trackers-password-inline.jpg)

Instagram is legally required under GDPR to give you a copy of your own data, including your complete followers and following lists, in a portable format. You request it directly from Instagram's settings. They email you a download link. You get a ZIP file with your data.

No app needs your password to read a file you already have.

WhoUnfollowed reads that ZIP file in your browser. The file never leaves your device. The core parsing code is MPL-2.0 licensed and public. You can verify the behavior yourself before uploading anything.

## The Practical Test

Before using any Instagram tool, ask one question: does it need my password to function?

If yes, it is accessing Instagram's systems by impersonating you. Your account assumes all the risk. The app assumes none.

If no, if it works with a data export you control, then the incentive structure is different. The tool only stays useful if you keep using it voluntarily. That's a better alignment than one where your credentials are the product.`,
  },
  {
    slug: 'who-doesnt-follow-you-back-on-instagram',
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

The accounts you are looking for have a name: non-followers. These are people you follow who don't follow you in return. They are not the same as unfollowers, who are accounts that used to follow you and stopped (finding those takes two exports compared over time). Non-followers you can find right now, from a single file, in about two minutes.

Here is how, without an app and without ever typing your Instagram password.

## Skip the apps that want your login

Search "who doesn't follow me back" and the app stores fill with trackers that ask you to log in with your Instagram username and password. Don't. Those apps work by logging in as you and pulling data through Instagram's private API, which breaks Instagram's Terms of Use and is a common reason accounts get restricted or banned. The account taking the risk is yours. The app takes none.

You do not need any of that to read a list of your own follows.

## Use the data Instagram already owes you

![A phone on a marble desk beside a laptop, showing an Instagram profile feed](/blog/no-follow-back-inline.jpg)

Under GDPR Article 20, Instagram has to give you a copy of your own data, including your full followers and following lists. You request it from inside the app, Instagram emails you a download link, and you get a ZIP file. That file is everything you need.

### Step 1: Request your export

Open Instagram. Go to Settings, then "Your activity," then "Download your information." Choose "Followers and following," set the format to JSON (not HTML), and submit. Instagram usually emails the link within a few hours.

### Step 2: Download the ZIP

Open the email, download the file, and keep it somewhere you can find it. The lists you need live inside the \`connections/followers_and_following/\` folder, but you don't have to open anything yourself.

### Step 3: Drop it into WhoUnfollowed

Go to [whounfollowed.co](/) and drop the ZIP onto the page. It reads the file inside your browser tab and shows you, on one screen, every account you follow that doesn't follow you back. Nothing is uploaded. You can turn off your wifi before you drop the file in and it still works, which is the simplest way to prove the data never leaves your device.

## What to do with the list

Seeing the names is the start. The goal is a cleaner, more mutual account.

- **Separate the ones that matter.** Brands and creators you follow for content are fine to keep. The accounts worth reviewing are the people you followed expecting a follow back.
- **Watch your ratio.** Following far more people than follow you reads as low-effort to both the algorithm and to anyone who lands on your profile. Trimming non-followers moves the number in the right direction.
- **Work in one pass.** WhoUnfollowed hands you the full list at once and opens profiles in new tabs, so you can triage in a single sitting instead of hunting one by one.

## The honest version

This will not magically grow your audience. What it does is remove the guesswork. Instead of wondering who is and isn't following you, you get the exact list in a couple of minutes, for free, without handing your password to anyone.

If a tool asks for your Instagram login to do this, close the tab. The file Instagram gives you is already yours. A good tool just reads it.`,
  },
  {
    slug: 'instagram-ghost-followers-how-to-find-and-remove-them',
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

Instagram does not rank you by follower count. It ranks individual posts by how the people who see them react, mostly in the first hour. That is your engagement rate: interactions divided by reach.

![A dark analytics dashboard showing engagement metrics like click-through rate and quality score](/blog/ghost-followers-inline1.jpg)

Ghost followers sit in the denominator and never touch the numerator. Every dead account that follows you makes your engagement rate look worse to the algorithm, which then shows your post to fewer people, which lowers engagement further. A bloated follower count with a thin engagement rate also reads as bought to brands, which is the opposite of what you want if you ever pitch a partnership.

## The honest part: you can't get a perfect list

Instagram does not hand anyone a verified "these are bots" list, and any app that claims a 100% accurate ghost-follower scan is guessing or lying. What you can do is approximate, using signals that genuinely correlate with dead accounts.

The strongest signal you fully control is in your own data export: accounts that followed you a long time ago with no reciprocal relationship. Old, one-directional, and silent is the classic ghost profile.

## How to find them from your own data

You don't need to log in anywhere or pay for a scanner. Instagram is required under GDPR to give you your own follower data.

## Step 1: Export your data

In Instagram, go to Settings, then "Your activity," then "Download your information." Choose "Followers and following," pick JSON, and submit. The download link arrives by email, usually within a few hours.

## Step 2: Read it locally

Drop the ZIP into [WhoUnfollowed](/). It reads the file in your browser and maps your followers against your following, including how long each relationship has existed. Nothing is uploaded.

![A laptop on a desk showing an analytics dashboard with user-activity charts](/blog/ghost-followers-inline2.jpg)

## Step 3: Review the approximations, don't bulk-blast

WhoUnfollowed flags long-tenure, non-reciprocal followers as likely-inactive candidates. Treat that as a shortlist to review, not a kill list to run automatically. Open a few profiles. An account with no posts, no profile photo, and a username full of random digits is a safe remove. A quiet friend who just never likes anything is not.

## Removing them without getting flagged

Two safe ways to clear a ghost follower:

- **Remove the follower.** Open their profile, tap the menu, and choose "Remove follower." They drop off your count without being notified or blocked.
- **Block then unblock.** This force-removes stubborn bot accounts. Use it sparingly.

Whatever you do, go slowly. Instagram's systems flag accounts that remove or block in rapid bursts, the same way they flag aggressive following. A handful of removals across a session is fine. Hundreds in ten minutes is a way to get yourself restricted.

## The realistic outcome

Clearing ghosts will probably shrink your follower number. That feels bad for a day. What you get in exchange is an engagement rate that reflects real people, which is the number the algorithm and any serious brand actually care about. A smaller, real audience beats a big, hollow one every time.`,
  },
  {
    slug: 'does-instagram-notify-when-you-unfollow-someone',
    cluster: 'unfollowers',
    title: 'Does Instagram Notify Someone When You Unfollow Them?',
    metaTitle: 'Does Instagram Notify When You Unfollow Someone?',
    metaDescription: 'Wondering if Instagram tells people when you unfollow, block, or remove them? Here is exactly what is and is not notified, and how to find out who unfollowed you.',
    excerpt: 'Short answer: no, Instagram does not send an unfollow notification. Here is the full breakdown of what Instagram does and does not tell people about your actions.',
    date: 'June 25, 2026',
    readTime: '4 min',
    tag: 'Guide',
    primaryKeyword: 'does Instagram notify when you unfollow someone',
    art: 'bell',
    // Unsplash: mw6Onwg4frY (two hands typing on a phone)
    image: '/blog/notify-unfollow-hero.jpg',
    imageAlt: 'Two hands typing a message on a phone keyboard',
    body: `The short answer is no. Instagram does not send a notification when you unfollow someone. The person won't get an alert, a banner, or a message. The only way they can tell is by noticing your follower relationship changed, either by remembering you followed them or by checking a list.

That said, "unfollow" is one of several actions people mix up, and Instagram treats each of them differently. Here is the complete picture.

![A phone lock screen showing push notifications from messaging and social apps](/blog/notify-unfollow-inline1.jpg)

## What Instagram does NOT notify

- **Unfollowing.** No notification. The account silently leaves their followers list.
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

They would have to track it deliberately. Without help, a person can only notice you unfollowed by remembering the prior state, which is unreliable past a handful of accounts. This is exactly the gap that follower tracking exists to fill, and it works both ways: if you want to know who unfollowed you, you face the same problem.

## How to actually find out who unfollowed you

You can't get a notification for it, so you reconstruct it by comparing two snapshots of your data over time.

![A hand holding a smartphone](/blog/notify-unfollow-inline2.jpg)

Instagram gives you your follower list on demand under GDPR. Export it now, export it again in a few weeks, and the difference between the two is your list of unfollowers.

[WhoUnfollowed](/) does that comparison for you. You upload the data export Instagram emails you, it reads the file in your browser, and when you add a second export later it shows exactly who dropped off between the two dates. No password, no notification to anyone, nothing sent to a server.

## The takeaway

Unfollowing, removing, blocking, and muting are all silent. Instagram keeps your social moves private, which is good for you and inconvenient when you are on the receiving end. The only reliable way to see who unfollowed you is to keep your own record and compare it over time.`,
  },
  {
    slug: 'can-you-get-banned-for-using-a-follower-tracker-on-instagram',
    cluster: 'privacy-safety',
    title: 'Can You Get Banned for Using a Follower Tracker on Instagram?',
    metaTitle: 'Can You Get Banned for Using an Instagram Follower Tracker?',
    metaDescription: 'Yes, follower trackers that ask for your Instagram login can get your account flagged or banned. Here is why, and the no-password method that carries zero ban risk.',
    excerpt: 'Short answer: the ones that ask for your Instagram login can get your account flagged, checkpointed, or banned. The ones that read your own data export cannot. Here is the difference.',
    date: 'July 3, 2026',
    readTime: '5 min',
    tag: 'Privacy',
    primaryKeyword: 'can you get banned for using a follower tracker on instagram',
    art: 'lock',
    imageAlt: 'A padlock over an Instagram-style grid, representing account ban risk from follower tracker apps',
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

Nothing logs into your account. Nothing hits Instagram's servers. There is no automated access for Instagram to detect, because there is no access at all. This is exactly how [WhoUnfollowed](/) works, and it is why it carries zero ban risk.

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
    cluster: 'privacy-safety',
    title: 'Are Instagram Follower Trackers Safe?',
    metaTitle: 'Are Instagram Follower Trackers Safe? What to Check First',
    metaDescription: 'Most Instagram follower trackers are not safe: they store your password and send data to their servers. Here is how to check one before you use it, and the safe alternative.',
    excerpt: 'Most are not. The ones that ask for your Instagram login put your account and your data at risk. Here is the checklist to judge any tracker, and the one model that is safe by design.',
    date: 'July 3, 2026',
    readTime: '5 min',
    tag: 'Privacy',
    primaryKeyword: 'are instagram follower trackers safe',
    art: 'lock',
    imageAlt: 'A shield over a phone showing follower stats, representing the safety of Instagram follower tracker apps',
    body: `Most Instagram follower trackers are not safe. The majority ask for your Instagram username and password, store your credentials on their servers, and send your data off your device. That combination puts both your account and your privacy at risk. A small number are safe by design, because they never ask for your login at all. Here is how to tell them apart.

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

[WhoUnfollowed](/) is built this way on purpose. You upload the export Instagram sent you, your browser reads it locally, and the result appears in about two seconds. No password, no server upload, no account. The parsing code is open source, so anyone can verify exactly what it does with your data. If you want to see who left, start with [how to see who unfollowed you on Instagram](/blog/how-to-see-who-unfollowed-you-on-instagram).

## So are they safe or not?

As a category, no. As a specific choice, it depends entirely on one thing: whether the tool touches your account. If it reads a data export you already own, it is safe. If it asks for your password, it is not. Pick accordingly.`,
  },
  {
    slug: 'how-long-does-an-instagram-data-request-take',
    cluster: 'data-export',
    title: 'How Long Does an Instagram Data Request Take?',
    metaTitle: 'How Long Does an Instagram Data Request Take?',
    metaDescription: 'A Followers and Following export from Instagram usually arrives in a few minutes. A full archive can take up to 48 hours. Here is what affects the wait and how to speed it up.',
    excerpt: 'A focused Followers and Following export usually lands in a few minutes. A full archive can take up to 48 hours. Here is exactly what determines the wait.',
    date: 'July 3, 2026',
    readTime: '4 min',
    tag: 'Guide',
    primaryKeyword: 'how long does an instagram data request take',
    art: 'search',
    imageAlt: 'A clock beside a download icon, representing the wait time for an Instagram data export',
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
    cluster: 'data-export',
    title: 'Instagram Data Export: JSON vs HTML (Which to Pick and Why)',
    metaTitle: 'Instagram Data Export: JSON vs HTML (Which to Choose)',
    metaDescription: 'Choose JSON for your Instagram data export. It includes the follow timestamps that HTML leaves out, and tools can read it. Here is the difference in plain terms.',
    excerpt: 'Pick JSON. It includes the follow timestamps HTML leaves out, and it is the format analysis tools actually read. HTML is only for eyeballing in a browser. Here is why it matters.',
    date: 'July 3, 2026',
    readTime: '4 min',
    tag: 'Guide',
    primaryKeyword: 'instagram data export json vs html',
    art: 'split',
    imageAlt: 'Two file icons labeled JSON and HTML side by side, representing the Instagram data export format choice',
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
    cluster: 'unfollowers',
    title: 'Can You See Who Unfollowed You on Instagram?',
    metaTitle: 'Can You See Who Unfollowed You on Instagram?',
    metaDescription: 'Instagram does not show you who unfollowed you, and it sends no notification. But you can reconstruct it from your own data export. Here is how, with no password required.',
    excerpt: 'Not directly. Instagram never tells you who unfollowed you and sends no notification. But you can reconstruct it from your own data export by comparing two snapshots. Here is how.',
    date: 'July 3, 2026',
    readTime: '4 min',
    tag: 'Guide',
    primaryKeyword: 'can you see who unfollowed you on instagram',
    art: 'search',
    imageAlt: 'A magnifying glass over a follower list with one entry missing, representing finding who unfollowed you',
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
    cluster: 'account-health',
    title: 'What Is a Good Follower-to-Following Ratio on Instagram?',
    metaTitle: 'What Is a Good Follower-to-Following Ratio on Instagram?',
    metaDescription: 'A follower-to-following ratio above 1.0 looks healthy on Instagram, and above 2.0 signals real influence. Here is what the number means, and why chasing it is a trap.',
    excerpt: 'Above 1.0 reads as healthy, and above 2.0 signals genuine pull. But the ratio is a vanity metric with real limits. Here is what a good number looks like, and when to ignore it.',
    date: 'July 3, 2026',
    readTime: '5 min',
    tag: 'Growth',
    primaryKeyword: 'good follower to following ratio on instagram',
    art: 'ratio',
    imageAlt: 'A balance scale weighing follower count against following count, representing the Instagram follow ratio',
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
    cluster: 'data-export',
    title: "What's Actually Inside Your Instagram Data Download",
    metaTitle: "What's Inside Your Instagram Data Download (The ZIP Explained)",
    metaDescription: 'Your Instagram data download is a ZIP with a few small JSON files: followers, following, pending requests, and recently unfollowed. Here is exactly what each one contains.',
    excerpt: "The ZIP Instagram sends you is smaller and simpler than it sounds. Here is exactly what is inside it, file by file, and why the timestamps matter more than anything else in there.",
    date: 'July 15, 2026',
    readTime: '4 min',
    tag: 'Guide',
    primaryKeyword: "what's inside instagram data download",
    art: 'split',
    imageAlt: 'An open folder icon showing several small JSON files, representing the contents of an Instagram data export ZIP',
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
    cluster: 'account-health',
    title: 'How to Clean Up Who You Follow on Instagram (The Safe Way)',
    metaTitle: 'How to Clean Up Who You Follow on Instagram Safely',
    metaDescription: 'Cleaning up who you follow on Instagram safely means pacing your unfollows and deciding deliberately, not mass-unfollowing everyone who does not follow back. Here is a safe method.',
    excerpt: "A clean following list beats a big one. Here is how to trim it deliberately, without tripping Instagram's spam limits or losing accounts you actually wanted to keep.",
    date: 'July 15, 2026',
    readTime: '5 min',
    tag: 'Growth',
    primaryKeyword: 'clean up who you follow on instagram',
    art: 'ratio',
    imageAlt: 'A checklist with some items checked and some crossed out, representing sorting an Instagram following list',
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
    cluster: 'privacy-safety',
    title: 'Instagram Follower Tracker Without Login: Do They Exist?',
    metaTitle: 'Instagram Follower Tracker Without Login: Do They Exist?',
    metaDescription: 'Yes, a genuine no-login Instagram follower tracker exists: one that reads the data export Instagram already gives you instead of asking for your password. Here is how to tell the real ones apart.',
    excerpt: "Yes, but you have to know what to actually look for. Plenty of trackers claim to need 'no login' while still asking for your Instagram password somewhere in the flow. Here is the real distinction.",
    date: 'July 15, 2026',
    readTime: '4 min',
    tag: 'Privacy',
    primaryKeyword: 'instagram follower tracker without login',
    art: 'lock',
    imageAlt: 'A padlock with a line through it next to an Instagram icon, representing a follower tracker that needs no login',
    body: `Yes, genuine no-login Instagram follower trackers exist, but the phrase gets abused. Plenty of apps advertise "no login required" while still asking you to authenticate with Instagram somewhere in the actual flow, just worded to sound safer than it is. Here is how to tell a real one from a relabeled one.

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

