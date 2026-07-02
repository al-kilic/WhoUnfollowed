import type { ArtVariant } from './BlogArt';

export interface BlogPost {
  slug: string;
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
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}
