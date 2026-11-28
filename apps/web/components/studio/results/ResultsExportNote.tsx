'use client';

import { useEffect, useMemo, useState } from 'react';
import { detectDeltaExport, type ParsedSnapshot } from '@ig-tracker/core';
import { ChevronDown, Info, TriangleAlert, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PLATFORM_NAME, snapshotPlatform } from '@/lib/platform';
import { useStudio } from '../StudioContext';
import { getResultsContent } from './results.content';

// The lists come from the platform's own export, and a short date range or a
// scheduled export leaves people out. Shown above the lists in the brand
// orange; a stronger version when this export looks partial. Hidden for good
// for this one export once dismissed (remembered in this browser).
const keyOf = (s: ParsedSnapshot) => `wu-xnote:${snapshotPlatform(s)}:${s.exportedAt}`;

export function ResultsExportNote({ snapshot, previous }: { snapshot: ParsedSnapshot; previous?: ParsedSnapshot | undefined }) {
  const { locale } = useStudio();
  const t = getResultsContent(locale).exportNote;
  const app = PLATFORM_NAME[snapshotPlatform(snapshot)];
  const partial = useMemo(() => detectDeltaExport(snapshot, previous).isDelta, [snapshot, previous]);
  const key = keyOf(snapshot);
  const [hidden, setHidden] = useState(true);
  const [open, setOpen] = useState(false);
  useEffect(() => { try { setHidden(localStorage.getItem(key) === '1'); } catch { setHidden(false); } setOpen(false); }, [key]);
  if (hidden) return null;
  const hide = () => { setHidden(true); try { localStorage.setItem(key, '1'); } catch { /* shown again next visit */ } };
  return (
    <section className={`s-xnote${partial ? ' warn' : ''}`} aria-labelledby="xnote-h">
      <span className="s-xnote-ic" aria-hidden="true">{partial ? <TriangleAlert size={16} /> : <Info size={16} />}</span>
      <div className="s-xnote-body">
        <p id="xnote-h" className="s-xnote-t">{partial ? t.partialTitle : t.title}</p>
        <p className="s-xnote-lead">{t.source(app)} {partial ? t.partial : t.info}</p>
        {open && (
          <ul className="s-xnote-why">
            {t.reasons.map((r) => <li key={r.label}><b>{r.label}</b><span>{r.detail(app)}</span></li>)}
          </ul>
        )}
        <div className="s-xnote-acts">
          <button type="button" className="s-xnote-more" aria-expanded={open} onClick={() => setOpen((v) => !v)}>{t.why}<ChevronDown size={14} aria-hidden="true" /></button>
          <Link href="/how-to-export">{t.how}</Link>
        </div>
      </div>
      <button type="button" className="s-xnote-x" aria-label={t.dismiss} title={t.dismiss} onClick={hide}><X size={16} /></button>
    </section>
  );
}
