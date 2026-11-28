import { NextResponse } from 'next/server';
import { exportStatsSchema } from '@ig-tracker/core';
import { actionResponse, guardProAi, localeOf, needsOnboarding, readJson } from '@/lib/ai/guard';
import { saveExportStats } from '@/lib/ai/store';
import { readStatus, runRead } from '@/lib/ai/actions';
import { refreshLedgerNotes } from '@/lib/ai/memoryData';
import { runDigest } from '@/lib/ai/digest';

// One export's numbers (computed in the browser, no usernames). A new export
// gets the coach read when it is free; otherwise the answer says what a read
// would cost (or that the next one is tomorrow) and /api/ai/read runs it on request.
export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!g.onboarded) return needsOnboarding();
  const body = (await readJson(req)) as { stats?: unknown; locale?: unknown } | null;
  const parsed = exportStatsSchema.safeParse(body?.stats);
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const isNew = await saveExportStats(g.userId, parsed.data);
  if (!isNew) return NextResponse.json({ ok: true, isNew: false });
  // A new export: what worked as notes (code), then the coach's tidy-up pass,
  // at most once per export and only when enough changed. In the background.
  const locale = localeOf(body?.locale);
  void refreshLedgerNotes(g.userId, parsed.data.platform, locale)
    .then(() => runDigest(g.userId, String(parsed.data.exportedAt), locale))
    .catch(() => undefined);
  const status = await readStatus(g.userId, parsed.data.platform);
  if (status.kind !== 'free') return NextResponse.json({ ok: true, isNew: true, read: status });
  return actionResponse(await runRead(g.userId, parsed.data.platform, localeOf(body?.locale)));
}
