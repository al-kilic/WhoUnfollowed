import { z } from 'zod';
import { platformSchema } from './schemas.js';

// Pro AI: what the browser may send to the server and what the model must
// return. Inputs carry counts, dates and the user's own words, never follower
// usernames. Outputs are validated before anything is shown or stored.

const text = (max: number) => z.string().trim().min(1).max(max);

// ── Inputs ──────────────────────────────────────────────────────────────────

export const aiAccountTypes = ['personal', 'creator', 'business'] as const;

export const aiOnboardingSchema = z.object({
  accountType: z.enum(aiAccountTypes),
  niche: text(80),
  goal: text(200),
  whatYouPost: text(300),
  // A few past captions so drafts sound like the user.
  voiceSamples: z.array(text(2200)).max(5).default([]),
});
export type AiOnboardingInput = z.infer<typeof aiOnboardingSchema>;

// One export, reduced to numbers in the browser before upload.
export const exportStatsSchema = z.object({
  platform: platformSchema,
  exportedAt: z.number().int().positive(),
  followers: z.number().int().nonnegative(),
  following: z.number().int().nonnegative(),
  mutuals: z.number().int().nonnegative(),
  nonFollowers: z.number().int().nonnegative(),
  fans: z.number().int().nonnegative(),
  // 'YYYY-MM' -> new followers that month, last 24 months at most.
  newFollowersByMonth: z.record(z.string().regex(/^\d{4}-\d{2}$/), z.number().int().nonnegative()),
  // Of the accounts you followed in the last 12 months, the share that follow back (0..1).
  followBackRate12m: z.number().min(0).max(1).nullable(),
  followBackRatePrev12m: z.number().min(0).max(1).nullable(),
  pendingRequests: z.number().int().nonnegative().nullable(),
  // Radar findings as numbers and dates only (see tools/radarFacts.ts). The
  // value regex means no username can pass, whatever the browser sends.
  facts: z.array(z.object({
    id: z.string().regex(/^(fix|fact)\.[a-z_]{2,40}$/),
    params: z.record(z.string().regex(/^[a-zA-Z]{1,20}$/), z.union([z.number().finite(), z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/)])),
  })).max(16).optional(),
});
export type ExportStats = z.infer<typeof exportStatsSchema>;

export const aiDraftKinds = ['hook', 'caption', 'script'] as const;
export const aiPostFormats = ['reel', 'carousel', 'photo', 'story'] as const;

export const aiDraftTones = ['voice', 'warmer', 'bolder'] as const;
export const aiDraftLengths = ['short', 'medium', 'long'] as const;
export const aiDraftRequestSchema = z.object({
  kind: z.enum(aiDraftKinds),
  format: z.enum(aiPostFormats),
  topic: text(300),
  tone: z.enum(aiDraftTones).default('voice'),
  length: z.enum(aiDraftLengths).default('medium'),
  // Up to 4 of the post's photos, as JPEG data URLs resized and stripped in the
  // browser (see aiCheckRequestSchema.coverImage). Sent for this call only.
  images: z.array(z.string().startsWith('data:image/jpeg;base64,').max(700_000)).max(4).default([]),
});

export const aiCheckRequestSchema = z.object({
  format: z.enum(aiPostFormats),
  hook: text(300),
  caption: z.string().trim().max(2200).default(''),
  // A JPEG data URL, resized to 1024 px and stripped in the browser. Optional.
  coverImage: z.string().startsWith('data:image/jpeg;base64,').max(700_000).nullable().default(null),
});

// Photo insights: up to 8 of the user's own posts, each a first-slide photo
// (JPEG data URL, resized and stripped in the browser) and the numbers the user
// copied from Instagram. Sent for this one call; the photos are never stored.
const count = z.number().int().min(0).max(100_000_000).nullable().default(null);
export const aiInsightsPostSchema = z.object({
  photo: z.string().startsWith('data:image/jpeg;base64,').max(700_000),
  place: z.string().trim().max(80).default(''),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().default(null),
  caption: z.string().trim().max(300).default(''),
  likes: count, comments: count, saves: count, shares: count, reach: count,
});
export const aiInsightsRequestSchema = z.object({
  posts: z.array(aiInsightsPostSchema).min(3).max(8),
});
export type AiInsightsPost = z.infer<typeof aiInsightsPostSchema>;

// "Learn my photo style" (memory v2, 3B): up to 24 first photos from the
// member's own export, small (768 px), sent once and never kept.
export const aiPhotoStyleRequestSchema = z.object({
  photos: z.array(z.string().startsWith('data:image/jpeg;base64,').max(250_000)).min(6).max(24),
});

// Studio > Plan > Goals: a follower target, an optional deadline (YYYY-MM-DD)
// and how often to send a check-in email.
export const aiCheckinCadences = ['weekly', 'biweekly', 'monthly', 'off'] as const;
export const aiGoalTypes = ['followers', 'posts_week', 'per_post'] as const;
export const aiGoalRequestSchema = z.object({
  // Goals are per platform; absent means the platform of the latest export.
  platform: platformSchema.optional(),
  type: z.enum(aiGoalTypes).default('followers'),
  // Followers, posts a week, or average new followers per post.
  target: z.number().int().min(1).max(100_000_000),
  by: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().default(null),
  note: z.string().trim().max(200).default(''),
  cadence: z.enum(aiCheckinCadences).default('off'),
  // 0 (Sunday) to 6; null means any day.
  weekday: z.number().int().min(0).max(6).nullable().default(1),
  deadlineReminder: z.boolean().default(false),
}).refine((g) => g.type !== 'posts_week' || g.target <= 50, { message: 'at most 50 posts a week', path: ['target'] });

// You > Settings > Coach: defaults for everything the coach makes.
// days: posting days, 0 (Monday) to 6 (Sunday). bestTime: "HH:MM" or null.
export const aiPrefsSchema = z.object({
  tone: z.enum(aiDraftTones).default('voice'),
  length: z.enum(aiDraftLengths).default('medium'),
  days: z.array(z.number().int().min(0).max(6)).max(7).transform((d) => [...new Set(d)].sort()).default([]),
  bestTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable().default(null),
  // On by default for every account; members can turn it off.
  briefEmail: z.boolean().default(true),
  // Off by default: an email on each posting day.
  postingReminder: z.boolean().default(false),
  // When that email goes out: on the posting day, or the day before.
  reminderWhen: z.enum(['day_of', 'day_before']).default('day_of'),
});
export type AiPrefs = z.infer<typeof aiPrefsSchema>;

// You > profile: an optional name Today greets with. Empty clears it.
export const displayNameSchema = z.object({
  name: z.string().max(80).transform((v) => v.replace(/\s+/g, ' ').trim()).pipe(z.string().max(40)),
});
export type DisplayNameInput = z.infer<typeof displayNameSchema>;

// Studio > Plan: the 30-day plan as an editable calendar. day = days after
// the plan's first Monday (0 to 34).
export const aiPlanCalendarItemSchema = z.object({
  day: z.number().int().min(0).max(34),
  format: z.enum(aiPostFormats),
  idea: text(300),
  hook: z.string().trim().max(200).default(''),
  posted: z.boolean().default(false),
});
export const aiPlanCalendarSchema = z.object({
  id: z.string().uuid(),
  items: z.array(aiPlanCalendarItemSchema).max(60),
});
export type AiPlanCalendarItem = z.infer<typeof aiPlanCalendarItemSchema>;

// Idea bank: optional theme to steer the ideas.
export const aiIdeasRequestSchema = z.object({
  theme: z.string().trim().max(200).default(''),
});

// Ask coach: the conversation so far lives in the browser; each request sends
// the last few turns. `deep` asks the stronger model (costs credits).
export const aiChatTurnSchema = z.object({
  role: z.enum(['user', 'coach']),
  text: z.string().trim().min(1).max(2400),
});
// Things the member attaches to one question in Ask coach: up to 3 photos
// (resized in the browser) and short text summaries of their own Studio data
// (an export's numbers, the plan, a goal...). Never followers' usernames.
export const aiChatContextKinds = ['report', 'plan', 'goal', 'insights', 'check', 'radar'] as const;
export const AI_CHAT_LIMITS = { images: 3, imageChars: 250_000, imageMaxSide: 2048, contextItems: 6, contextChars: 4_000 } as const;
export const aiChatAttachmentsSchema = z.object({
  images: z.array(z.string().regex(/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/).max(AI_CHAT_LIMITS.imageChars)).max(AI_CHAT_LIMITS.images).default([]),
  context: z.array(z.object({
    kind: z.enum(aiChatContextKinds),
    label: z.string().trim().min(1).max(80),
    text: z.string().trim().min(1).max(AI_CHAT_LIMITS.contextChars),
  })).max(AI_CHAT_LIMITS.contextItems).default([]),
}).refine((a) => a.context.reduce((n, c) => n + c.text.length, 0) <= AI_CHAT_LIMITS.contextChars, { message: 'attached context is limited to 4000 characters in total' });
export type AiChatAttachments = z.infer<typeof aiChatAttachmentsSchema>;

export const aiChatRequestSchema = z.object({
  messages: z.array(aiChatTurnSchema).min(1).max(12),
  deep: z.boolean().default(false),
  attachments: aiChatAttachmentsSchema.optional(),
}).refine((r) => r.messages[r.messages.length - 1]!.role === 'user' && r.messages[r.messages.length - 1]!.text.length <= 1000, { message: 'last message must be a user question of at most 1000 characters' });
export type AiChatTurn = z.infer<typeof aiChatTurnSchema>;

// The 30-day plan setup: what the member can realistically make in a month.
export const aiPlanPhotoStates = ['ready', 'weekly', 'none'] as const;
export const aiPlanTimes = ['quick', 'hour', 'half_day'] as const;
export const aiPlanRequestSchema = z.object({
  // What they would like to post about.
  focus: z.string().trim().max(300).default(''),
  postsPerWeek: z.number().int().min(1).max(14).default(3),
  formats: z.array(z.enum(aiPostFormats)).min(1).max(4).default(['reel', 'carousel', 'photo', 'story']),
  // Photos ready to post, a weekly shoot, or nothing yet.
  photos: z.enum(aiPlanPhotoStates).default('weekly'),
  readyCount: z.number().int().min(0).max(1000).nullable().default(null),
  // Where they will be in the next 30 days (trips, cities, dates).
  places: z.string().trim().max(300).default(''),
  avoid: z.string().trim().max(200).default(''),
  // Time they can spend on one post.
  time: z.enum(aiPlanTimes).default('hour'),
});
export type AiPlanRequest = z.infer<typeof aiPlanRequestSchema>;

// ── Model outputs ───────────────────────────────────────────────────────────

// Short notes the model wants added to memory. Server decides what to keep.
// Kept for older answers and mocks; new answers use `memory` below.
const memoryNotes = z.array(text(240)).max(3).default([]);

// Memory v2 (phase 2B): what the coach wants to change in its notes, returned
// with the answer so no extra call is needed. Ids are the short note ids the
// coach was shown (e.g. "a1b2c3"). Invalid ops never fail the answer: they are
// dropped (`.catch`). The server decides what to keep and never lets these
// touch pinned notes or notes the member wrote.
export const aiNoteTypes = ['fact', 'like', 'dislike', 'voice', 'what_worked', 'what_didnt', 'audience', 'photo', 'goal', 'context'] as const;
export type AiNoteType = typeof aiNoteTypes[number];
const noteId = z.string().trim().regex(/^[a-f0-9]{6}$/);
const noteTag = z.string().trim().toLowerCase().regex(/^[a-z0-9_:-]{2,40}$/);
export const aiMemoryOpsSchema = z.object({
  add: z.array(z.object({
    type: z.enum(aiNoteTypes),
    text: text(240),
    tags: z.array(noteTag).max(6).default([]),
    example: z.string().trim().max(300).optional(),
    confidence: z.number().min(0).max(1).default(0.6),
  })).max(3).default([]),
  confirm: z.array(noteId).max(5).default([]),
  contradict: z.array(z.object({ id: noteId, text: text(240) })).max(2).default([]),
  corrected: z.object({ text: text(240), id: noteId.optional() }).optional(),
});
export type AiMemoryOps = z.infer<typeof aiMemoryOpsSchema>;
export const EMPTY_MEMORY_OPS: AiMemoryOps = { add: [], confirm: [], contradict: [] };
// Optional, so older answers, mocks and sample answers stay valid.
const memory = aiMemoryOpsSchema.optional().catch(undefined);
const tip = z.object({ what: text(200), why: text(300) });

export const aiReadSchema = z.object({
  headline: text(140),
  happening: z.array(text(260)).min(1).max(3),
  stop: tip,
  try: z.array(tip).min(1).max(3),
  memoryNotes,
  memory,
});
export type AiRead = z.infer<typeof aiReadSchema>;

export const aiDraftSchema = z.object({
  options: z.array(z.object({ text: text(2200), why: text(200) })).min(1).max(3),
  memoryNotes,
  memory,
});
export type AiDraft = z.infer<typeof aiDraftSchema>;

export const aiCheckCriteria = ['hook', 'clarity', 'value', 'fit_you', 'fit_trend', 'action'] as const;

export const aiCheckSchema = z.object({
  overall: z.number().int().min(0).max(100),
  scores: z.array(z.object({ criterion: z.enum(aiCheckCriteria), score: z.number().int().min(1).max(10), reason: text(200) })).length(6),
  fixes: z.array(tip).min(1).max(3),
  altHooks: z.array(text(300)).max(2),
  caption: z.string().trim().max(2200),
  cover: z.array(text(200)).max(3).default([]),
  memoryNotes,
  memory,
});
export type AiCheck = z.infer<typeof aiCheckSchema>;

export const aiPlanSchema = z.object({
  summary: text(400),
  principles: z.array(text(200)).min(1).max(5),
  weeks: z.array(z.object({
    week: z.number().int().min(1).max(5),
    theme: text(120),
    posts: z.array(z.object({
      day: text(20),
      format: z.enum(aiPostFormats),
      idea: text(300),
      hook: text(200),
    })).min(1).max(14),
  })).min(4).max(5),
  memoryNotes,
  memory,
});
export type AiPlan = z.infer<typeof aiPlanSchema>;

export const aiIdeasSchema = z.object({
  ideas: z.array(z.object({
    format: z.enum(aiPostFormats),
    idea: text(300),
    hook: text(200),
    why: text(200),
  })).min(1).max(5),
  memoryNotes,
  memory,
});
export type AiIdeas = z.infer<typeof aiIdeasSchema>;

export const aiChatSchema = z.object({
  answer: text(2400),
  followUps: z.array(text(120)).max(3).default([]),
  memoryNotes,
  memory,
});
export type AiChat = z.infer<typeof aiChatSchema>;

// What the photo pass keeps: a short summary and a few findings about style
// and subjects (no people's identities), saved as Photo notes.
export const aiPhotoStyleSchema = z.object({
  summary: text(400),
  findings: z.array(z.object({ text: text(200), tags: z.array(z.string().trim().toLowerCase().regex(/^[a-z0-9:_-]{2,30}$/)).max(4).default([]) })).min(2).max(6),
  tryNext: z.array(text(200)).max(2).default([]),
  memoryNotes,
  memory,
});
export type AiPhotoStyle = z.infer<typeof aiPhotoStyleSchema>;

export const aiInsightsSchema = z.object({
  winners: z.array(z.object({ post: text(4), why: text(400) })).min(1).max(3),
  losers: z.array(z.object({ post: text(4), why: text(400) })).max(3).default([]),
  patterns: z.array(text(400)).min(1).max(5),
  shootNext: z.array(z.object({ what: text(200), why: text(300) })).min(1).max(3),
  cropAndCarousel: z.array(text(300)).max(3).default([]),
  // One concrete tip per post (optional; older saved runs have none).
  tips: z.array(z.object({ post: text(4), tip: text(240) })).max(8).default([]),
  memoryNotes,
  memory,
});
export type AiInsights = z.infer<typeof aiInsightsSchema>;

// Memory v2 phase 1C: what members do with the coach's answers, captured so
// the coach can learn their taste later. Pro AI only, never in sample mode.
// Short text only, handles scrubbed on the server, nothing about other people.
export const aiThumbChips = ['not_my_voice', 'too_generic', 'wrong_facts', 'too_long', 'already_do'] as const;
export const aiSignalActions = ['read', 'draft', 'check', 'ideas', 'chat', 'plan', 'insights'] as const;
const short = (max: number) => z.string().trim().max(max);
const diffSchema = z.object({
  lengthDelta: z.number().int().min(-5000).max(5000),
  wordsBefore: z.number().int().min(0).max(400),
  wordsAfter: z.number().int().min(0).max(400),
  emojiDelta: z.number().int().min(-200).max(200),
  hashtagDelta: z.number().int().min(-200).max(200),
  lineBreakDelta: z.number().int().min(-200).max(200),
  caseChange: z.enum(['none', 'lower', 'upper']),
  removed: z.array(short(60)).max(3),
  added: z.array(short(60)).max(3),
});
const signalBase = { action: z.enum(aiSignalActions), contentLogId: z.string().uuid().nullable().default(null) };
export const aiSignalSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('draft_pick'), ...signalBase, option: z.number().int().min(0).max(4), of: z.number().int().min(1).max(5), text: short(300) }),
  z.object({ kind: z.literal('draft_edit'), ...signalBase, option: z.number().int().min(0).max(4), diff: diffSchema, before: short(300), after: short(300) }),
  z.object({ kind: z.literal('hook_used'), ...signalBase, text: short(300) }),
  z.object({ kind: z.literal('thumb'), ...signalBase, up: z.boolean(), chip: z.enum(aiThumbChips).nullable().default(null) }),
]);
export type AiSignal = z.infer<typeof aiSignalSchema>;
export const aiSignalRequestSchema = z.object({ signals: z.array(aiSignalSchema).min(1).max(20) });
