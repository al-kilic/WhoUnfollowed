'use client';

import { useMemo, useState } from 'react';
import { runHealthChecks, type HealthFinding } from '@ig-tracker/core';
import { ChevronDown, ChevronUp, Copy, MessageCircle, Users } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PLATFORM_NAME, snapshotPlatform } from '@/lib/platform';
import { getRadarPageContent } from '@/components/radar/radar.content';
import { getHealthCheckContent } from '@/components/tools/healthCheck.content';
import { fill, fmt } from '@/components/tools/ToolCard';
import { useStudio } from '../StudioContext';
import { LockBar } from '../Lock';
import type { RadarData } from './RadarGate';
import { getRadarPagesContent } from './radarPages.content';

const S = 320, C = S / 2, R = C - 14;
const level = (impact: number) => (impact >= 60 ? 'high' : impact >= 35 ? 'mid' : 'low');
const COLOR = { high: 'var(--bad)', mid: 'var(--warn)', low: 'var(--faint)' } as const;

// Higher impact sits closer to the center; findings fan out by the golden angle.
function Sweep({ findings, active, aria }: { findings: HealthFinding[]; active: number | null; aria: string }) {
  const a0 = -0.6;
  return (
    <svg className="s-sweep" viewBox={`0 0 ${S} ${S}`} role="img" aria-label={aria}>
      <defs><linearGradient id="s-swg" x1="0" x2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity="0" /><stop offset="1" stopColor="var(--accent)" stopOpacity=".32" /></linearGradient></defs>
      {[0.33, 0.66, 1].map((k) => <circle key={k} cx={C} cy={C} r={R * k} fill="none" stroke="var(--line)" />)}
      <path d={`M${C} 14V${S - 14}M14 ${C}H${S - 14}`} stroke="var(--line)" />
      <g className="beam" style={{ transformOrigin: `${C}px ${C}px` }}>
        <path d={`M${C} ${C}L${S - 14} ${C}A${R} ${R} 0 0 0 ${(C + R * Math.cos(a0)).toFixed(1)} ${(C + R * Math.sin(a0)).toFixed(1)}Z`} fill="url(#s-swg)" />
      </g>
      {findings.map((f, i) => {
        const r = (0.18 + (1 - Math.min(100, Math.max(0, f.impact)) / 100) * 0.78) * R;
        const a = ((-90 + i * 137.5) * Math.PI) / 180;
        const x = C + r * Math.cos(a), y = C + r * Math.sin(a);
        const lv = level(f.impact);
        return (
          <g key={f.id} className={`blip${active === i ? ' on' : ''}`} style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * 0.12}s` }}>
            {i === 0 && <circle cx={x} cy={y} r={16} fill={COLOR[lv]} className="ping" style={{ transformOrigin: `${x}px ${y}px` }} />}
            <circle cx={x} cy={y} r={lv === 'high' ? 11 : lv === 'mid' ? 9.5 : 8} fill={COLOR[lv]} stroke="var(--surface)" strokeWidth={2} />
            <text x={x} y={y + 3.6} textAnchor="middle" fontSize={10.5} fontWeight={600} fill="#fff">{i + 1}</text>
          </g>
        );
      })}
      <circle cx={C} cy={C} r={3} fill="var(--ink)" />
    </svg>
  );
}

// How many fixes a free account sees in full.
const FREE_FIXES = 2;

export function StudioFixes({ d }: { d: RadarData }) {
  const { locale, hasPro } = useStudio();
  const p = getRadarPagesContent(locale).fx;
  const sw = getRadarPageContent(locale).sweep;
  const hc = getHealthCheckContent(locale);
  const all = useMemo(() => runHealthChecks({ current: d.snapshot, previous: d.previousSnapshot }), [d.snapshot, d.previousSnapshot]);
  const findings = all.filter((f) => f.id !== 'second_export');
  const nudge = all.find((f) => f.id === 'second_export');
  const app = PLATFORM_NAME[snapshotPlatform(d.snapshot)];
  const [open, setOpen] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const locked = !hasPro;
  const label = { high: sw.legendHigh, mid: sw.legendMid, low: sw.legendLow };
  const params = (f: HealthFinding) => {
    const o: Record<string, string | number> = { app };
    for (const [k, v] of Object.entries(f.params)) o[k] = k === 'date' ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${v}T12:00:00Z`)) : k === 'year' || typeof v !== 'number' ? v : fmt(v, locale);
    if (typeof f.params.months === 'number') o.age = hc.age(f.params.months);
    return o;
  };
  const copy = async (i: number, f: HealthFinding) => {
    try { await navigator.clipboard.writeText(f.accounts.map((a) => a.username).join('\n')); setCopied(i); setTimeout(() => setCopied(null), 1500); } catch { /* clipboard blocked */ }
  };

  return (
    <div className="s-gmain-top" style={{ alignItems: 'start' }}>
      <section className="s-card s-pad s-col" style={{ gap: 14, alignItems: 'center' }}>
        <span className="s-sub-t" style={{ alignSelf: 'flex-start', fontSize: 13 }}>{p.hint}</span>
        <Sweep findings={findings} active={hover ?? open} aria={sw.aria(findings.length)} />
        <div className="s-row s-sub-t" style={{ gap: 14, fontSize: 12.5 }}>
          {(['high', 'mid', 'low'] as const).map((k) => <span key={k} className="s-row"><i className="s-sw" style={{ background: COLOR[k], borderRadius: '50%' }} />{label[k]}</span>)}
        </div>
      </section>
      <section className="s-card">
        {locked && findings.length > FREE_FIXES && <div style={{ padding: 12 }}><LockBar feature="radar" text={getRadarPagesContent(locale).lock.fixes} /></div>}
        {findings.length === 0 ? <p className="s-pad s-sub-t" style={{ margin: 0 }}>{p.allClear}</p> : (
          <ol className="s-fxl">
            {findings.map((f, i) => {
              // Free: the two biggest fixes in full, the rest locked.
              const shut = locked && i >= FREE_FIXES;
              const lv = level(f.impact), on = open === i && !shut, t = hc.checks[f.id], pr = params(f);
              return (
                <li key={f.id} className={on ? 'open' : ''} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                  <button type="button" className="s-fxr" aria-expanded={on} disabled={shut} onClick={() => setOpen(on ? null : i)}>
                    <span className="s-fxn" style={{ background: COLOR[lv] }}>{i + 1}</span>
                    <span className="s-col" style={{ gap: 4, minWidth: 0, flex: 1, textAlign: 'left' }}>
                      <span className={shut ? 's-blur' : ''} style={{ fontWeight: 600, fontSize: 14 }}>{fill(t.title, pr)}</span>
                      <span className="s-row s-sub-t" style={{ gap: 10, fontSize: 12, flexWrap: 'wrap' }}>
                        <span className="s-row"><i className="s-sw" style={{ background: COLOR[lv], borderRadius: '50%' }} />{p.impact(label[lv])}</span>
                        {f.accounts.length > 0 && <span>{p.accounts(f.accounts.length)}</span>}
                        {i === 0 && <span className="s-badge good">{sw.top}</span>}
                      </span>
                    </span>
                    {!shut && (on ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                  </button>
                  {on && (
                    <div className="s-fxd">
                      <p style={{ margin: 0, fontSize: 13.5, color: 'var(--mute)', lineHeight: 1.55 }}>{fill(t.action, pr)}</p>
                      {f.accounts.length > 0 && (
                        <div className="s-row" style={{ gap: 6, flexWrap: 'wrap' }}>
                          {f.accounts.slice(0, 8).map((a) => <a key={a.username} className="s-chip2" href={a.href} target="_blank" rel="noopener noreferrer">@{a.username}</a>)}
                          {f.accounts.length > 8 && <span className="s-sub-t" style={{ fontSize: 12.5 }}>+{(f.accounts.length - 8).toLocaleString(locale)}</span>}
                        </div>
                      )}
                      <div className="s-row" style={{ gap: 8, flexWrap: 'wrap' }}>
                        {f.accounts.length > 0 && <button type="button" className="s-btn xs" onClick={() => void copy(i, f)}><Copy size={13} />{copied === i ? hc.copied : hc.copyList}</button>}
                        <Link href="/app/radar/people" className="s-btn sec xs"><Users size={13} />{p.people}</Link>
                        <Link href="/app/ask" className="s-btn sec xs"><MessageCircle size={13} />{p.ask}</Link>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
        {nudge && <p className="s-pad s-sub-t" style={{ margin: 0, fontSize: 13, borderTop: '1px solid var(--line)' }}><b style={{ color: 'var(--ink)', fontWeight: 600 }}>{fill(hc.checks.second_export.title, { app })}</b> {fill(hc.checks.second_export.action, { app })}</p>}
      </section>
    </div>
  );
}
