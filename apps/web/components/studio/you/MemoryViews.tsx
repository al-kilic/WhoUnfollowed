'use client';

import { ArrowRight, Lock, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useMemoryNotes } from '@/hooks/useMemoryNotes';
import { useStudio } from '../StudioContext';
import { getYouContent } from './you.content';
import { getMemoryContent } from './memory/memory.content';
import { GROUPS, grouped } from './memory/memoryTypes';

// Settings: a light read of memory (how many notes per group, and this week's
// learned note) with a way to the full page.
export function MemorySummary() {
  const { locale } = useStudio();
  const t = getMemoryContent(locale);
  const never = getYouContent(locale).mem.never;
  const { data, learned } = useMemoryNotes();
  if (data === undefined) return <div className="s-pad"><span className="s-shim" style={{ width: '60%' }} /></div>;
  const groups = grouped(data?.notes ?? []);
  const total = GROUPS.reduce((n, g) => n + groups[g].length, 0);
  const latest = [...(learned ?? [])].sort((a, b) => b.weekKey.localeCompare(a.weekKey))[0];
  return (
    <>
      <div className="s-pad s-col" style={{ gap: 12 }}>
        <div className="s-row" style={{ gap: 6, flexWrap: 'wrap' }}>
          <b style={{ fontWeight: 600, marginRight: 4 }}>{t.summary.notes(total)}</b>
          {GROUPS.filter((g) => groups[g].length).map((g) => <span key={g} className="s-memchip">{t.groups[g]} · {groups[g].length}</span>)}
        </div>
        {latest?.lines[0]
          ? <div className="s-row" style={{ gap: 8, alignItems: 'flex-start' }}><Sparkles size={14} style={{ color: 'var(--accent)', marginTop: 2, flex: 'none' }} /><span className="s-sub-t" style={{ fontSize: 13 }}><b style={{ color: 'var(--ink)', fontWeight: 600 }}>{t.summary.learned}:</b> {latest.lines[0].text}</span></div>
          : !total && <span className="s-sub-t" style={{ fontSize: 13 }}>{t.summary.none}</span>}
      </div>
      <div className="s-pad s-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, borderTop: '1px solid var(--line)' }}>
        <span className="s-sub-t s-row" style={{ gap: 6, fontSize: 12.5 }}><Lock size={12} />{never}</span>
        <Link href="/app/you/memory" className="s-btn sec xs">{t.summary.open}<ArrowRight size={13} /></Link>
      </div>
    </>
  );
}
