'use client';

import { isSampleOn } from '@/lib/sample/sampleMode';
import { useCallback, useEffect, useState } from 'react';
import type { AiIdeas } from '@ig-tracker/core';
import { Bookmark, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getCoachContent } from '@/app/[locale]/coach/content';
import { postAction } from '@/app/[locale]/coach/api';
import { CoachSeen, type Seen } from './CoachSeen';
import { getSampleSeen } from '@/lib/sample/coach/seen';
import { AddedToMemory } from '@/app/[locale]/coach/ui';
import { useStudio } from '../StudioContext';
import { CoachGate } from './CoachGate';
import { FORMAT_ICON, FormatBadge, FORMATS, Seg, type Format } from './formats';
import { getCreateContent } from './create.content';
import { getStudioCoachContent } from './studioCoach.content';
import { Blur, ProPreview } from './ProPreview';
import { AiError } from './AiError';
import { IdeasEmpty } from './CreateEmpty';

type Idea = AiIdeas['ideas'][number];
type Filter = 'all' | Format | 'saved';
const SAVED = 'wu:saved-ideas';

// Saved ideas stay in this browser.
function useSaved() {
  const [saved, setSaved] = useState<Set<string>>(new Set());
  useEffect(() => { if (isSampleOn()) return; try { setSaved(new Set(JSON.parse(localStorage.getItem(SAVED) ?? '[]') as string[])); } catch { /* none */ } }, []);
  const toggle = (idea: string) => setSaved((s) => {
    const n = new Set(s);
    if (n.has(idea)) n.delete(idea); else n.add(idea);
    // The sample account's ideas are never saved.
    if (!isSampleOn()) { try { localStorage.setItem(SAVED, JSON.stringify([...n])); } catch { /* private mode */ } }
    return n;
  });
  return { saved, toggle };
}

function IdeaCard({ idea, saved, onSave, locked }: { idea: Idea; saved: boolean; onSave: () => void; locked: boolean }) {
  const { locale } = useStudio();
  const i = getCreateContent(locale).i;
  const Ic = FORMAT_ICON[idea.format];
  return (
    <section className="s-card s-idea s-glow" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={`s-noimg f-${idea.format}`}><Ic size={26} /></div>
      <div className="b">
        <div className="s-row" style={{ justifyContent: 'space-between' }}>
          <FormatBadge format={idea.format} />
          {!locked && <button type="button" className="s-btn sec xs" aria-pressed={saved} aria-label={saved ? i.unsave : i.save} onClick={onSave}><Bookmark size={14} style={saved ? { fill: 'currentColor' } : undefined} /></button>}
        </div>
        <h2>{locked ? <Blur>{idea.idea}</Blur> : idea.idea}</h2>
        <span>{locked ? <Blur>{idea.hook}</Blur> : <>&ldquo;{idea.hook}&rdquo;</>}</span>
        <div className="s-row" style={{ justifyContent: 'space-between', marginTop: 'auto', gap: 10 }}>
          <span className="s-sub-t">{locked ? <Blur>{idea.why}</Blur> : idea.why}</span>
          {!locked && <Link href={`/app/create?topic=${encodeURIComponent(idea.idea)}&format=${idea.format}`} className="s-btn sec xs" style={{ flex: 'none' }}>{i.write}</Link>}
        </div>
      </div>
    </section>
  );
}

function Bank() {
  const { locale } = useStudio();
  const c = getCoachContent(locale);
  const i = getCreateContent(locale).i;
  const [ideas, setIdeas] = useState<Idea[] | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<string[]>([]);
  const [seenCtx, setSeenCtx] = useState<Seen | null>(() => (isSampleOn() ? getSampleSeen() : null));
  const { saved, toggle } = useSaved();

  const load = useCallback(async () => {
    const r = await fetch('/api/ai/content?kind=ideas', { cache: 'no-store' }).catch(() => null);
    const items = r?.ok ? ((await r.json()) as { items: { ideas: Idea[] }[] }).items : [];
    const seen = new Set<string>();
    setIdeas(items.flatMap((b) => b.ideas).filter((x) => (seen.has(x.idea) ? false : (seen.add(x.idea), true))));
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function more() {
    setBusy(true); setError(null);
    const res = await postAction<AiIdeas>('/api/ai/ideas', { theme: '', locale });
    setBusy(false);
    if (!res.ok) { setError(c.errors[res.error as keyof typeof c.errors] ?? c.errors.failed); return; }
    setAdded(res.added);
    setSeenCtx(res.seen ?? null);
    void load();
  }

  const list = (ideas ?? []).filter((x) => filter === 'all' || (filter === 'saved' ? saved.has(x.idea) : x.format === filter));
  return (
    <>
      <div className="s-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <Seg value={filter} onChange={setFilter} label={i.all} options={[{ value: 'all', label: i.all }, ...FORMATS.map((f) => ({ value: f, label: c.formats[f] })), { value: 'saved', label: i.saved }]} />
        {ideas?.length !== 0 && <button type="button" className="s-btn" disabled={busy} onClick={() => void more()}><Sparkles size={14} />{busy ? c.working : i.more}</button>}
      </div>
      <AiError text={error} />
      <AddedToMemory lines={added} title={c.addedToMemory} />
      <CoachSeen seen={seenCtx} />
      {ideas && (list.length ? (
        <div className="s-grid s-g3">{list.map((x) => <IdeaCard key={x.idea} idea={x} saved={saved.has(x.idea)} onSave={() => toggle(x.idea)} locked={false} />)}</div>
      ) : ideas.length === 0 ? <IdeasEmpty busy={busy} onAsk={() => void more()} />
        : <p className="s-sub-t">{i.nothingSaved}</p>)}
    </>
  );
}

// Studio > Create > Ideas.
export function IdeasPage() {
  const { c: sc, locale } = useStudio();
  const i = getCreateContent(locale).i;
  const k = getStudioCoachContent(locale);
  return (
    <CoachGate title={sc.nav.ideas} sub={i.sub} feature="create">
      {(state) => state ? <Bank /> : (
        <>
          <ProPreview feature="create" kind="ideas" wide />
          <div className="s-grid s-g3">
            {(['reel', 'carousel', 'photo'] as const).map((f, n) => (
              <IdeaCard key={f} locked saved={false} onSave={() => undefined} idea={{ format: f, idea: k.examplePlan[n]!, hook: k.exampleDraft.text, why: k.exampleDraft.why }} />
            ))}
          </div>
        </>
      )}
    </CoachGate>
  );
}
