'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { Menu, X, ArrowLeft, Home, PanelLeftClose, PanelLeftOpen, UserRound } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/components/AuthProvider';
import { useStudio } from './StudioContext';
import { StudioNav } from './StudioNav';
import { UpgradeProCard } from './UpgradeProCard';
import { UsageNote } from './coach/UsageNote';
import { Avatar } from './you/YouAvatar';
import { SampleGate } from './sample/SampleGate';

type Nav = { onNavigate?: (() => void) | undefined };
const SIDE_KEY = 'wu:studio-side';

function Brand({ onNavigate }: Nav) {
  const { c } = useStudio();
  return (
    <Link href="/" onClick={onNavigate} className="s-brand" aria-label={c.homeLabel} title={c.homeLabel}>
      <span className="s-brand-mark" aria-hidden="true">
        <Image src="/logo.png" alt="" width={24} height={24} />
        <span className="s-brand-home"><Home size={14} /></span>
      </span>
      <span className="s-nl s-brand-txt" aria-hidden="true"><span className="s-brand-a">{c.name}</span><span className="s-brand-b">{c.homeLabel}</span></span>
    </Link>
  );
}

function Account({ onNavigate }: Nav) {
  const { c, tier } = useStudio();
  const { userEmail } = useAuth();
  const plan = tier === 'proAi' ? c.plan.proAi : tier === 'pro' ? c.plan.pro : c.plan.free;
  return (
    <Link href="/app/you" onClick={onNavigate} className="s-acct">
      {tier === 'anon' ? <span className="s-av"><UserRound size={15} /></span> : <span className="s-av ph"><Avatar size={28} /></span>}
      <span className="s-nl" style={{ minWidth: 0 }}><b>{userEmail ?? c.notSignedIn}</b><small>{plan}</small></span>
    </Link>
  );
}

function Sidebar({ onNavigate, mini, onToggle }: Nav & { mini?: boolean; onToggle?: () => void }) {
  const { c, tier } = useStudio();
  return (
    <aside className="s-side">
      <div className="s-row" style={{ justifyContent: 'space-between', gap: 4 }}>
        <Brand onNavigate={onNavigate} />
        {onToggle && (
          <button type="button" className="s-sidetog" onClick={onToggle} aria-label={mini ? c.expandNav : c.collapseNav} title={mini ? c.expandNav : c.collapseNav} aria-expanded={!mini}>
            {mini ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        )}
      </div>
      <Account onNavigate={onNavigate} />
      <StudioNav onNavigate={onNavigate} />
      <div className="s-sidefoot">
        <UpgradeProCard compact />
        {tier === 'anon' && <Link href="/signup" onClick={onNavigate} className="s-btn sec wide">{c.saveStudio}</Link>}
        <div className="s-sideft">
          <Link href="/" className="s-row" style={{ gap: 5 }} title={c.backToSite}><ArrowLeft size={13} /><span className="s-nl">{c.backToSite}</span></Link>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

// Studio frame: a sidebar on desktop, a top bar with a drawer on phones.
export function StudioShell({ children }: { children: ReactNode }) {
  const { c } = useStudio();
  const [open, setOpen] = useState(false);
  // Desktop sidebar: open by default; the choice is remembered in this browser.
  const [mini, setMini] = useState(false);
  useEffect(() => { try { setMini(localStorage.getItem(SIDE_KEY) === 'mini'); } catch { /* storage blocked */ } }, []);
  // Every card gets a soft light that follows the pointer, as in the prototype.
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>('.s-glow, .s-wg, .s-main .s-card');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  const toggle = () => setMini((m) => { try { localStorage.setItem(SIDE_KEY, m ? 'open' : 'mini'); } catch { /* storage blocked */ } return !m; });
  const close = () => setOpen(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Phone menu: focus moves into it, and Escape closes it.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <>
      <header className="s-topbar">
        <Brand />
        <button type="button" className="s-btn sec xs" onClick={() => setOpen(true)} aria-label={c.menu} aria-expanded={open}><Menu size={16} /></button>
      </header>
      {open && (
        <div className="s-drawer" role="dialog" aria-modal="true" aria-label={c.menu}>
          <button type="button" className="s-scrim" aria-label={c.closeMenu} onClick={close} />
          <Sidebar onNavigate={close} />
          <button ref={closeRef} type="button" onClick={close} aria-label={c.closeMenu} className="s-btn sec xs" style={{ position: 'absolute', top: 12, left: 'min(250px, 76vw)' }}><X size={15} /></button>
        </div>
      )}
      <div className={`s-app${mini ? ' mini' : ''}`}>
        <Sidebar mini={mini} onToggle={toggle} />
        <main className="s-main"><div className="s-wrap"><SampleGate><UsageNote />{children}</SampleGate></div></main>
      </div>
    </>
  );
}
