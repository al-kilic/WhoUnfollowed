import type { SampleCoach } from './types';

// Inês, a film photographer in Lisbon. Posts on Tuesday, Thursday and
// Saturday at 18:30. Three exports: Feb 22 (1,066 followers), Jun 18 (1,158),
// Nov 20 (1,240). No em dashes.
export const en: SampleCoach = {
  read: {
    headline: 'Your how-to carousels bring followers. Your prettiest photos mostly don\'t.',
    happening: [
      'Since your June export, 113 people followed you and 31 left, so you are up 82. Almost half of the new ones (52) came in the three days after your Oct 22 carousel about why film looks cold.',
      'October was your best month in nine years: 72 new followers. July and August brought fewer than ten, and you posted once in those two months.',
      '32% of your followers found you on a Thursday, the day your carousels go out. None of the 31 who left joined after your autumn posts: the new people are staying.',
    ],
    stop: { what: 'Posting a single beautiful frame with no story', why: 'Your Tram 28 photo on Nov 5 got your best likes of the autumn and 6 new followers. The two teaching carousels around it got 31 and 52. People like your photos, but they follow you for what you explain.' },
    try: [
      { what: 'Turn one roll into a "what went wrong and the fix" carousel every other Thursday', why: 'That shape brought 52 followers on Oct 22, your best post since 2017. Repeat the shape, not the topic.' },
      { what: 'Cancel the 23 follow requests that are still waiting', why: 'You sent them, the oldest in April 2021. They will not accept now, and they make your follow list look bigger than it is.' },
      { what: 'Sort the 41 accounts you followed in one week of March 2022', why: '41 of the 87 people who don\'t follow you back are from that single week. It is one quick pass, not 87 decisions.' },
    ],
    memoryNotes: [],
  },
  chats: [
    {
      title: 'Why did people leave after summer?',
      turns: [
        {
          q: 'Why did people leave after summer?',
          a: {
            answer: 'Fewer left than it feels like. Between your June and November exports 31 people stopped following you, against 37 in the four months before. What changed is who left:\n- All 31 had followed you before June. Nobody who arrived with your autumn carousels has left.\n- You posted once in July and August. People who found you through old posts had nothing new to stay for.\n- None of the 31 were people you follow back, so you lost no mutuals.\nThe gap was quiet months, not bad posts. Your plan keeps two posts a week through the holidays so it doesn\'t repeat.',
            followUps: ['Who left, and should I unfollow them back?', 'How do I keep posting in a busy month?'],
            memoryNotes: [],
          },
        },
      ],
    },
    {
      title: 'Should I post more Reels?',
      turns: [
        {
          q: 'Everyone says Reels. Should I post more of them?',
          a: {
            answer: 'Not more Reels for their own sake. Look at what you logged:\n- Oct 1 Reel, loading a Leica M6 in 20 seconds: 19 new followers.\n- Oct 22 carousel, why your film looked cold: 52 new followers and 410 saves.\n- Nov 5 single photo, Tram 28 at blue hour: 6 new followers.\nYour Reel did well because it taught something in 20 seconds, the same reason the carousel did. So keep one short Reel a week, and make it a teaching moment from the carousel you post that Thursday: the same idea, two formats, one round of work.',
            followUps: ['Write the Reel for this Thursday', 'What should the next carousel teach?'],
            memoryNotes: [],
          },
        },
      ],
    },
    {
      title: 'Am I on track for 2,000?',
      turns: [
        {
          q: 'Am I going to reach 2,000 by the end of March?',
          a: {
            answer: 'At your current pace, no, and it\'s better to know now.\n- You need 760 more followers in about 19 weeks: 40 a week.\n- Since June you have averaged about 4 a week. In October, your best month, you averaged about 17 a week.\nTwo honest options:\n- Keep March and post two teaching carousels a week. Even at your October pace you would land near 1,550.\n- Move the date to September 2027 and keep three posts a week. That needs about 17 a week: your October pace.\nI would move the date. I can rewrite the goal check-ins for September if you want.',
            followUps: ['Move my goal to September', 'Plan two carousels a week'],
            memoryNotes: [],
          },
        },
      ],
    },
  ],
  sampleReply: {
    answer: 'This is the sample account, so this answer is an example. With your own export, the coach reads your followers, who came and went between exports, the posts you logged and what it remembers about you, then answers in your words.\nTry one of the example chats on the left to see how it uses that.',
    followUps: ['Why did people leave after summer?', 'Should I post more Reels?'],
    memoryNotes: [],
  },
  draft: {
    topic: 'Why my photos from Sintra came out green, and how I fixed the next roll',
    options: [
      {
        text: 'My Sintra roll came out green. Here is what went wrong, and the one change that fixed the next one.\n\nSlide 1: "My Sintra roll came out green." The worst frame, full size.\nSlide 2: The cause. Forest shade plus Portra 400 shot at box speed: not enough light, and the shadows go green.\nSlide 3: The tell. Green in the shadows, normal colour in the sky.\nSlide 4: The fix. Rate it at 200, meter for the shadows.\nSlide 5: The next roll, same path, same time of day.\nSlide 6: "Save this before your next forest walk."\n\nCaption:\nMy Sintra roll came out green, and it was not the lab. Shade under trees is darker than it looks, and Portra at 400 does not forgive it. Next roll I rated it at 200 and metered for the shadows. Slide 5 is the difference.\nWhat is the roll you still think about?\n\nHashtags: 3 to 5, specific, at the end: #portra400 #filmphotography #shootfilm #sintra\n\nAlt text, slide 1: A forest path in Sintra on film with a strong green cast in the shadows.',
        why: 'The same shape as your Oct 22 carousel (problem, cause, fix), which brought 52 followers. It ends with a question, which your past posts were missing.',
      },
      {
        text: 'Green shadows on film are not the lab\'s fault. Six slides on why it happens and the one setting I changed.\n\nCaption:\nSintra, two rolls, same path. The first came out green, the second didn\'t. The only change: I rated Portra at 200 instead of 400 and metered for the shade. If your forest shots look sick, try it on your next roll.\nWhich of the two would you have posted?',
        why: 'Leads with the lesson for people who scroll fast. Slightly less personal, so a good second choice.',
      },
      {
        text: 'I almost threw this roll away.\n\nCaption:\nGreen. Every frame from Sintra came back green. It took me a week to work out why, and one setting to fix it. Swipe for both rolls side by side.\nHave you ever kept a roll you hated?',
        why: 'Short and personal, in your usual voice. Best if you want a quieter post between two teaching carousels.',
      },
    ],
  },
  check: {
    format: 'carousel',
    hook: 'Some photos from Sintra last weekend',
    caption: 'Some photos from Sintra last weekend. Shot on Portra 400. The light in the forest was amazing. #film #35mm #photography #sintra #portugal #travel #analog #filmisnotdead #portra #shootfilm #ishootfilm #travelphotography',
    result: {
      overall: 58,
      scores: [
        { criterion: 'hook', score: 4, reason: 'Your past posts: openers that only describe ("Tram 28 at blue hour") brought 2 to 6 followers; your problem-first hook on Oct 22 brought 52.' },
        { criterion: 'clarity', score: 7, reason: 'One place, one roll, easy to follow. The point of the post is missing, so the slides read as a set, not a story.' },
        { criterion: 'value', score: 5, reason: 'Platform guidance: saves come from posts people want to use again. Nothing here helps the next person in a forest with film.' },
        { criterion: 'fit_you', score: 8, reason: 'Your past posts: Portugal on Portra is what your followers came for. The look is right, the angle is not.' },
        { criterion: 'fit_trend', score: 6, reason: 'Platform guidance: carousels that teach are doing well in photography this month (weekly brief, Nov 23).' },
        { criterion: 'action', score: 5, reason: 'No question and 12 broad hashtags. Nothing asks people to reply, save or come back on Thursday.' },
      ],
      fixes: [
        { what: 'Open with what went wrong: "My Sintra roll came out green."', why: 'A problem in the first line is your strongest hook: 52 followers on Oct 22.' },
        { what: 'Add one slide with the fix and end with a question', why: 'It turns a set of photos into something people save and answer.' },
        { what: 'Keep 4 specific hashtags, drop the other 8', why: 'Broad tags like #photography bury you among millions of posts. Specific ones reach people who shoot film.' },
      ],
      altHooks: ['My Sintra roll came out green. Here is the fix.', 'Same forest, two rolls, one setting changed.'],
      caption: 'My Sintra roll came out green, and it was not the lab. Shade under the trees is darker than it looks, so the next roll I rated Portra at 200 and metered for the shadows. Slide 5 is the difference.\nWhat is the roll you still think about?\n#portra400 #filmphotography #shootfilm #sintra',
      cover: ['The first slide is the green frame: good, it shows the problem. Make sure the text on it is at least 1/12 of the height so it reads on a phone.'],
      memoryNotes: [],
    },
  },
  ideas: {
    theme: '',
    ideas: [
      { format: 'carousel', idea: 'Three rolls that went wrong this year and the fix for each', hook: 'Three rolls I almost threw away.', why: 'Your Oct 22 "what went wrong" carousel brought 52 followers, your best post since 2017.' },
      { format: 'reel', idea: 'Rating Portra at 200 vs 400, the same street, cut side by side', hook: 'Same street. One setting.', why: 'Your 20-second Leica Reel brought 19 followers: short teaching Reels work for you.' },
      { format: 'carousel', idea: 'Alfama at 7 a.m., ten frames, with the settings on each slide', hook: 'Alfama before anyone wakes up.', why: 'Your Sep 10 Alfama carousel brought 31 followers. Adding settings turns it into something people save.' },
      { format: 'story', idea: 'A poll: which of two frames becomes Thursday\'s cover', hook: 'Left or right for Thursday?', why: '32% of your followers found you on a Thursday. A Tuesday poll warms them up for it.' },
      { format: 'photo', idea: 'One frame from your oldest roll, with what you would do differently now', hook: 'Nine years between these two frames.', why: 'Your oldest follower has been here since Feb 2017. Looking back gives people who stayed a reason to comment.' },
    ],
  },
  plan: {
    summary: 'Two weeks built around what brings you followers: a teaching carousel every Thursday, a short Reel that reuses it on Tuesday, and a quieter photo on Saturday. Reminders go out at 18:30 on each posting day.',
    principles: ['Thursday is for teaching carousels: problem, cause, fix', 'Tuesday reuses Thursday\'s idea as a 20-second Reel', 'Saturday is a single frame with a question, no pressure', 'End every post with one real question'],
    weeks: [1, 2, 3, 4].map((week) => ({
      week,
      theme: ['What went wrong', 'Behind the settings', 'Lisbon early', 'Your questions'][week - 1]!,
      posts: [
        { day: 'Tue', format: 'reel' as const, idea: ['Rating Portra at 200 vs 400, side by side', 'Metering for shade in 20 seconds', 'Alfama at 7 a.m. in 15 seconds', 'Answering the most asked question'][week - 1]!, hook: ['Same street. One setting.', 'Point here, not there.', 'Before anyone wakes up.', 'You asked, so here it is.'][week - 1]! },
        { day: 'Thu', format: 'carousel' as const, idea: ['My Sintra roll came out green, and the fix', 'Five settings I check before every roll', 'Alfama at 7 a.m., ten frames with settings', 'Three questions you asked, answered with my own rolls'][week - 1]!, hook: ['My Sintra roll came out green.', 'The five numbers I check first.', 'Alfama before anyone wakes up.', 'Your three questions, my three rolls.'][week - 1]! },
        { day: 'Sat', format: 'photo' as const, idea: ['One frame from the green roll that I still like', 'A frame I got right on the first try', 'Tram 28 at blue hour, with a question', 'The oldest frame on my phone'][week - 1]!, hook: ['I kept this one anyway.', 'First try, for once.', 'Which tram stop is yours?', 'Nine years ago.'][week - 1]! },
      ],
    })),
    memoryNotes: [],
  },
  posted: [
    { format: 'photo', title: 'Tram 28 at blue hour', postedAt: '2026-11-05T18:30:00Z', score: 71, results: { likes: 612, saves: 38, newFollowers: 6 } },
    { format: 'carousel', title: 'Why my film photos looked cold, and the fix', postedAt: '2026-10-22T18:30:00Z', score: 84, results: { likes: 540, saves: 410, newFollowers: 52 } },
    { format: 'photo', title: 'Miradouro at dusk', postedAt: '2026-10-13T18:30:00Z', score: null, results: { likes: 388, saves: 21, newFollowers: 2 } },
    { format: 'reel', title: 'Loading a Leica M6 in 20 seconds', postedAt: '2026-10-01T18:30:00Z', score: 77, results: { likes: 455, saves: 162, newFollowers: 19 } },
    { format: 'carousel', title: 'Alfama at 7 a.m., ten frames on Portra 400', postedAt: '2026-09-10T18:30:00Z', score: 74, results: { likes: 498, saves: 203, newFollowers: 31 } },
    { format: 'reel', title: 'Developing a roll in my kitchen', postedAt: '2026-08-20T18:30:00Z', score: null, results: { likes: 301, saves: 44, newFollowers: 4 } },
  ],
  insights: {
    winners: [
      { post: 'P1', why: 'A clear subject (the tram) against a simple sky, in low warm light. It got your most likes and shares of the set, because it reads in a split second on a phone.' },
      { post: 'P2', why: 'A face in a doorway with the street leading to it. Framed shots like this got about twice the saves of your wide views.' },
    ],
    losers: [
      { post: 'P3', why: 'A wide view at midday: flat light and no single subject. Nice to look at, but it got a third of the likes of P1 and almost no shares.' },
    ],
    patterns: [
      'Framed subjects in low, warm light beat wide views in flat light, in every month of the export.',
      'Your posts with a recognisable Lisbon place in the first frame got more shares than the ones without.',
      'Carousels that open with your strongest single frame keep people swiping; the ones that open wide lose them after slide 2.',
    ],
    shootNext: [
      { what: 'A tram or a person framed by a doorway or arch, an hour before sunset', why: 'It repeats the two things that made P1 and P2 work: one subject, warm low light.' },
      { what: 'The same street at 7 a.m. and 7 p.m., for a two-slide carousel', why: 'Before and after pairs are easy to save and share.' },
    ],
    cropAndCarousel: ['Crop the first slide 4:5 so it fills the phone screen.', 'Put the framed shot first and the widest view last.'],
    tips: [
      { post: 'P1', tip: 'Turn this into a weekly series: one tram, one arch, the same hour.' },
      { post: 'P2', tip: 'Shoot the doorway from one step closer so the face fills a third of the frame.' },
      { post: 'P3', tip: 'Come back to this view an hour before sunset and put one person in it.' },
    ],
    memoryNotes: [],
  },
  goalNote: 'You set 2,000 followers by Mar 31, 2027 when you had 1,158. You are at 1,240. At your average pace since June (about 4 a week) you would get there around 2030. At your October pace (about 17 a week) you would reach it by September 2027, so the coach suggests moving the date to September and keeping that pace.',
  memory: '## About you\n- Film photographer in Lisbon, shoots Portra 400 and a Leica M6\n- Posts Tue, Thu and Sat at 18:30\n## What works\n- 2026-10-24 Teaching carousels (problem, cause, fix) bring the most followers: 52 on Oct 22\n- 2026-10-03 Short Reels that teach one thing work: 19 followers for 20 seconds\n- 2026-11-07 Thursday is the day people find you (32% of followers)\n## What doesn\'t\n- 2026-11-07 Single pretty frames get likes but few follows (6 on Nov 5)\n- 2026-09-01 Quiet summer months cost followers: 1 post in Jul and Aug\n## Notes\n- 2026-11-20 Goal of 2,000 by March is out of reach at this pace; suggested September',
};
