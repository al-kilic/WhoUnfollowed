'use client';

import { useState } from 'react';
import { Download, Lock, Trash2 } from 'lucide-react';
import { getCoachContent } from '@/app/[locale]/coach/content';
import { useSampleOn } from '@/lib/sample/sampleMode';
import { useMemoryNotes } from '@/hooks/useMemoryNotes';
import { useStudio } from '../StudioContext';
import { PageHead } from '../PageHead';
import { LockBar } from '../Lock';
import { getStudioCoachContent } from '../coach/studioCoach.content';
import { getMemoryContent, type MemoryTab } from './memory/memory.content';
import { MemoryNotesTab } from './memory/MemoryNotesTab';
import { MemoryArchiveTab, MemoryLearnedTab, MemoryTimelineTab } from './memory/MemoryOtherTabs';
import { AboutMe } from './memory/AboutMe';
import { TeachCoach } from './memory/TeachCoach';
import { grouped } from './memory/memoryTypes';
import { getYouContent } from './you.content';

const TABS: MemoryTab[] = ['notes', 'timeline', 'learned', 'archive'];

// Studio > You > Memory: everything the coach remembers, in notes the member
// can pin, edit or forget, plus the timeline, the weekly learned notes and
// the archive. In sample mode it shows the sample account, and changes stay
// on this screen.
export function MemoryPage() {
  const { locale, hasProAi } = useStudio();
  const t = getMemoryContent(locale);
  if (!hasProAi) {
    return <><PageHead title={t.title} sub={t.intro} /><LockBar feature="coach" text={getStudioCoachContent(locale).you.memoryBody} /></>;
  }
  return <><PageHead title={t.title} sub={t.intro} /><MemoryBody /></>;
}

function MemoryBody() {
  const { locale } = useStudio();
  const t = getMemoryContent(locale);
  const sample = useSampleOn();
  const { data, learned, moments, act } = useMemoryNotes();
  const [tab, setTab] = useState<MemoryTab>('notes');

  // Everything the coach keeps: notes, weekly notes, moments, the voice
  // profile, posting history and Instagram's numbers from the export.
  const download = async () => {
    const get = (url: string) => fetch(url, { cache: 'no-store' }).then((r) => (r.ok ? r.json() as Promise<unknown> : null)).catch(() => null);
    const [voice, content] = sample ? [null, null] : await Promise.all([get('/api/ai/voice'), get('/api/ai/content-stats?platform=instagram')]);
    const blob = new Blob([JSON.stringify({ notes: data?.notes ?? [], disputed: data?.disputed ?? [], learned: learned ?? [], moments: moments ?? [], voice, content }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'whounfollowed-memory.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  return (
    <div className="s-col" style={{ gap: 14 }}>
      {sample && <div className="s-sampbar" role="status"><Lock size={13} />{t.sampleBanner}</div>}
      <div className="s-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div className="s-seg" role="tablist" aria-label={t.title}>
          {TABS.map((k) => <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? 'on' : undefined} onClick={() => setTab(k)}>{t.tabs[k]}</button>)}
        </div>
        <button type="button" className="s-btn sec xs" disabled={!data} onClick={() => void download()}><Download size={13} />{t.download}</button>
      </div>
      {data && tab === 'notes' && <TeachCoach voiceLearned={grouped(data.notes).voice.length > 0} photoLearned={grouped(data.notes).photos.length > 0} />}
      {data === undefined && <div className="s-card s-pad"><span className="s-shim" style={{ width: '60%' }} aria-label={t.loading} /></div>}
      {data === null && <p className="s-card s-pad" role="alert" style={{ margin: 0, color: 'var(--bad)' }}>{t.failed}</p>}
      {data && tab === 'notes' && <><AboutMe /><MemoryNotesTab data={data} act={act} /></>}
      {tab === 'timeline' && <MemoryTimelineTab moments={moments} />}
      {tab === 'learned' && <MemoryLearnedTab weeks={learned} />}
      {data && tab === 'archive' && <MemoryArchiveTab notes={data.notes} act={act} />}
      <WipeAll />
    </div>
  );
}

// The existing "Delete everything" for memory.
function WipeAll() {
  const { locale } = useStudio();
  const m = getCoachContent(locale).memory;
  const never = getYouContent(locale).mem.never;
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const wipe = async () => {
    const r = await fetch('/api/ai/memory', { method: 'DELETE' }).catch(() => null);
    setConfirm(false);
    if (r?.ok) { setDone(true); setTimeout(() => window.location.reload(), 600); }
  };
  return (
    <div className="s-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, paddingTop: 4 }}>
      <span className="s-sub-t s-row" style={{ gap: 6, fontSize: 12.5 }}><Lock size={12} />{never}</span>
      {done ? <span role="status" style={{ fontSize: 13, color: 'var(--good)' }}>{m.wiped}</span> : confirm
        ? <span className="s-row" style={{ gap: 8 }}><span className="s-sub-t" style={{ fontSize: 13 }}>{m.wipeConfirm}</span><button type="button" className="s-btn xs" style={{ background: 'var(--bad)', color: '#fff' }} onClick={() => void wipe()}>{m.wipeYes}</button><button type="button" className="s-btn sec xs" onClick={() => setConfirm(false)}>{m.wipeNo}</button></span>
        : <button type="button" className="s-btn sec xs" style={{ color: 'var(--bad)' }} onClick={() => setConfirm(true)}><Trash2 size={13} />{m.wipe}</button>}
    </div>
  );
}
