'use client';

import type { AiCheck } from '@ig-tracker/core';
import type { Format as AiPostFormat } from './formats';
import { CircleAlert, CircleCheck, CircleX } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getCoachContent } from '@/app/[locale]/coach/content';
import { useStudio } from '../StudioContext';
import { Ring } from '../Ring';
import { getCreateContent } from './create.content';
import { getStudioCoachContent } from './studioCoach.content';
import { CoachSeen, type Seen } from './CoachSeen';
import { PlanDayHandoff } from './PlanDayHandoff';
import { AnswerThumbs } from './AnswerThumbs';
import { sendSignal } from '@/lib/ai/signalClient';

// The coach's verdict on a checked draft: score, the six criteria, fixes,
// stronger hooks, a better caption, and the way on to the plan.
const level = (score: number) => (score >= 7 ? 'good' : score >= 4 ? 'warn' : 'bad');
const LevelIcon = ({ lv }: { lv: 'good' | 'warn' | 'bad' }) => (lv === 'good' ? <CircleCheck size={17} /> : lv === 'bad' ? <CircleX size={17} /> : <CircleAlert size={17} />);

export function CheckResult({ d, onHook, onCaption, seen, post, logId = null }: { d: AiCheck; onHook: (h: string) => void; onCaption: (c: string) => void; seen: Seen | null; post: { format: AiPostFormat; hook: string; caption: string }; logId?: string | null }) {
  const { locale } = useStudio();
  const c = getCoachContent(locale);
  const k = getCreateContent(locale).k;
  const left = d.scores.filter((s) => s.score < 7).length;
  const color = d.overall >= 80 ? 'var(--good)' : d.overall >= 50 ? 'var(--warn)' : 'var(--bad)';
  return (
    <section className="s-card">
      <div className="s-pad s-row" style={{ gap: 16 }}>
        <Ring pct={d.overall} size={84} stroke={9} color={color} label={`${d.overall} / 100`}><b style={{ fontSize: 22 }}>{d.overall}</b></Ring>
        <div><h2 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>{left ? k.fixesLeft(left) : k.ready}</h2><span className="s-sub-t">{k.outOf}</span></div>
      </div>
      {d.scores.map((s) => (
        <div key={s.criterion} className="s-find">
          <span className={`s-si ${level(s.score)}`}><LevelIcon lv={level(s.score)} /></span>
          <div><h3 className="s-h3">{c.check.criteria[s.criterion]}</h3><p>{s.reason}</p></div>
          <span className="s-sub-t" style={{ fontWeight: 600 }}>{s.score}/10</span>
        </div>
      ))}
      {d.fixes.length > 0 && <div className="s-pad" style={{ borderTop: '1px solid var(--line)' }}><span className="s-lab">{c.check.fixes}</span>
        <ol style={{ margin: '6px 0 0', paddingLeft: 18, display: 'grid', gap: 6 }}>{d.fixes.map((f) => <li key={f.what}><b style={{ fontWeight: 600 }}>{f.what}.</b> <span className="s-sub-t">{f.why}</span></li>)}</ol></div>}
      {d.altHooks.length > 0 && <div className="s-pad s-col" style={{ gap: 8, borderTop: '1px solid var(--line)' }}><span className="s-lab">{k.altHooks}</span>
        {d.altHooks.map((h) => <div key={h} className="s-row" style={{ justifyContent: 'space-between', gap: 10 }}><span>&ldquo;{h}&rdquo;</span><button type="button" className="s-btn sec xs" onClick={() => { sendSignal({ kind: 'hook_used', action: 'check', contentLogId: logId && /^[0-9a-f-]{36}$/i.test(logId) ? logId : null, text: h.slice(0, 300) }); onHook(h); }}>{k.useHook}</button></div>)}</div>}
      {d.caption && <div className="s-pad s-col" style={{ gap: 8, borderTop: '1px solid var(--line)' }}><span className="s-lab">{k.newCaption}</span>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}><span className="s-mark good">{d.caption}</span></p>
        <button type="button" className="s-btn sec xs" style={{ alignSelf: 'flex-start' }} onClick={() => onCaption(d.caption)}>{k.useCaption}</button></div>}
      {d.cover.length > 0 && <div className="s-pad" style={{ borderTop: '1px solid var(--line)' }}><span className="s-lab">{k.cover}</span>
        <ul style={{ margin: '6px 0 0', paddingLeft: 18, color: 'var(--mute)' }}>{d.cover.map((n) => <li key={n}>{n}</li>)}</ul></div>}
      <div className="s-pad s-row" style={{ borderTop: '1px solid var(--line)', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <PlanDayHandoff format={post.format} hook={post.hook} caption={post.caption} />
        <span className="s-sub-t">{k.resultsSaved} <Link href="/app/plan/posted" className="s-lnk">{getStudioCoachContent(locale).posted.addResults}</Link></span>
      </div>
      <div className="s-pad s-col" style={{ paddingTop: 0, gap: 10 }}><CoachSeen seen={seen} /><AnswerThumbs action="check" logId={logId} /></div>
    </section>
  );
}
