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
  body: string;
}

export const BLOG_POSTS: BlogPost[] = [
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
    body: `Most follower trackers work fine, right until your account gets flagged, restricted, or permanently disabled.

The reason is straightforward. These tools ask for your Instagram password so they can log in as you, call Instagram's private API, and pull your follower data. Instagram explicitly bans this in its Terms of Use. When their systems detect unusual API activity (and they do), the account that gets punished is yours, not the app's.

There is a safer way. Instagram is legally required to give you a copy of your own data under GDPR Article 20. That includes your full followers and following lists. You request the file directly from Instagram's settings, download it, and hand it to a tool that reads it locally in your browser. No password. No API. No risk.

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
    body: `Your follow ratio is simple arithmetic: divide your follower count by the number of accounts you follow.

An account with 4,000 followers that follows 400 people has a ratio of 10:1. An account with 4,000 followers following 3,800 people has a ratio just above 1:1. Both have the same follower count. The algorithm does not treat them the same.

## Why the Ratio Matters

Instagram's recommendation systems use engagement rate as a core signal, but your follow-to-following ratio provides context. A high ratio tells the system (and anyone looking at your profile) that people seek you out. A low ratio suggests you've been following accounts hoping they'll follow back, which is a common growth-hack behavior that Instagram's systems are trained to recognize and discount.

For creators with 1,000 to 50,000 followers, a ratio somewhere between 3:1 and 10:1 is generally healthy. Below 1:1 and you're following more people than follow you, which is where the credibility problem starts.

## The One Lever You Can Actually Pull

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
    body: `Instagram makes this deliberately hard. There is no button that shows you the people you follow who don't follow you back. You can open your following list and check profiles one at a time, but on an account with a few hundred follows that is an evening you will not get back.

The accounts you are looking for have a name: non-followers. These are people you follow who don't follow you in return. They are not the same as unfollowers, who are accounts that used to follow you and stopped (finding those takes two exports compared over time). Non-followers you can find right now, from a single file, in about two minutes.

Here is how, without an app and without ever typing your Instagram password.

## Skip the apps that want your login

Search "who doesn't follow me back" and the app stores fill with trackers that ask you to log in with your Instagram username and password. Don't. Those apps work by logging in as you and pulling data through Instagram's private API, which breaks Instagram's Terms of Use and is a common reason accounts get restricted or banned. The account taking the risk is yours. The app takes none.

You do not need any of that to read a list of your own follows.

## Use the data Instagram already owes you

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
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}
