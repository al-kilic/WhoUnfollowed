import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { eq, sql } from 'drizzle-orm';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/telegram', () => ({ sendTelegramMessage: async () => undefined }));

// Memory v2 phase 2E against a real Postgres (mock answers, no paid calls).
// Off by default:
//   RUN_DB_TESTS=1 AI_PROVIDER=mock node_modules/.bin/vitest run lib/ai/memory2e.db.test.ts
// with DATABASE_URL set. Creates a throwaway user and deletes it after.
const run = process.env.RUN_DB_TESTS === '1';

describe.skipIf(!run)('memory 2E on Postgres', () => {
  let userId = '';
  let dbmod: typeof import('@/lib/db/index');
  let schema: typeof import('@/lib/db/schema');
  let digest: typeof import('./digest');
  let view: typeof import('./notesView');
  let spots: typeof import('./blindSpotStore');
  let data: typeof import('./memoryData');

  beforeAll(async () => {
    process.env.AI_PROVIDER = 'mock';
    dbmod = await import('@/lib/db/index');
    schema = await import('@/lib/db/schema');
    digest = await import('./digest');
    view = await import('./notesView');
    spots = await import('./blindSpotStore');
    data = await import('./memoryData');
    const [u] = await dbmod.db.insert(schema.users).values({ email: `memory2e-test-${Date.now()}@example.test`, passwordHash: 'x' }).returning({ id: schema.users.id });
    userId = u!.id;
    await dbmod.db.insert(schema.aiProfiles).values({ userId, memoryV2At: new Date() });
  });
  afterAll(async () => {
    if (userId) await dbmod.db.execute(sql`delete from users where id = ${userId}`);
  });

  it('the tidy-up waits for 5 changes, then runs once per export', async () => {
    const add = (body: string, over: object = {}) => dbmod.db.insert(schema.aiNotes).values({ userId, type: 'like', body, source: 'chat', origin: 'coach', ...over });
    await add('one'); await add('two');
    expect(await digest.runDigest(userId, '100')).toBe('skipped');
    await add('three'); await add('four', { pinned: true }); await add('five', { origin: 'user' });
    expect(await digest.runDigest(userId, '100')).toBe('done');
    expect(await digest.runDigest(userId, '100')).toBe('skipped');
    const p = await dbmod.db.query.aiProfiles.findFirst({ where: eq(schema.aiProfiles.userId, userId) });
    expect(p?.digestForExport).toBe('100');
    expect(p?.digestAt).toBeInstanceOf(Date);
  });

  it('the notes viewer: list, pin, edit, add, forget', async () => {
    const before = await view.listNotes(userId);
    expect(before.notes.length).toBe(5);
    const two = before.notes.find((n) => n.body === 'two')!;
    expect(await view.applyNoteOp(userId, { op: 'edit', id: two.id, body: 'Two, my way' })).toEqual({ ok: true });
    const added = await view.applyNoteOp(userId, { op: 'add', body: 'I shoot film', type: 'fact' });
    expect(added.ok).toBe(true);
    expect(await view.applyNoteOp(userId, { op: 'forget', id: two.id })).toEqual({ ok: true });
    expect(await view.applyNoteOp(userId, { op: 'add', body: 'Two, my way', type: 'fact' })).toEqual({ ok: false, reason: 'forgotten' });
    const after = await view.listNotes(userId);
    expect(after.notes.find((n) => n.body === 'I shoot film')).toMatchObject({ origin: 'user', pinned: true });
    expect(after.notes.some((n) => n.body === 'Two, my way')).toBe(false);
  });

  it('builds this week\'s learned note once', async () => {
    await view.ensureLearnedNote(userId, 'en');
    await view.ensureLearnedNote(userId, 'en');
    const weeks = await view.listLearned(userId);
    expect(weeks).toHaveLength(1);
    expect(weeks[0]!.lines.length).toBeGreaterThan(0);
    expect(await view.markLearnedSeen(userId, weeks[0]!.weekKey)).toBe(true);
  });

  it('blind-spot answers round-trip', async () => {
    await spots.saveSpotState(userId, { history: { no_cta: { shown: 1 } }, current: 'no_cta', newAt: [Date.now()], perData: { '100': 1 } }, '100');
    await spots.saveSpotState(userId, { history: { no_cta: { shown: 1, known: true } }, current: null, newAt: [], perData: {} }, '100');
    const s = await spots.loadSpotState(userId);
    expect(s.history.no_cta).toMatchObject({ shown: 1, known: true });
    expect(s.perData).toEqual({ '100': 1 });
  });

  it('voice and content history are stored for the coach', async () => {
    const stats = { captions: 12, medianChars: 90, medianWords: 16, shortShare: 0.4, longShare: 0, emojiPerCaption: 0.2, emojiShare: 0.1, hashtagMedian: 8, hashtagShare: 1, questionShare: 0.1, ctaShare: 0, lineBreakShare: 0, firstPersonShare: 0.6, lowercaseStartShare: 0 };
    await data.saveVoice(userId, { consent: true, stats, exemplars: ['Tram 28 at blue hour.'] });
    expect((await data.getVoice(userId))?.exemplars).toEqual(['Tram 28 at blue hour.']);
    const content = { total: 1, first: '2026-11-01', last: '2026-11-01', byMonth: [], weekday: [0, 0, 0, 0, 0, 0, 0], hour: Array(24).fill(0) as number[], posts30: 1, posts90: 1, posts365: 1, medianGapDays: null, currentGapDays: 3, longestGapDays: null, longestGapFrom: null, mix90: { photo: 1, carousel: 0, reel: 0, video: 0 }, mix365: { photo: 1, carousel: 0, reel: 0, video: 0 }, avgSlides: null, medianCaptionChars: 20, medianHashtags: 0, ctaShare: 0, questionShare: 0 };
    await data.saveContent(userId, { platform: 'instagram', stats: content, moments: [{ kind: 'best_month', at: '2026-10', params: { followers: 72 } }], insights: null });
    await data.saveContent(userId, { platform: 'instagram', stats: content, moments: [{ kind: 'best_month', at: '2026-10', params: { followers: 72 } }], insights: null });
    expect(await data.getMoments(userId)).toHaveLength(1);
    expect((await data.getContentStats(userId, 'instagram'))?.currentGapDays).toBe(3);
    expect(await data.getInsights(userId, 'instagram')).toBeNull();
  });

  it('saves Instagram\'s numbers, keeps them on a re-upload without, and fills results', async () => {
    const { getSampleInsights } = await import('@/lib/sample/learned');
    const ins = getSampleInsights();
    const target = ins.posts.find((p) => p.format !== 'reel')!;
    const [row] = await dbmod.db.insert(schema.aiContentLog).values({ userId, kind: 'post', format: target.format, topic: 'test', output: '{}', postedAt: new Date(`${target.date}T18:00:00Z`) }).returning({ id: schema.aiContentLog.id });
    const content = (await data.getContentStats(userId, 'instagram'))!;
    await data.saveContent(userId, { platform: 'instagram', stats: content, moments: [{ kind: 'best_post', at: '2026-01-02', params: { reach: 10, format: 1 } }], insights: null });
    const saved = await data.saveContent(userId, { platform: 'instagram', stats: content, moments: [{ kind: 'best_post', at: '2026-02-03', params: { reach: 20, format: 2 } }], insights: ins });
    expect((await data.getMoments(userId)).filter((m) => m.kind === 'best_post').map((m) => m.at)).toEqual(['2026-02-03']);
    expect(saved.filled).toBe(1);
    expect((await data.getInsights(userId, 'instagram'))?.account?.followers).toBe(ins.account?.followers);
    await data.saveContent(userId, { platform: 'instagram', stats: content, moments: [], insights: null });
    expect((await data.getInsights(userId, 'instagram'))?.stories?.total).toBe(ins.stories?.total);
    const log = await dbmod.db.query.aiContentLog.findFirst({ where: eq(schema.aiContentLog.id, row!.id) });
    expect(JSON.parse(log!.results!)).toMatchObject({ likes: target.likes, saves: target.saves });
  });

  it('photo style findings become Photo notes, once', async () => {
    const { MOCK_PHOTO_STYLE } = await import('./mocks');
    expect(await data.savePhotoFindings(userId, MOCK_PHOTO_STYLE)).toBe(4);
    await data.savePhotoFindings(userId, MOCK_PHOTO_STYLE);
    const notes = await dbmod.db.select().from(schema.aiNotes).where(eq(schema.aiNotes.userId, userId));
    const photo = notes.filter((n) => n.type === 'photo');
    expect(photo).toHaveLength(4);
    expect(photo.every((n) => n.tags.includes('photo') && n.origin === 'coach')).toBe(true);
  });
});
