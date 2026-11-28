import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { eq, sql } from 'drizzle-orm';

vi.mock('server-only', () => ({}));

// Coach notes against a real Postgres. Off by default:
//   RUN_DB_TESTS=1 node_modules/.bin/vitest run lib/ai/notes.db.test.ts
// with DATABASE_URL set. Creates a throwaway user and deletes it after.
const run = process.env.RUN_DB_TESTS === '1';

describe.skipIf(!run)('coach notes on Postgres', () => {
  let userId = '';
  let notes: typeof import('./notes');
  let learn: typeof import('./learn');
  let dbmod: typeof import('@/lib/db/index');
  let schema: typeof import('@/lib/db/schema');
  const md = ['## About me', 'Film photographer.', '', '## Notes from your coach', '- 2026-10-01 Memory started.', '- 2026-10-03 Carousels bring the most follows', ''].join('\n');

  beforeAll(async () => {
    dbmod = await import('@/lib/db/index');
    schema = await import('@/lib/db/schema');
    notes = await import('./notes');
    learn = await import('./learn');
    const [u] = await dbmod.db.insert(schema.users).values({ email: `notes-test-${Date.now()}@example.test`, passwordHash: 'x' }).returning({ id: schema.users.id });
    userId = u!.id;
    await dbmod.db.insert(schema.aiProfiles).values({ userId });
    await dbmod.db.insert(schema.aiMemory).values({ userId, content: md });
  });
  afterAll(async () => {
    if (userId) await dbmod.db.execute(sql`delete from users where id = ${userId}`);
  });

  it('backfills once, however often it runs', async () => {
    expect(await notes.ensureBackfill(userId)).toBe(1);
    expect(await notes.ensureBackfill(userId)).toBe(0);
    const all = await notes.loadNotes(userId);
    expect(all.map((n) => n.body)).toEqual(['Carousels bring the most follows']);
  });

  it('a forgotten note is never added again', async () => {
    const [n] = await notes.loadNotes(userId);
    expect(await notes.forgetNote(userId, n!.id)).toBe(true);
    const added = await notes.applyMemoryOps(userId, { ops: { add: [{ type: 'fact', text: 'Carousels bring the most follows', tags: [], confidence: 0.6 }], confirm: [], contradict: [] }, legacy: [], source: 'read' });
    expect(added).toEqual([]);
  });

  it('turns signals into notes once and marks them processed', async () => {
    const diff = { lengthDelta: -5, wordsBefore: 6, wordsAfter: 4, emojiDelta: 0, hashtagDelta: -2, lineBreakDelta: 0, caseChange: 'none', removed: [], added: [] };
    await dbmod.db.insert(schema.aiSignals).values([1, 2].map(() => ({ userId, kind: 'draft_edit', action: 'draft', payload: JSON.stringify({ option: 0, diff, before: 'Tram #lisboa', after: 'Tram' }) })));
    expect(await learn.processSignals(userId, 'en')).toBe(1);
    expect(await learn.processSignals(userId, 'en')).toBe(0);
    const rows = await dbmod.db.select().from(schema.aiNotes).where(eq(schema.aiNotes.userId, userId));
    expect(rows.find((r) => r.body === 'Removes hashtags from drafts')).toMatchObject({ type: 'dislike', origin: 'code' });
  });
});
