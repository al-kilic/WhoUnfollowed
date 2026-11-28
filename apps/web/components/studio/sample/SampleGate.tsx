'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, FlaskConical, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { trackSample, useSampleStore, type SampleEntry } from '@/lib/sample/sampleMode';
import { useSnapshotList } from '@/hooks/useSnapshots';
import { useStudio } from '../StudioContext';
import { StudioLoading } from '../StudioStates';
import { getSampleContent } from './sample.content';
import { SampleEnding } from './SampleEnding';

const ENTRIES: SampleEntry[] = ['home', 'empty', 'results', 'url'];
// The member's own settings: they keep showing the real account in sample mode.
const OWN_PAGES = ['/app/you'];

function Banner() {
  const { locale } = useStudio();
  const t = getSampleContent(locale);
  const exit = useSampleStore((s) => s.exit);
  return (
    <div className="s-sample-bar" role="status">
      <span className="s-badge tone-acc"><FlaskConical size={12} />{t.tag}</span>
      <span className="s-grow">{t.banner}</span>
      <Link href="/#upload" className="s-btn xs" onClick={exit}>{t.useMine}</Link>
      <button type="button" className="s-btn sec xs" onClick={exit} aria-label={t.exit} title={t.exit}><X size={14} /></button>
    </div>
  );
}

// Members who already have exports don't need the "request your export"
// steps: they get a way back to their own data instead.
function Ending() {
  const { locale, userId } = useStudio();
  const own = useSnapshotList(userId);
  const exit = useSampleStore((s) => s.exit);
  if (own.length === 0) return <SampleEnding />;
  return (
    <div className="s-row" style={{ justifyContent: 'center' }}>
      <Link href="/app/results" className="s-btn sec" onClick={exit}>{getSampleContent(locale).back}<ArrowRight size={14} /></Link>
    </div>
  );
}

// Wraps every Studio page. Turns sample mode on from ?sample=1 (or picks it
// back up after a reload) and shows the banner. Every page then renders its
// real screen on the made-up account: Results, Radar and History read the
// sample's three exports, and the coach pages are answered in the browser
// (lib/sample/sampleIntercept.ts), so nothing calls the AI API or is saved.
export function SampleGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const on = useSampleStore((s) => s.on);
  const path = usePathname();
  const { locale } = useStudio();

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const st = useSampleStore.getState();
    if (q.get('sample') === '1') {
      const from = q.get('from') as SampleEntry | null;
      st.enter(from && ENTRIES.includes(from) ? from : 'url');
      q.delete('sample'); q.delete('from');
      const rest = q.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${rest ? `?${rest}` : ''}`);
    } else st.resume();
    setReady(true);
  }, []);

  useEffect(() => {
    if (on) trackSample('Sample Screen', { screen: path.replace(/^\/app\/?/, '') || 'today' });
  }, [on, path]);

  if (!ready) return <StudioLoading />;
  if (!on) return <>{children}</>;
  // You > Memory shows the sample's memory, so it isn't an own page.
  const own = OWN_PAGES.some((p) => path.startsWith(p)) && !path.includes('/app/you/memory');
  return (
    <>
      <Banner />
      {own && <p className="s-sub-t" style={{ margin: '0 0 12px', fontSize: 13 }}>{getSampleContent(locale).ownSettings}</p>}
      {children}
      {!own && <div style={{ marginTop: 24 }}><Ending /></div>}
    </>
  );
}
