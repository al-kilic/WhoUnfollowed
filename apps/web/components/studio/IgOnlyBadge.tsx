'use client';

import { useState } from 'react';
import { Popover } from '@base-ui/react/popover';
import { Link } from '@/i18n/navigation';
import { PlatformIcon } from '@/components/PlatformIcon';
import { PLATFORM_NAME } from '@/lib/platform';
import { useShownPlatform } from '@/hooks/useShownPlatform';
import { useStudio } from './StudioContext';
import { getScopeContent, type ScopeFeature } from './platformScope.content';

// "Instagram only": a small pill for features that read Instagram data only
// (it replaces the old line under the page title). Hover, focus or tap shows
// what the page reads, what works on Threads and TikTok, and the switch.
export function IgOnlyBadge({ feature }: { feature: ScopeFeature }) {
  const { locale, userId, portal } = useStudio();
  const t = getScopeContent(locale);
  const shown = useShownPlatform(userId);
  const [open, setOpen] = useState(false);
  const away = shown.platform !== 'instagram';
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className={`s-igonly${away ? ' away' : ''}`} openOnHover delay={250} closeDelay={150} data-testid="ig-only"
        onFocus={(e) => { if (e.currentTarget.matches(':focus-visible')) setOpen(true); }}>
        <PlatformIcon platform="instagram" size={12} /><span>{t.badge}</span>
      </Popover.Trigger>
      <Popover.Portal container={portal}>
        <Popover.Positioner side="bottom" align="start" sideOffset={8} collisionPadding={12} className="s-guide-pos">
          <Popover.Popup className="s-guide s-igonly-card">
            <Popover.Title className="s-guide-title" style={{ marginTop: 0 }}>{t.chipLabel}</Popover.Title>
            <Popover.Description className="s-guide-lead">
              {away ? t.elsewhere(PLATFORM_NAME[shown.platform], t.lines[feature]) : t.lines[feature]}
            </Popover.Description>
            {!away && <p className="s-guide-lead" style={{ marginTop: 6 }}>{t.others}</p>}
            {away && (
              <div style={{ marginTop: 12 }}>
                {shown.hasData('instagram')
                  ? <button type="button" className="s-btn xs" onClick={() => { shown.switchTo('instagram'); setOpen(false); }}>{t.switchIg}</button>
                  : <Link href="/how-to-export" className="s-btn sec xs">{t.getIg}</Link>}
              </div>
            )}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
