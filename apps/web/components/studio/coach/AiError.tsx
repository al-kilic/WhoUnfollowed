'use client';

import { Link } from '@/i18n/navigation';
import { getCoachContent } from '@/app/[locale]/coach/content';
import { TOPUP_PRICE_USD } from '@/lib/pricing';
import { useStudio } from '../StudioContext';
import { getStudioCoachContent } from './studioCoach.content';
import { getStudioContent } from '../studio.content';

// An AI action's error line. When this month's coach is used up and a refill
// can be bought, it also links to where it is added (You > billing). A failed
// or paused coach also says Pro AI is in beta (founder, 2026-11-27).
export function AiError({ text, style }: { text: string | null; style?: React.CSSProperties }) {
  const { locale, coach } = useStudio();
  const c = getCoachContent(locale);
  const u = getStudioCoachContent(locale).usage;
  if (!text) return null;
  const refill = text === c.errors.allowance_empty && coach.state?.allowance?.refills.canBuy;
  const beta = text === c.errors.failed || text === c.errors.paused;
  return (
    <p role="alert" className="s-row" style={{ margin: 0, color: 'var(--bad)', fontSize: 13, gap: 10, flexWrap: 'wrap', ...style }}>
      <span style={{ flex: '1 1 200px' }}>{text}</span>
      {refill && <Link href="/app/you" className="s-btn xs">{u.refill(`$${TOPUP_PRICE_USD}`)}</Link>}
      {beta && <span style={{ flexBasis: '100%', color: 'var(--mute)' }}>{getStudioContent(locale).betaHint}</span>}
    </p>
  );
}
