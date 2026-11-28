import 'server-only';
import { EMPTY_MEMORY_OPS, type AiMemoryOps, aiChatSchema, aiCheckSchema, aiInsightsSchema, type AiInsights, type AiInsightsPost, aiPhotoStyleSchema, type AiPhotoStyle, aiDraftSchema, aiIdeasSchema, aiPlanSchema, aiReadSchema, type AiChat, type AiChatAttachments, type AiChatTurn, type AiPlanRequest, type AiCheck, type AiDraft, type AiIdeas, type AiPlan, type AiRead } from '@ig-tracker/core';
import { runAiAction, type AiRunResult } from './run';
import { listGoals } from './goals';
import { addCoachNotes, getAiProfile, getMemory, getPlanRow, logContent, planCalendarOf, planRevisions, recentContentOf, recentStats, savePlanPrefs, saveRevisedPlan } from './store';
import { calendarFromPlan, mergeCalendar } from './planCalendar';
import { buildCoachContext, type CoachContext } from './coachContext';
import { latestBriefContext } from './briefContext';
import { baseRules, SHAPES, TASKS, type AiLocale } from './prompts';
import { MOCK_CHAT, MOCK_CHECK, MOCK_INSIGHTS, MOCK_PHOTO_STYLE, MOCK_DRAFT, MOCK_IDEAS, MOCK_PLAN, MOCK_READ } from './mocks';
import { readsToday } from './store';
import { partialJsonString } from './partialJson';
import type { ContentPart } from './provider';
import { chatTurns } from './chatTurns';
import { platformUpdateLines } from './platformUpdates';
import { postingLine, prefsFromRow } from './prefs';
import { applyMemoryOps, loadNotes, markUsed } from './notes';
import { processSignals } from './learn';
import { userPartOfMemory, type Note } from './noteMath';
import { coreNotes, queryTagsFor, renderNote, selectNotes, type NoteAction } from './retrieve';
import { limitOverall, precheck, precheckLines, type PrecheckItem } from './precheck';
import { getContentStats, getInsights, getVoice, loadLedger, savePhotoFindings } from './memoryData';
import { historyLines, insightsLines, voiceCard } from './memoryLines';
import { ledgerLines } from './ledger';

// Each action: build the context, run the model through runAiAction (usage
// allowance, validation), then keep what's worth keeping: new memory notes and a
// content-log entry. Returns the answer plus the memory lines that were added.

export type ActionResult<T> =
  | { ok: true; data: T; added: string[]; balance: number; logId: string; mocked: boolean; seen?: CoachContext }
  | Exclude<AiRunResult<T>, { ok: true }>
  | { ok: false; reason: 'needs_export' };

// What the coach sees for this member: account, memory, numbers, Radar
// findings, recent results and this week's brief (see coachContext.ts).
// Memory v2: the member's notes too. New signals are turned into notes first
// (fixed rules, no model call); then the core notes (cached) and the notes
// that matter for this task are picked. memory.md keeps only the member's own
// text in the core; the coach's dated lines live on as notes.
// Measurable goals set in Studio, one per platform: this platform's goal
// first (what the coach works towards here), the others labelled.
function goalLines(goals: Awaited<ReturnType<typeof listGoals>>, platform: string): string[] {
  const unit = (t: string) => (t === 'posts_week' ? 'posts a week' : t === 'per_post' ? 'new followers per post on average' : 'followers');
  const line = (g: (typeof goals)[number]) => `${g.target} ${unit(g.type)}${g.by ? ` by ${g.by.toISOString().slice(0, 10)}` : ''}${g.note ? `. Why: ${g.note}` : ''}`;
  const name = (p: string) => (p === 'threads' ? 'Threads' : p === 'tiktok' ? 'TikTok' : 'Instagram');
  const here = goals.find((g) => g.platform === platform);
  const others = goals.filter((g) => g !== here);
  return [
    ...(here ? [`Measurable goal set in Studio for ${name(here.platform)}: ${line(here)}.`] : []),
    ...(others.length ? [`Goals on other platforms (not this one): ${others.map((g) => `${name(g.platform)}: ${line(g)}`).join('; ')}.`] : []),
  ];
}

type Ctx = CoachContext & { notes: Note[]; pickedIds: Set<string> };
async function context(userId: string, platform: string, task: { action: NoteAction; locale: AiLocale; format?: string | null; topic?: string | null; text?: string | null } = { action: 'read', locale: 'en' }): Promise<Ctx> {
  await processSignals(userId, task.locale).catch(() => 0);
  const [profile, memory, stats, checks, notes, voice, content, ledger, insights, goals] = await Promise.all([
    getAiProfile(userId),
    getMemory(userId),
    recentStats(userId, platform, 3),
    recentContentOf(userId, ['check', 'post'], 6),
    loadNotes(userId).catch(() => [] as Note[]),
    getVoice(userId).catch(() => null),
    getContentStats(userId, platform).catch(() => null),
    loadLedger(userId, platform).catch(() => null),
    getInsights(userId, platform).catch(() => null),
    listGoals(userId).catch(() => []),
  ]);
  const [brief, updates] = await Promise.all([latestBriefContext(profile?.niche).catch(() => null), platformUpdateLines(platform).catch(() => [] as string[])]);
  const results = checks
    .filter((c) => c.results)
    .map((c) => `- ${c.format ?? 'post'} about "${c.topic ?? ''}"${c.kind === 'check' ? ` (check score ${c.score ?? '?'})` : ' (from the plan)'}; results: ${c.results}`);
  const posting = profile ? postingLine(prefsFromRow(profile)) : '';
  const core = coreNotes(notes);
  const picked = selectNotes(notes, task.action, queryTagsFor({ format: task.format, topic: task.topic, text: task.text, platform }), new Date(), new Set(core.map((n) => n.id)));
  void markUsed(userId, [...core, ...picked].map((n) => n.id)).catch(() => undefined);
  const ctx = buildCoachContext({
    accountLine: profile ? `Type: ${profile.accountType ?? 'unknown'}. Niche: ${profile.niche ?? 'unknown'}. Goal: ${profile.goal ?? 'unknown'}.` : 'No onboarding answers.',
    extraLines: [
      ...(posting ? [posting] : []),
      ...goalLines(goals, platform),
    ],
    goal: goals.some((g) => g.platform === platform),
    memory: userPartOfMemory(memory?.content ?? ''),
    coreNotes: core.map(renderNote),
    notes: picked.map(renderNote),
    voice: voice ? voiceCard(voice.stats, voice.exemplars) : [],
    history: [...historyLines(content), ...insightsLines(insights)],
    ledger: ledger ? ledgerLines(ledger) : [],
    stats,
    results,
    brief,
    updates,
  });
  return { ...ctx, notes, pickedIds: new Set([...core, ...picked].map((n) => n.id)) };
}

// The JSON shape goes in the user turn, after the task: the system block is
// only baseRules(locale), the same for every action, so the cached prefix
// (rules + account core) is shared by all actions of a model.
function withShape(user: string | ContentPart[], shape: string): string | ContentPart[] {
  const block = `# JSON shape\n${shape}`;
  return typeof user === 'string' ? `${user}\n\n${block}` : [...user, { type: 'text', text: block }];
}

// The context pieces every action passes to runAiAction.
function ctxParts(ctx: Ctx): { core: string; context: string } {
  return { core: ctx.core, context: ctx.volatile };
}

// Keeps what the coach learned: memory ops (Memory v2) and old-style
// memoryNotes, as notes; the added lines are also mirrored into memory.md so
// the current memory page shows them. Returns the lines added.
async function keepMemory(userId: string, ctx: Ctx, data: { memoryNotes: string[]; memory?: AiMemoryOps | undefined }, source: string, logId: string | null): Promise<string[]> {
  const added = await applyMemoryOps(userId, { ops: data.memory ?? EMPTY_MEMORY_OPS, legacy: data.memoryNotes, source, sourceRef: logId, notes: ctx.notes }).catch(() => [] as string[]);
  if (added.length) await addCoachNotes(userId, added);
  return added;
}

// What goes back to the browser: the context without the notes list.
const seenOf = (ctx: Ctx): CoachContext => ({ text: ctx.text, core: ctx.core, volatile: ctx.volatile, sources: ctx.sources });

async function finish<T extends { memoryNotes: string[]; memory?: AiMemoryOps | undefined }>(
  userId: string,
  ctx: Ctx,
  res: AiRunResult<T>,
  log: (data: T) => { kind: string; format?: string | null; topic?: string | null; score?: number | null },
): Promise<ActionResult<T>> {
  if (!res.ok) return res;
  const entry = log(res.data);
  const logId = await logContent(userId, { ...entry, output: res.data });
  const added = await keepMemory(userId, ctx, res.data, entry.kind, logId);
  return { ok: true, data: res.data, added, balance: res.balance, logId, mocked: res.mocked, seen: seenOf(ctx) };
}

// The coach read of a new export: included (it uses the allowance like every
// action), at most one a day per platform, so an Instagram and a Threads
// export can both be read today. 'paid' is no longer returned; the type keeps
// it until the old read offer screen is gone.
export type ReadStatus = { kind: 'free' } | { kind: 'paid'; cost: number } | { kind: 'tomorrow' };
export async function readStatus(userId: string, platform: string, now: Date = new Date()): Promise<ReadStatus> {
  return (await readsToday(userId, platform, now)) >= 1 ? { kind: 'tomorrow' } : { kind: 'free' };
}

export async function runRead(userId: string, platform: string, locale: AiLocale): Promise<ActionResult<AiRead>> {
  const ctx = await context(userId, platform, { action: 'read', locale });
  const res = await runAiAction({ userId, action: 'read', system: baseRules(locale), ...ctxParts(ctx), user: withShape(`# Task\n${TASKS.read}`, SHAPES.read), schema: aiReadSchema, mock: MOCK_READ });
  return finish(userId, ctx, res, () => ({ kind: 'read', topic: platform }));
}

export async function runDraft(userId: string, req: { kind: string; format: string; topic: string; tone?: string; length?: string; images?: string[]; platform: string }, locale: AiLocale): Promise<ActionResult<AiDraft>> {
  const ctx = await context(userId, req.platform, { action: 'draft', locale, format: req.format, topic: req.topic });
  const text = `# Task\n${TASKS.draft(req.kind, req.format, req.tone, req.length)}\nTopic: ${req.topic}${req.images?.length ? `\nThe post's photos are attached, in slide order.` : ''}`;
  // Photos are sent for this one call and never stored.
  const user: string | ContentPart[] = req.images?.length
    ? [{ type: 'text', text }, ...req.images.map((url) => ({ type: 'image_url' as const, image_url: { url } }))]
    : text;
  const res = await runAiAction({ userId, action: 'draft', system: baseRules(locale), ...ctxParts(ctx), user: withShape(user, SHAPES.draft), schema: aiDraftSchema, mock: MOCK_DRAFT });
  return finish(userId, ctx, res, () => ({ kind: 'draft', format: req.format, topic: req.topic }));
}

export async function runIdeas(userId: string, req: { theme: string; platform: string }, locale: AiLocale): Promise<ActionResult<AiIdeas>> {
  const ctx = await context(userId, req.platform, { action: 'ideas', locale, topic: req.theme });
  const res = await runAiAction({ userId, action: 'ideas', system: baseRules(locale), ...ctxParts(ctx), user: withShape(`# Task\n${TASKS.ideas(req.theme)}`, SHAPES.ideas), schema: aiIdeasSchema, mock: MOCK_IDEAS });
  return finish(userId, ctx, res, () => ({ kind: 'ideas', topic: req.theme || null }));
}

export async function runCheck(userId: string, req: { format: string; hook: string; caption: string; coverImage: string | null; platform: string }, locale: AiLocale): Promise<ActionResult<AiCheck> & { precheck?: PrecheckItem[] }> {
  const [ctx, profile, posted] = await Promise.all([context(userId, req.platform, { action: 'check', locale, format: req.format, topic: req.hook, text: req.caption }), getAiProfile(userId), recentContentOf(userId, ['check', 'post'], 20)]);
  // The fixed rules first, in code: the model explains them and its score may not contradict them.
  const rules = precheck({ format: req.format, hook: req.hook, caption: req.caption, postingDays: profile ? prefsFromRow(profile).days : [], results: postedResults(posted) });
  const text = `# Task\n${TASKS.check}\n\n# Rules checked in code\n${precheckLines(rules)}\n\n# The post\nFormat: ${req.format}\nHook: ${req.hook}\nCaption: ${req.caption || '(none)'}\nCover image: ${req.coverImage ? 'attached' : 'none'}`;
  // The image is sent for this one call and never stored.
  const user: string | ContentPart[] = req.coverImage
    ? [{ type: 'text', text }, { type: 'image_url', image_url: { url: req.coverImage } }]
    : text;
  const raw = await runAiAction({ userId, action: 'check', system: baseRules(locale), ...ctxParts(ctx), user: withShape(user, SHAPES.check), schema: aiCheckSchema, mock: MOCK_CHECK });
  const res = raw.ok ? { ...raw, data: { ...raw.data, overall: limitOverall(raw.data.overall, rules) } } : raw;
  const out = await finish(userId, ctx, res, (d) => ({ kind: 'check', format: req.format, topic: req.hook.slice(0, 120), score: d.overall }));
  return out.ok ? { ...out, precheck: rules } : out;
}

// Posts the member logged with results: the format and the new followers after it.
function postedResults(rows: { format: string | null; results: string | null }[]): { format: string; newFollowers: number }[] {
  return rows.flatMap((r) => {
    try {
      const v = (JSON.parse(r.results ?? '{}') as { newFollowers?: unknown }).newFollowers;
      return typeof v === 'number' && r.format ? [{ format: r.format, newFollowers: v }] : [];
    } catch { return []; }
  });
}

export async function runPlan(userId: string, req: AiPlanRequest & { platform: string }, locale: AiLocale): Promise<ActionResult<AiPlan>> {
  // The plan is built on the account: without an export there is nothing to build on.
  if (!(await recentStats(userId, req.platform, 1)).length) return { ok: false, reason: 'needs_export' };
  await savePlanPrefs(userId, req);
  const ctx = await context(userId, req.platform, { action: 'plan', locale, topic: req.focus });
  const res = await runAiAction({ userId, action: 'plan', system: baseRules(locale), ...ctxParts(ctx), user: withShape(`# Task\n${TASKS.plan(req)}`, SHAPES.plan), schema: aiPlanSchema, mock: MOCK_PLAN });
  return finish(userId, ctx, res, () => ({ kind: 'plan', topic: req.focus || null }));
}

// Ask coach. The conversation lives in the browser and arrives with each
// question; it is sent to the model for this one call and never stored. Only
// the memory notes the model suggests are kept, like every other action.
export async function runChat(userId: string, req: { messages: AiChatTurn[]; deep: boolean; platform: string; attachments?: AiChatAttachments | undefined }, locale: AiLocale, onAnswer?: (answerSoFar: string) => void): Promise<ActionResult<AiChat> & { left?: number }> {
  const action = req.deep ? 'chatDeep' : 'chat';
  const turns = chatTurns(req.messages);
  // Notes are picked for the conversation's first question, so the context
  // (sent with the first turn) stays byte-identical while the chat goes on and
  // every new question reads the earlier turns from the cache. Notes that fit
  // only the latest question ride along with it.
  const ctx = await context(userId, req.platform, { action, locale, text: turns.first });
  const extra = turns.history.length
    ? selectNotes(ctx.notes, action, queryTagsFor({ text: turns.latest, platform: req.platform }), new Date(), ctx.pickedIds).slice(0, 4)
    : [];
  if (extra.length) void markUsed(userId, extra.map((n) => n.id)).catch(() => undefined);
  const more = extra.length ? `# More notes for this question ([id] type · tags · note)\n${extra.map(renderNote).join('\n')}\n\n` : '';
  // What the member attached to this question only (their own numbers, plan,
  // goal... and up to 3 photos). Sent for this call, never stored or logged.
  const att = req.attachments;
  const attached = att?.context.length
    ? `# Attached by the member for this question (use it, and say which of it you used)\n${att.context.map((c) => `## ${c.label}\n${c.text}`).join('\n\n')}\n\n`
    : '';
  const photos = att?.images.length ? `\n\nThe member attached ${att.images.length} photo${att.images.length > 1 ? 's' : ''} below. Look at them to answer.` : '';
  const text = withShape(`${more}${attached}# Question\n${turns.latest}${photos}\n\n# Task\n${TASKS.chat(req.deep)}`, SHAPES.chat) as string;
  const user: string | ContentPart[] = att?.images.length
    ? [{ type: 'text', text }, ...att.images.map((url) => ({ type: 'image_url' as const, image_url: { url } }))]
    : text;
  const res = await runAiAction({ userId, action, system: baseRules(locale), ...ctxParts(ctx), history: turns.history, user, schema: aiChatSchema, mock: MOCK_CHAT,
    ...(onAnswer ? { onText: (t: string) => { const a = partialJsonString(t, 'answer'); if (a) onAnswer(a); } } : {}) });
  if (!res.ok) return res;
  const added = await keepMemory(userId, ctx, res.data, 'chat', null);
  return { ok: true, data: res.data, added, balance: res.balance, logId: '', mocked: res.mocked, seen: seenOf(ctx) };
}

export async function runPlanRevise(userId: string, req: { id: string; feedback: string; platform: string }, locale: AiLocale): Promise<ActionResult<AiPlan> | { ok: false; reason: 'not_found' }> {
  const row = await getPlanRow(userId, req.id);
  if (!row) return { ok: false, reason: 'not_found' };
  const revisions = planRevisions(row.results);
  const ctx = await context(userId, req.platform, { action: 'planRevise', locale, text: req.feedback });
  const user = `# Current plan\n${row.output}\n\n# Task\n${TASKS.planRevise(req.feedback)}`;
  const res = await runAiAction({ userId, action: 'planRevise', system: baseRules(locale), ...ctxParts(ctx), user: withShape(user, SHAPES.plan), schema: aiPlanSchema, mock: MOCK_PLAN });
  if (!res.ok) return res;
  await saveRevisedPlan(userId, row.id, res.data, mergeCalendar(calendarFromPlan(res.data), planCalendarOf(row.results, row.output)), revisions + 1);
  const added = await keepMemory(userId, ctx, res.data, 'plan', row.id);
  return { ok: true, data: res.data, added, balance: res.balance, logId: row.id, mocked: res.mocked, seen: seenOf(ctx) };
}

// Photo insights: the user's own posts (first-slide photo + the numbers they
// copied from Instagram). Photos go to the model for this one call only.
export async function runInsights(userId: string, req: { posts: AiInsightsPost[]; platform: string }, locale: AiLocale): Promise<ActionResult<AiInsights>> {
  const ctx = await context(userId, req.platform, { action: 'insights', locale });
  const num = (n: number | null, label: string) => (n === null ? null : `${n.toLocaleString('en-US')} ${label}`);
  const list = req.posts.map((p, i) => [
    `P${i + 1}`, p.date ?? 'date unknown', p.place || 'place not given',
    [num(p.likes, 'likes'), num(p.comments, 'comments'), num(p.saves, 'saves'), num(p.shares, 'shares'), num(p.reach, 'reach')].filter(Boolean).join(', ') || 'no numbers given',
    p.caption ? `caption: "${p.caption}"` : '',
  ].filter(Boolean).join(' | ')).join('\n');
  const user: ContentPart[] = [
    { type: 'text', text: `# Posts\n${list}\n\n# Task\n${TASKS.insights}` },
    ...req.posts.flatMap((p, i) => [{ type: 'text' as const, text: `Photo P${i + 1}:` }, { type: 'image_url' as const, image_url: { url: p.photo } }]),
  ];
  const res = await runAiAction({ userId, action: 'insights', system: baseRules(locale), ...ctxParts(ctx), user: withShape(user, SHAPES.insights), schema: aiInsightsSchema, mock: MOCK_INSIGHTS });
  return finish(userId, ctx, res, () => ({ kind: 'insights', topic: `${req.posts.length} posts` }));
}

// "Learn my photo style": up to 24 small photos from the member's export,
// sent once and never kept. What is kept: the findings, as Photo notes the
// member can edit or forget (and any memory ops, as usual).
export async function runPhotoStyle(userId: string, req: { photos: string[]; platform: string }, locale: AiLocale): Promise<ActionResult<AiPhotoStyle> & { saved?: number }> {
  const ctx = await context(userId, req.platform, { action: 'insights', locale });
  const user: ContentPart[] = [
    { type: 'text', text: `# Task\n${TASKS.photoStyle}` },
    ...req.photos.map((url) => ({ type: 'image_url' as const, image_url: { url } })),
  ];
  const res = await runAiAction({ userId, action: 'photoStyle', system: baseRules(locale), ...ctxParts(ctx), user: withShape(user, SHAPES.photoStyle), schema: aiPhotoStyleSchema, mock: MOCK_PHOTO_STYLE });
  const done = await finish(userId, ctx, res, () => ({ kind: 'photoStyle', topic: `${req.photos.length} photos` }));
  if (!done.ok) return done;
  const saved = await savePhotoFindings(userId, done.data).catch(() => 0);
  return { ...done, saved };
}
