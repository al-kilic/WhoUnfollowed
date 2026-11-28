import { sampleResponses } from './coach';
import type { AiChat } from '@ig-tracker/core';
import { staticAskAnswer } from '@/components/studio/coach/askAnswers.content';
import { MOCK_PHOTO_STYLE } from '@/lib/ai/mocks';
import { getSampleSeen } from './coach/seen';
import { getSampleContentStats, getSampleInsights, getSampleLearned, getSampleLedger, getSampleMoments, getSampleNotes, getSampleVoice } from './learned';

// The sample account's answers to the coach API, built in the browser. Loaded
// only when sample mode actually calls /api/ai/* (see sampleIntercept.ts).
// Writes (marking a post, editing a goal, saving the calendar) answer "ok" and
// are dropped, so the screens behave without storing anything.

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const ok = <T>(data: T) => json({ ok: true, data, added: [], balance: 186, logId: 'sample', mocked: true, left: 17, seen: getSampleSeen() });

// The answer for one coach API call.
export function sampleAnswer(url: URL, method: string, locale: string, now: Date = new Date(), body?: string): Response {
  const r = sampleResponses(locale, now);
  const route = url.pathname.slice('/api/ai/'.length).replace(/\/$/, '');
  const get = method === 'GET';
  switch (route) {
    case 'state': return json(r.state);
    case 'content': {
      if (!get) return json({ ok: true, id: 'sample' });
      const kind = url.searchParams.get('kind');
      return json(kind === 'plan' ? r.plan : kind === 'draft' ? r.drafts : kind === 'ideas' ? r.ideas : r.posted);
    }
    case 'goal': return json(get && url.searchParams.get('platform') === 'threads' ? r.goalThreads : r.goal);
    case 'memory': return get ? json(r.memory) : json({ ok: true, version: 1 });
    case 'credits': return json(r.credits);
    case 'prefs': return json(r.prefs);
    case 'read': return ok(r.actions.read);
    case 'draft': return ok(r.actions.draft);
    case 'check': return ok(r.actions.check);
    case 'ideas': return ok(r.actions.ideas);
    case 'plan': case 'plan/revise': return ok(r.actions.plan);
    case 'plan/calendar': return json({ ok: true });
    case 'chat': return ok(sampleChat(r.actions.chat, locale, body));
    case 'insights': return ok(r.actions.insights);
    // Photo style: a written example, nothing sent, nothing saved.
    case 'photo-style': return json({ ok: true, data: MOCK_PHOTO_STYLE, added: [], balance: 0, logId: '', mocked: true, saved: 0 });
    case 'onboarding': case 'stats': return json({ ok: true, isNew: false });
    // You > Memory: the sample's notes, weekly notes and moments. Pin, edit
    // and forget answer "ok" and only change the screen.
    case 'notes': return get ? json(getSampleNotes(locale)) : json({ ok: true });
    case 'learned': return get ? json(getSampleLearned(locale)) : json({ ok: true });
    case 'moments': return json(getSampleMoments());
    case 'voice': return get ? json({ voice: { stats: getSampleVoice() } }) : json({ ok: true, saved: 0 });
    case 'content-stats': {
      if (!get) return json({ ok: true, saved: 0 });
      const l = getSampleLedger();
      return json({ stats: getSampleContentStats(), insights: getSampleInsights(), ledger: { avgAll: l.avgAll, posts: l.posts.length, formats: l.formats, topics: l.topics } });
    }
    // Blind-spot card state stays in the tab for the sample.
    case 'blindspots': return get ? json({ state: null }) : json({ ok: true });
    // What the member did with an answer: never saved for the sample.
    case 'signal': return json({ ok: true, saved: 0 });
    // Anything else under /api/ai: never sent while the sample is on.
    default: return json({ error: 'sample' }, 404);
  }
}

// Ask coach in sample mode: a starter question gets its own written answer;
// anything else gets the general sample answer.
function sampleChat(fallback: AiChat, locale: string, body?: string): AiChat {
  try {
    const msgs = (JSON.parse(body ?? '{}') as { messages?: { role: string; text: string }[] }).messages ?? [];
    const q = [...msgs].reverse().find((m) => m.role === 'user')?.text ?? '';
    const hit = staticAskAnswer(locale, q);
    return hit ? { ...fallback, ...hit } : fallback;
  } catch { return fallback; }
}
