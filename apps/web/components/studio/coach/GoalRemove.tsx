'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { GoalView } from '@/lib/ai/goals';
import { PLATFORM_NAME } from '@/lib/platform';
import { useStudio } from '../StudioContext';
import { StudioDialog } from '../StudioDialog';
import { getGoalsContent } from './goals.content';

// Removes the goal for the platform shown, after a confirm. Other goals stay.
export function GoalRemove({ view, onRemoved }: { view: GoalView; onRemoved: (v: GoalView) => void }) {
  const { locale } = useStudio();
  const P = getGoalsContent(locale).p;
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  async function remove() {
    setBusy(true);
    const r = await fetch(`/api/ai/goal?platform=${view.platform}`, { method: 'DELETE' }).catch(() => null);
    setBusy(false);
    if (r?.ok) { setOpen(false); onRemoved((await r.json()) as GoalView); }
  }
  return (
    <>
      <button type="button" className="s-lnk" style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={() => setOpen(true)}>
        <Trash2 size={13} />{P.remove}
      </button>
      <StudioDialog open={open} onClose={() => setOpen(false)} title={P.remove}>
        <p className="s-sub-t" style={{ margin: '0 0 16px' }}>{P.removeConfirm(PLATFORM_NAME[view.platform])}</p>
        <div className="s-row" style={{ gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" className="s-btn sec" onClick={() => setOpen(false)}>{P.keep}</button>
          <button type="button" className="s-btn" disabled={busy} onClick={() => void remove()}><Trash2 size={14} />{P.remove}</button>
        </div>
      </StudioDialog>
    </>
  );
}
