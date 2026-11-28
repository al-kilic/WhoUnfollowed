import { NextResponse } from 'next/server';
import { aiDraftSchema, aiIdeasSchema, aiInsightsSchema, aiPlanCalendarSchema, aiPlanSchema } from '@ig-tracker/core';
import { calendarFromPlan } from '@/lib/ai/planCalendar';
import { cleanResults, parsePostAdd, parsePostImport, postedMeta } from '@/lib/ai/postedInput';
import { guardProAi, readJson } from '@/lib/ai/guard';
import { logPost, markPosted, planRevisions, planSetupInfo, recentContent, recentContentOf } from '@/lib/ai/store';
import { revisionCost } from '@/lib/ai/planCalendar';
import { PLAN_FREE_REVISIONS } from '@/lib/ai/config';

// Studio lists, newest first. ?kind=check (default): posts checked with the
// coach, for Plan > Posted, without the model output. ?kind=ideas: past idea
// batches for the idea bank. ?kind=plan: the newest 30-day plan.
export async function GET(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  const asked = new URL(req.url).searchParams.get('kind');
  if (asked === 'plan') {
    // The newest 30-day plan, for the Plan calendar.
    const [[row], setup] = await Promise.all([recentContent(g.userId, 'plan', 1), planSetupInfo(g.userId)]);
    const parsed = row ? aiPlanSchema.safeParse(JSON.parse(row.output)) : null;
    if (!row || !parsed?.success) return NextResponse.json({ plan: null, setup });
    // The user's edits, if any; otherwise the calendar straight from the plan.
    const saved = row.results ? aiPlanCalendarSchema.shape.items.safeParse((JSON.parse(row.results) as { calendar?: unknown }).calendar) : null;
    const calendar = saved?.success ? saved.data : calendarFromPlan(parsed.data);
    const revisions = planRevisions(row.results);
    return NextResponse.json({ setup, plan: { id: row.id, createdAt: row.createdAt, data: parsed.data, calendar, revisions, freeRevisionsLeft: Math.max(0, PLAN_FREE_REVISIONS - revisions), nextRevisionCost: revisionCost(revisions) } });
  }
  if (asked === 'draft') {
    // Earlier drafts for Create > Write: the topic and the first option only.
    const rows = await recentContent(g.userId, 'draft', 8);
    return NextResponse.json({
      items: rows.map((r) => {
        const d = aiDraftSchema.safeParse(JSON.parse(r.output));
        return { id: r.id, topic: r.topic, format: r.format, createdAt: r.createdAt, text: d.success ? d.data.options[0]?.text ?? '' : '' };
      }),
    });
  }
  if (asked === 'insights') {
    // Earlier Photo insights runs, newest first, so the page can reopen them.
    const rows = await recentContent(g.userId, 'insights', 10);
    return NextResponse.json({
      items: rows.flatMap((r) => {
        const d = aiInsightsSchema.safeParse(JSON.parse(r.output));
        return d.success ? [{ id: r.id, createdAt: r.createdAt, topic: r.topic, data: d.data }] : [];
      }),
    });
  }
  if (asked === 'ideas') {
    const rows = await recentContent(g.userId, 'ideas', 10);
    return NextResponse.json({
      items: rows.map((r) => {
        const parsed = aiIdeasSchema.safeParse(JSON.parse(r.output));
        return { id: r.id, theme: r.topic, createdAt: r.createdAt, ideas: parsed.success ? parsed.data.ideas : [] };
      }),
    });
  }
  // Plan > Posted: checked posts, plan posts marked as posted, posts logged by
  // hand and posts brought in from Photo insights.
  const rows = await recentContentOf(g.userId, ['check', 'post'], 80);
  return NextResponse.json({
    items: rows.map((r) => {
      const meta = postedMeta(r.kind, r.output);
      return {
        id: r.id, format: r.format, hook: r.topic, score: r.score, createdAt: r.createdAt, postedAt: r.postedAt,
        source: meta.source, planDay: meta.planDay, platform: r.platform ?? 'instagram',
        results: r.results ? (JSON.parse(r.results) as Record<string, number>) : null,
      };
    }),
  });
}

// "I posted this", optionally with how it did. Numbers only.
export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  const body = (await readJson(req)) as { id?: unknown; results?: unknown; add?: unknown; import?: unknown } | null;
  // A post made outside the plan and the checks, logged by hand.
  if (body?.add) {
    const input = parsePostAdd(body.add);
    if (!input) return NextResponse.json({ error: 'invalid' }, { status: 400 });
    const id = await logPost(g.userId, input);
    return NextResponse.json({ ok: true, id });
  }
  // Posts from a Photo insights run, with Instagram's own numbers. Idempotent
  // on each post's key, so importing twice adds nothing.
  if (body?.import) {
    const inputs = parsePostImport(body.import);
    if (!inputs.length) return NextResponse.json({ error: 'invalid' }, { status: 400 });
    const ids: string[] = [];
    for (const input of inputs) ids.push(await logPost(g.userId, input));
    return NextResponse.json({ ok: true, ids });
  }
  if (typeof body?.id !== 'string') return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const results = body.results === null ? null : cleanResults(body.results);
  const ok = await markPosted(g.userId, body.id, results);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'not_found' }, { status: 404 });
}
