'use client';

import { Sparkles } from 'lucide-react';
import { getYouContent } from './you/you.content';
import { useStudio } from './StudioContext';

// For people on the old Pro (one-time unlock): they keep what they bought and
// a small gift of coach use; this is the one place that offers Pro AI.
// Opens the upgrade sheet, never on its own.
export function UpgradeProCard({ compact = false }: { compact?: boolean }) {
  const { c, tier, locale, openUpgrade } = useStudio();
  if (tier !== 'pro') return null;
  return (
    <div className={compact ? 's-cr' : 's-card s-pad s-row'} style={compact ? undefined : { justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
      <span className="s-col" style={{ gap: 2 }}>
        <b style={{ fontWeight: 600, fontSize: 13.5 }}>{c.upgradePro.title}</b>
        <span className="s-sub-t" style={{ fontSize: 12.5 }}>{getYouContent(locale).upgradeProBody}</span>
      </span>
      <button type="button" className={`s-btn acc ${compact ? 'xs' : ''}`} onClick={() => openUpgrade('coach')}><Sparkles size={13} />{c.upgradePro.cta}</button>
    </div>
  );
}
