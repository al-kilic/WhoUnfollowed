// App Store snapshot for the study at /research/instagram-unfollower-apps.
// Collected 2026-11-27 from Apple's public iTunes Search and Lookup APIs (US
// store): 10 search terms, Instagram follower/unfollower trackers only, ranked
// by number of ratings. Instagram itself and apps that sell followers, likes or
// reposts are left out. `access` comes only from each app's own App Store
// description, checked by hand:
//   stated   = the listing says you sign in to Instagram (or Facebook) in the app
//   features = it lists features that only work inside your account (viewers of
//              your own stories, following or unfollowing for you, your
//              Facebook friend list)
//   unstated = the listing doesn't say how it gets your data
// No app in the top 30 says it reads Instagram's official data export.
// Re-run when refreshing: numbers change daily.

export type Access = 'stated' | 'features' | 'unstated';

export interface StudyApp {
  rank: number;
  id: number;
  name: string;
  developer: string;
  ratings: number;
  stars: number;
  updated: string;
  access: Access;
  evidence: string | null;
  price: string | null;
  weekly: boolean;
  claimsProfileViewers: boolean;
}

export interface ExportApp { id: number; name: string; developer: string; ratings: number; updated: string }

export const STUDY_DATE = '2026-11-27';

export const TOP_APPS: StudyApp[] = [
  { rank: 1, id: 1481469888, name: "Reports+ Unfollowers Follower", developer: "Deep Vision Labs Yazilim Limited Sirketi", ratings: 500158, stars: 4.6, updated: "2026-06-27", access: 'features', evidence: "Lists \"story viewers\" among its metrics", price: null, weekly: false, claimsProfileViewers: false },
  { rank: 2, id: 1499924074, name: "Reports Unfollowers Followers+", developer: "BYTECORE MOBILITY LIMITED", ratings: 132110, stars: 4.4, updated: "2026-09-30", access: 'unstated', evidence: null, price: "$5.99/mo, $17.99/6 mo, $23.99/yr", weekly: false, claimsProfileViewers: false },
  { rank: 3, id: 1447926816, name: "Followers Track & Likes Insigt", developer: "建平 姜", ratings: 54722, stars: 4.3, updated: "2026-11-23", access: 'unstated', evidence: null, price: "$4.99/mo", weekly: false, claimsProfileViewers: false },
  { rank: 4, id: 1541777461, name: "xView: Reports Unfollowers IG", developer: "RZG Labs Dijital Limited Sirketi", ratings: 46847, stars: 4.5, updated: "2026-07-24", access: 'features', evidence: "Tracks your Facebook friend list and notifies you of changes", price: null, weekly: false, claimsProfileViewers: false },
  { rank: 5, id: 550744101, name: "nFollowers: Unfollowers Report", developer: "Street Coder LLC", ratings: 41801, stars: 4.2, updated: "2024-09-23", access: 'features', evidence: "\"Follow and unfollow users\" from inside the app", price: null, weekly: false, claimsProfileViewers: false },
  { rank: 6, id: 1485509764, name: "Reports+ for Followers Tracker", developer: "FAMEDMOBILE MARKET LIMITED", ratings: 35347, stars: 4.5, updated: "2026-09-28", access: 'unstated', evidence: null, price: "$4.99/mo, $17.99/6 mo, $23.99/yr", weekly: false, claimsProfileViewers: false },
  { rank: 7, id: 1462556749, name: "Followers - Tracker Insight", developer: "Nemdori Tech Limited", ratings: 29450, stars: 4.4, updated: "2026-11-07", access: 'unstated', evidence: null, price: "$5.99/mo, $17.99/6 mo, $23.99/yr", weekly: false, claimsProfileViewers: false },
  { rank: 8, id: 651309421, name: "FollowMeter for Instagram", developer: "Followmeter LLC", ratings: 24074, stars: 4.1, updated: "2026-07-30", access: 'features', evidence: "\"See who viewed your stories the most\"", price: null, weekly: false, claimsProfileViewers: false },
  { rank: 9, id: 1210465913, name: "Analytics Reports+", developer: "Cod3.io GmbH", ratings: 19080, stars: 3.8, updated: "2022-08-30", access: 'unstated', evidence: null, price: null, weekly: false, claimsProfileViewers: false },
  { rank: 10, id: 1571096208, name: "Followers Tracker - Reports", developer: "Anthony Delaney", ratings: 18090, stars: 4.1, updated: "2026-11-12", access: 'features', evidence: "\"Story viewer analytics\"", price: null, weekly: false, claimsProfileViewers: true },
  { rank: 11, id: 1478728220, name: "Ig Followers Reports", developer: "MEOWPIE TECH CO., LIMITED", ratings: 16541, stars: 4.2, updated: "2026-05-25", access: 'unstated', evidence: null, price: "$4.99/week, $6.99/mo, $32.99/yr", weekly: true, claimsProfileViewers: false },
  { rank: 12, id: 1218145349, name: "Unfollow for Instagram +", developer: "Vinh Dang", ratings: 15628, stars: 3.4, updated: "2026-07-19", access: 'features', evidence: "Bulk unfollow, block and delete posts", price: null, weekly: false, claimsProfileViewers: false },
  { rank: 13, id: 1488391020, name: "Influxy", developer: "Null Pointer Exception S.L.", ratings: 13599, stars: 4.6, updated: "2026-08-12", access: 'unstated', evidence: null, price: null, weekly: false, claimsProfileViewers: true },
  { rank: 14, id: 1403007996, name: "Followers Pro", developer: "Dashed Space LLC", ratings: 6684, stars: 4.5, updated: "2026-11-14", access: 'unstated', evidence: null, price: "$0.99/mo", weekly: false, claimsProfileViewers: false },
  { rank: 15, id: 6633429068, name: "Unfollowers: Followers Tracker", developer: "Roi Network Co., Ltd.", ratings: 6634, stars: 4.6, updated: "2026-11-06", access: 'unstated', evidence: null, price: "$6.99/mo", weekly: false, claimsProfileViewers: false },
  { rank: 16, id: 1463947171, name: "Followers+ Track for IG", developer: "MAPLE LABS COMPANY LIMITED", ratings: 5259, stars: 3.6, updated: "2025-02-24", access: 'features', evidence: "\"Mass unfollow\"", price: "weekly subscription", weekly: true, claimsProfileViewers: false },
  { rank: 17, id: 1050497051, name: "Followers Tracker App", developer: "Shakd, LLC", ratings: 3708, stars: 4.5, updated: "2026-04-21", access: 'unstated', evidence: null, price: null, weekly: false, claimsProfileViewers: false },
  { rank: 18, id: 1521204420, name: "Followers Insights tracker", developer: "Anshun Lingyun Technology Development Co., Ltd.", ratings: 3095, stars: 4.1, updated: "2023-09-11", access: 'unstated', evidence: null, price: "$6.99/mo, $23.99/6 mo, $35.99/yr", weekly: false, claimsProfileViewers: false },
  { rank: 19, id: 1457455471, name: "Social Ghost : Analyze Profile", developer: "BRINGO BILGI TEKNOLOJILERI SANAYI VE TICARET LIMITED SIRKETI", ratings: 2457, stars: 4.1, updated: "2026-04-15", access: 'unstated', evidence: null, price: "from $5.99/mo", weekly: false, claimsProfileViewers: false },
  { rank: 20, id: 6754846233, name: "The Followers Unfollow Tracker", developer: "SEEDWORKS L.L.C-FZ", ratings: 1692, stars: 4.5, updated: "2026-10-06", access: 'stated', evidence: "\"You sign in on Instagram's own login page inside the app\"", price: "weekly or yearly, or lifetime", weekly: true, claimsProfileViewers: false },
  { rank: 21, id: 1260888776, name: "Instant Profile+ - Analytics", developer: "Three Commas, LLC", ratings: 1438, stars: 4.2, updated: "2022-03-15", access: 'unstated', evidence: null, price: "$2.99/week, $9.99/mo, $99.99/yr", weekly: true, claimsProfileViewers: false },
  { rank: 22, id: 6444160211, name: "Reports Unfollowers +Followers", developer: "Moonstack LLC", ratings: 1413, stars: 4.5, updated: "2026-11-20", access: 'features', evidence: "\"Track story views from non followers\"", price: "$3.99/week, $9.99/mo, $23.99/yr", weekly: true, claimsProfileViewers: false },
  { rank: 23, id: 1589921650, name: "Followers Tracker Lite", developer: "Nemdori Tech Limited", ratings: 1341, stars: 4.9, updated: "2022-11-21", access: 'features', evidence: "\"Unfollow users from mutual follow\"", price: null, weekly: false, claimsProfileViewers: false },
  { rank: 24, id: 1635322544, name: "Followers & Unfollowers Report", developer: "Ivan Petrashka", ratings: 1234, stars: 4.3, updated: "2025-12-17", access: 'unstated', evidence: null, price: "weekly subscription", weekly: true, claimsProfileViewers: false },
  { rank: 25, id: 1611415744, name: "Reports+ Followers Unfollowers", developer: "Reports+ LLC", ratings: 1212, stars: 4.4, updated: "2026-11-18", access: 'unstated', evidence: null, price: null, weekly: false, claimsProfileViewers: false },
  { rank: 26, id: 558512661, name: "InsTrack for Instagram", developer: "INNOVATTY, LLC", ratings: 825, stars: 4.2, updated: "2025-10-13", access: 'stated', evidence: "\"Login with Facebook\"", price: "$4.99/mo, $29.99/yr", weekly: false, claimsProfileViewers: false },
  { rank: 27, id: 1579639812, name: "Reports: Followers Unfollowers", developer: "DEEPSEA FREE LIMITED", ratings: 772, stars: 4.1, updated: "2025-09-06", access: 'features', evidence: "\"Check your story viewer\"", price: "$2.99/week, $5.99/mo, $23.99/yr", weekly: true, claimsProfileViewers: false },
  { rank: 28, id: 1642672695, name: "Followers: Unfollowers Tracker", developer: "Viacheslav Khakhulin", ratings: 577, stars: 4.6, updated: "2026-11-18", access: 'unstated', evidence: null, price: null, weekly: false, claimsProfileViewers: false },
  { rank: 29, id: 1508179560, name: "Profile Reports Tracker", developer: "CodeBoot LLC", ratings: 519, stars: 4.2, updated: "2026-10-22", access: 'unstated', evidence: null, price: "$12.99/mo, $49.99/yr", weekly: false, claimsProfileViewers: false },
  { rank: 30, id: 6462722695, name: "inReports - Followers analysis", developer: "NETBU MEDYA REKLAM VE DEKORASYON HIZMETLERI SAN TIC LTD STI", ratings: 487, stars: 4.0, updated: "2026-11-15", access: 'unstated', evidence: null, price: null, weekly: false, claimsProfileViewers: false },
];

// Apps whose listing says they read your official Instagram data export (no
// login), found in the same searches plus a lookup of names seen on the web.
export const EXPORT_APPS: ExportApp[] = [
  { id: 6743817702, name: "Unfollow Tracker: Nonfollowers", developer: "Njteh Keledjian", ratings: 229, updated: "2026-11-20" },
  { id: 6743733024, name: "Unfollow Tracker - FANS", developer: "Walter Labs, Inc.", ratings: 184, updated: "2026-11-11" },
  { id: 6743745790, name: "FollowBuddy - Unfollow Tracker", developer: "Ben Leavitt International Inc. (CA)", ratings: 122, updated: "2026-11-10" },
  { id: 6758436130, name: "InRadar - Unfollowers Tracker", developer: "Codelog Yazilim Hizmetleri Limited Sirketi", ratings: 67, updated: "2026-10-02" },
  { id: 6747692762, name: "UnfollowPeek", developer: "AurumSpire LLC", ratings: 45, updated: "2026-11-26" },
  { id: 6761330680, name: "Instafollow - Unfollow Tracker", developer: "Jovan Milenkovic", ratings: 23, updated: "2026-09-09" },
  { id: 6744781679, name: "Unfollowify: Track Unfollowers", developer: "Michael Rubino", ratings: 10, updated: "2026-11-26" },
  { id: 6739170412, name: "Unfollowers: No Login Tracker", developer: "Behlulcan Sahin", ratings: 6, updated: "2026-10-27" },
  { id: 6761693913, name: "InFollow: Unfollowers Tracker", developer: "Ercan Bicer", ratings: 2, updated: "2026-05-14" },
  { id: 6760897105, name: "WhoLeftMe: Unfollower Tracker", developer: "Jonghwan Choi", ratings: 0, updated: "2026-04-24" },
];
