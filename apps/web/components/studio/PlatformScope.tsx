'use client';

import { Link } from '@/i18n/navigation';
import { PlatformIcon } from '@/components/PlatformIcon';
import { PLATFORM_NAME } from '@/lib/platform';
import { useShownPlatform } from '@/hooks/useShownPlatform';
import { useStudio } from './StudioContext';
import { getScopeContent, type ScopeFeature } from './platformScope.content';

// A calm note on features that read Instagram data only. On Instagram it is a
// small chip and one line; when the member is looking at Threads or TikTok it
// says what this page does, where their numbers are, and offers the switch.
export function PlatformScope({ feature }: { feature: ScopeFeature }) {
  const { locale, userId } = useStudio();
  const t = getScopeContent(locale);
  const shown = useShownPlatform(userId);
  const line = t.lines[feature];
  if (shown.platform === 'instagram') {
    return (
      <p className="s-scope" aria-label={t.chipLabel}>
        <span className="s-scope-chip"><PlatformIcon platform="instagram" size={12} />{t.chip}</span>
        <span>{line}</span>
      </p>
    );
  }
  const p = PLATFORM_NAME[shown.platform];
  return (
    <div className="s-scope s-scope-away" role="note">
      <span className="s-scope-chip"><PlatformIcon platform="instagram" size={12} />{t.chip}</span>
      <span className="s-scope-t">{t.elsewhere(p, line)}</span>
      {shown.hasData('instagram')
        ? <button type="button" className="s-btn xs" onClick={() => shown.switchTo('instagram')}>{t.switchIg}</button>
        : <Link href="/how-to-export" className="s-btn sec xs">{t.getIg}</Link>}
    </div>
  );
}
