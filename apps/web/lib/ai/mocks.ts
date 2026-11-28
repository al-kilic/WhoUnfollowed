import type { AiChat, AiCheck, AiInsights, AiPhotoStyle, AiDraft, AiIdeas, AiPlan, AiRead } from '@ig-tracker/core';

// Sample answers for mock mode (local work without an API key, and tests).
// They must pass the same schemas as real answers.

export const MOCK_READ: AiRead = {
  headline: 'Your audience grows in bursts, and following people no longer brings them back.',
  happening: [
    'Most of your followers from the last two years arrived in two months.',
    'Fewer of the accounts you follow follow you back than a year ago.',
  ],
  stop: { what: 'Following accounts in the hope they follow back', why: 'Your follow-back rate dropped, so it costs time and makes your ratio worse.' },
  try: [
    { what: 'Repeat what you posted in your best month', why: 'That month brought more followers than any other.' },
    { what: 'Post on a fixed day each week', why: 'A steady rhythm helps new people find you again.' },
  ],
  memoryNotes: ['Growth comes in bursts, not steadily'],
};

export const MOCK_DRAFT: AiDraft = {
  options: [
    { text: 'The city looks different at 2am. Here is what I found.', why: 'Short, curious, and in your night-walk niche.' },
    { text: 'Nobody takes this street at night. I did.', why: 'A small dare makes people stop.' },
    { text: 'Rain again. Good. The city empties and the reflections come out.', why: 'Your own words, and a mood your audience saves.' },
  ],
  memoryNotes: [],
  // Memory v2: sample ops so local runs exercise the notes (no model call).
  memory: { add: [{ type: 'voice', text: 'Writes short night-walk lines in the first person', tags: ['tone:short', 'topic:night'], confidence: 0.6 }], confirm: [], contradict: [] },
};

export const MOCK_CHECK: AiCheck = {
  overall: 68,
  scores: [
    { criterion: 'hook', score: 6, reason: 'Clear, but it describes the photo instead of making people curious.' },
    { criterion: 'clarity', score: 8, reason: 'One idea, easy to follow.' },
    { criterion: 'value', score: 6, reason: 'Nice to look at, but gives no reason to save it.' },
    { criterion: 'fit_you', score: 8, reason: 'Matches the night shots that worked for you.' },
    { criterion: 'fit_trend', score: 6, reason: 'Carousels are working well in photography right now.' },
    { criterion: 'action', score: 5, reason: 'No reason to follow for the next one.' },
  ],
  fixes: [
    { what: 'Open with the surprise, not the place', why: 'The first line decides whether people stop.' },
    { what: 'Turn it into a 5-photo carousel', why: 'Carousels get saved more than single photos.' },
  ],
  altHooks: ['I walked this street at 3am so you do not have to.'],
  caption: 'I walked this street at 3am. Five frames, no people, one cat. Part 2 next week.',
  cover: ['The text is too small to read on a phone.'],
  memoryNotes: [],
  memory: { add: [{ type: 'what_worked', text: 'Carousels get saved more than single photos', tags: ['format:carousel'], confidence: 0.6 }], confirm: [], contradict: [] },
};

export const MOCK_IDEAS: AiIdeas = {
  ideas: [
    { format: 'reel', idea: 'The same street at 6 a.m. and 2 a.m., cut on the beat', hook: 'Same street. Twenty hours apart.', why: 'Before and after posts get saved by your audience.' },
    { format: 'carousel', idea: 'Five settings you use for night shots, one per slide', hook: 'My night settings, so you can stop guessing.', why: 'Useful posts bring new followers in your niche.' },
    { format: 'photo', idea: 'One wet-pavement reflection with the place in the first line', hook: 'Rain again. Good.', why: 'Location posts did well for you last month.' },
    { format: 'reel', idea: 'A 15-second walk from the metro to your favourite corner', hook: 'Follow me for 15 seconds.', why: 'Short Reels under 20 seconds work best for you.' },
    { format: 'story', idea: 'A poll: which of two edits should become the post', hook: 'Left or right?', why: 'Polls bring back people who stopped seeing your posts.' },
  ],
  memoryNotes: [],
};

export const MOCK_PLAN: AiPlan = {
  summary: 'Four weeks built around your night walks, with one series that brings people back each week.',
  principles: ['One clear idea per post', 'A weekly series on a fixed day', 'Carousels for saves, Reels for reach'],
  weeks: [1, 2, 3, 4].map((week) => ({
    week,
    theme: ['Find the series', 'Behind the shot', 'Ask the audience', 'Best of the month'][week - 1]!,
    posts: [
      { day: 'Tue', format: 'carousel' as const, idea: 'Five frames from one street after midnight', hook: 'One street, five hours, zero people.' },
      { day: 'Thu', format: 'reel' as const, idea: 'How you get the shot, in 20 seconds', hook: 'This is all the gear I took.' },
      { day: 'Sun', format: 'photo' as const, idea: 'The single best frame of the week', hook: 'Picked from 300.' },
    ],
  })),
  memoryNotes: [],
};

export const MOCK_CHAT: AiChat = {
  answer: 'Most of the people who left last month followed you during one busy week, so they came for that moment, not for you.\n- Post one Reel this week that shows what you always post about.\n- Check who left after your next export, not before.',
  followUps: ['What should I post this week?', 'Is my follow-back rate good?'],
  memoryNotes: [],
};

export const MOCK_INSIGHTS: AiInsights = {
  winners: [{ post: 'P1', why: 'A strong frame around one clear subject, in low warm light. It got the most likes and shares.' }],
  losers: [{ post: 'P3', why: 'Flat midday light and no clear subject; it got a fraction of the likes of P1.' }],
  patterns: ['Framed subjects in warm, low light outperform wide views in flat light.', 'Posts with a recognisable place in the first slide got more shares.'],
  shootNext: [{ what: 'A landmark seen through a gap or an arch at sunset', why: 'It repeats what made P1 work.' }],
  cropAndCarousel: ['Crop the first slide 4:5 and keep the frame fully visible.', 'Put the strongest framed shot first and the widest view last.'],
  tips: [
    { post: 'P1', tip: 'Make this framing a series: one arch or doorway per week.' },
    { post: 'P2', tip: 'Crop tighter so the subject fills a third of the frame.' },
    { post: 'P3', tip: 'Reshoot this spot in the last hour of light.' },
  ],
  memoryNotes: [],
};

export const MOCK_PHOTO_STYLE: AiPhotoStyle = {
  summary: 'Quiet street scenes in low warm light, mostly film, with one small figure against a wide, simple background.',
  findings: [
    { text: 'Most frames are shot in the last hour of light, warm and from the side.', tags: ['light:golden-hour'] },
    { text: 'People are small in the frame: one figure in a wide street or doorway.', tags: ['subject:street'] },
    { text: 'Muted palette with one warm accent colour, usually a yellow tram or a red door.', tags: ['palette:muted'] },
  ],
  tryNext: ['Blue-hour frames appear in your photos but rarely in your posts: try one this week.'],
  memoryNotes: [],
};
