'use client';

import { useMemo, useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import type { Locale as DateFnsLocale } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import {
  RadialBarChart, RadialBar, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid, ReferenceLine,
} from 'recharts';
import { T } from '@/components/landing/tokens';
import { PLATFORM_NAME, platformOfHref } from '@/lib/platform';
import { lockedContentStyle } from '@/components/ProLockOverlay';
import type { DashboardContent } from '@/app/[locale]/dashboard/content';

// Kept in RadarModal.tsx so pages that only need these never load the charts.
export { RadarModal, DATE_FNS_LOCALES } from './RadarModal';

// ─── Design tokens ────────────────────────────────────────────────────────────

const CARD = {
  bg: 'var(--t-surface1)',
  border: '1px solid var(--t-border1)',
  radius: 16,
  pad: '24px',
};

// ─── Shared components ────────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: CARD.bg, border: CARD.border, borderRadius: CARD.radius, padding: CARD.pad, ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 400, letterSpacing: '-0.02em', color: T.ink, marginBottom: 4 }}>
      {children}
    </h2>
  );
}


function IGLink({ href, username, c }: { href: string; username: string; c: DashboardContent }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ color: T.inkMute, display: 'flex', alignItems: 'center', flexShrink: 0 }}
      onMouseEnter={e => (e.currentTarget.style.color = T.tealLight)}
      onMouseLeave={e => (e.currentTarget.style.color = T.inkMute)}
      aria-label={c.openOn(username, PLATFORM_NAME[platformOfHref(href)])}
    >
      <ExternalLink size={13} />
    </a>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: 13, color: T.inkMute, fontStyle: 'italic' }}>
      {text}
    </div>
  );
}

// ─── 2. Audience breakdown donut ──────────────────────────────────────────────

function makeCustomTooltip(labelMap: Record<string, string>) {
  return function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) {
    if (!active || !payload?.length) return null;
    const entry = payload[0];
    if (!entry) return null;
    const displayName = labelMap[entry.name] ?? entry.name;
    const displayValue = entry.name === 'ratio' ? entry.value.toFixed(2) : entry.value.toLocaleString();
    return (
      <div style={{ background: 'var(--t-bgCard)', border: '1px solid var(--t-border3)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: T.inkDim, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
        {label && <div style={{ color: T.inkMute, marginBottom: 4, fontSize: 11 }}>{label}</div>}
        <span style={{ color: T.ink }}>{displayName}</span>: {displayValue}
      </div>
    );
  };
}

// The locked (free) preview keeps counts and dates but never puts real
// usernames in the page: blur is only CSS, and these lists are Pro.
export function maskAccounts<A extends { username: string; href: string }>(accounts: A[]): A[] {
  return accounts.map((a, i) => ({ ...a, username: `${'•'.repeat(4 + (i % 6))}`, href: '#' }));
}

export function AudienceBreakdown({ followers, mutuals, fans, nonFollowers, c, locked = false }: {
  followers: number; mutuals: number; fans: number; nonFollowers: number; c: DashboardContent; locked?: boolean;
}) {
  const CustomTooltip = useMemo(() => makeCustomTooltip({ ratio: c.audience.tooltipRatio, count: c.audience.tooltipAccounts }), [c]);
  const data = [
    { name: c.audience.mutuals,        value: mutuals,      color: T.tealLight },
    { name: c.audience.dontFollowBack, value: nonFollowers, color: T.terra },
    { name: c.audience.fans,           value: fans,         color: '#a0956b' },
  ].filter(d => d.value > 0);

  return (
    <Card style={{ display: 'flex', flexDirection: 'column' }}>
      <SectionLabel>{c.audience.sectionLabel}</SectionLabel>
      <CardTitle>{c.audience.title}</CardTitle>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 16, ...(locked ? lockedContentStyle : {}) }} inert={locked}>
        {/* The list to the right already states these same numbers and
            percentages as real text, so the donut is purely decorative here
            and hidden from assistive tech rather than announced twice. */}
        <div aria-hidden="true">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={2} dataKey="value" strokeWidth={0}>
                {data.map((d, i) => <Cell key={i} fill={d.color} opacity={0.9} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {data.map(d => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: T.inkDim, flex: 1 }}>{d.name}</span>
              <span style={{ fontSize: 13, fontFamily: T.mono, color: T.ink }}>{d.value.toLocaleString()}</span>
              <span style={{ fontSize: 11, fontFamily: T.mono, color: T.inkMute, width: 36, textAlign: 'right' }}>
                {followers > 0 ? `${Math.round((d.value / followers) * 100)}%` : '-'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── 3. Follow ratio radial ───────────────────────────────────────────────────

function RatioInfoTooltip({ c }: { c: DashboardContent }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(o => !o)}
        aria-label={c.ratio.tooltipAria}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.inkMute, lineHeight: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M8 7.2 V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <circle cx="8" cy="5.2" r="0.75" fill="currentColor"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          marginTop: 8, width: 260, zIndex: 200,
          background: T.overlay, border: `1px solid ${T.overlayBorder}`,
          borderRadius: 12, padding: '14px 16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, fontFamily: T.sans, marginBottom: 8 }}>
            {c.ratio.tooltipTitle}
          </div>
          <p style={{ fontSize: 12, color: T.inkDim, lineHeight: 1.6, margin: '0 0 10px' }}>
            {c.ratio.tooltipP1}
          </p>
          <p style={{ fontSize: 12, color: T.inkDim, lineHeight: 1.6, margin: '0 0 10px' }}>
            {c.ratio.tooltipP2}
          </p>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, fontWeight: 600, marginBottom: 4 }}>{c.ratio.howToImprove}</div>
          <p style={{ fontSize: 12, color: T.inkDim, lineHeight: 1.6, margin: 0 }}>
            {c.ratio.tooltipP3}
          </p>
        </div>
      )}
    </div>
  );
}

export function FollowRatioCard({ followers, following, snapshots, c, dateLocale, locked = false }: {
  followers: number; following: number;
  snapshots: { exportedAt: number; data: { followers: { username: string }[]; following: { username: string }[] } }[];
  c: DashboardContent; dateLocale: DateFnsLocale | undefined; locked?: boolean;
}) {
  const CustomTooltip = useMemo(() => makeCustomTooltip({ ratio: c.audience.tooltipRatio, count: c.audience.tooltipAccounts }), [c]);
  const ratio = following === 0 ? 0 : followers / following;
  const clampedPct = Math.min(ratio * 50, 100);
  const ratioColor = ratio >= 1 ? T.tealLight : ratio >= 0.5 ? '#a0956b' : T.terra;

  const trendData = snapshots
    .slice()
    .reverse()
    .filter(s => s.data.following.length > 0)
    .map(s => ({
      date: format(new Date(s.exportedAt * 1000), 'MMM d, HH:mm', dateLocale && { locale: dateLocale }),
      ratio: parseFloat((s.data.followers.length / s.data.following.length).toFixed(2)),
    }));

  const prev = snapshots[1];
  const prevRatio = prev ? prev.data.followers.length / Math.max(prev.data.following.length, 1) : null;
  const trend = prevRatio !== null ? (ratio > prevRatio ? c.ratio.improving : ratio < prevRatio ? c.ratio.declining : c.ratio.stable) : null;
  const trendColor = trend === c.ratio.improving ? T.tealLight : trend === c.ratio.declining ? T.terra : T.inkDim;

  const radialData = [{ value: clampedPct }];

  return (
    <Card style={{ display: 'flex', flexDirection: 'column' }}>
      <SectionLabel>{c.ratio.sectionLabel}</SectionLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <CardTitle>{c.ratio.title}</CardTitle>
        <RatioInfoTooltip c={c} />
      </div>
      <div style={locked ? lockedContentStyle : undefined} inert={locked}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 16 }}>
          <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
            {/* The ratio value is repeated as real text in the overlay below and
                in the paragraph to the right, so the gauge itself is decorative. */}
            <div aria-hidden="true">
              <ResponsiveContainer width={120} height={120}>
                <RadialBarChart innerRadius={40} outerRadius={56} startAngle={225} endAngle={-45} data={radialData} barSize={10}>
                  <RadialBar dataKey="value" cornerRadius={5} fill={ratioColor} background={{ fill: 'var(--t-surface2)' }} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: T.serif, fontSize: 22, letterSpacing: '-0.02em', color: ratioColor, lineHeight: 1 }}>{ratio.toFixed(2)}</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5, marginBottom: 8 }}>
              {ratio >= 1 ? c.ratio.moreFollowers(ratio.toFixed(1)) : c.ratio.followingMore((1 / ratio).toFixed(1))}
            </p>
            {trend && <span style={{ fontSize: 12, fontFamily: T.mono, color: trendColor }}>{trend}</span>}
          </div>
        </div>
        {trendData.length >= 2 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, marginBottom: 8, letterSpacing: '0.08em' }}>{c.ratio.ratioOverTime}</div>
            <div
              role="img"
              aria-label={c.ratio.chartAria(trendData.length, trendData[0]!.ratio.toFixed(2), trendData[0]!.date, trendData[trendData.length - 1]!.ratio.toFixed(2), trendData[trendData.length - 1]!.date)}
            >
              <ResponsiveContainer width="100%" height={60}>
                <AreaChart data={trendData} margin={{ top: 2, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ratioGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={T.tealMid} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={T.tealMid} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--t-surface2)" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: T.inkMute }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: T.inkMute }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="ratio" stroke={T.tealMid} strokeWidth={1.5} fill="url(#ratioGrad)" dot={{ fill: T.tealMid, r: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// ─── 4. Follow age analysis ───────────────────────────────────────────────────

const AGE_BUCKET_RANGES = [
  { minDays: 0,   maxDays: 30,       color: T.tealLight },
  { minDays: 30,  maxDays: 180,      color: '#6db8bc' },
  { minDays: 180, maxDays: 365,      color: '#a0956b' },
  { minDays: 365, maxDays: 730,      color: '#c07a50' },
  { minDays: 730, maxDays: Infinity, color: T.terra },
];

export function FollowAgeCard({ nonFollowers, c, locked = false }: { nonFollowers: { username: string; href: string; followedAt: number | null }[]; c: DashboardContent; locked?: boolean }) {
  const CustomTooltip = useMemo(() => makeCustomTooltip({ ratio: c.audience.tooltipRatio, count: c.audience.tooltipAccounts }), [c]);
  const now = Math.floor(Date.now() / 1000);
  const withTs = nonFollowers.filter(a => a.followedAt !== null);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!withTs.length) {
    return (
      <Card>
        <SectionLabel>{c.followAge.sectionLabel}</SectionLabel>
        <CardTitle>{c.followAge.title}</CardTitle>
        <EmptyState text={c.followAge.emptyMessage} />
      </Card>
    );
  }

  const buckets = AGE_BUCKET_RANGES.map((b, i) => {
    const label = c.followAge.buckets[i]!;
    const accounts = withTs.filter(a => {
      const days = differenceInDays(now * 1000, (a.followedAt ?? 0) * 1000);
      return days >= b.minDays && days < b.maxDays;
    });
    return { ...b, label, count: accounts.length, accounts };
  });

  const longTenure = buckets.filter(b => b.minDays >= 365).reduce((s, b) => s + b.count, 0);
  const oldest = withTs.reduce((a, b) => (a.followedAt! < b.followedAt! ? a : b));
  const oldestDays = differenceInDays(now * 1000, (oldest.followedAt ?? 0) * 1000);
  const activeBucket = buckets.find(b => b.label === selectedBucket);

  return (
    <Card>
      <SectionLabel>{c.followAge.sectionLabel}</SectionLabel>
      <CardTitle>{c.followAge.title}</CardTitle>
      <div style={locked ? lockedContentStyle : undefined} inert={locked}>
      {/* Two stat boxes - distinct visual treatment */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 12, marginTop: 16, marginBottom: 20 }}>
        {/* Left: count box */}
        <div style={{
          padding: '18px 20px', borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(168,75,47,0.1) 0%, rgba(168,75,47,0.04) 100%)',
          border: '1px solid rgba(168,75,47,0.25)',
        }}>
          <div style={{ fontSize: 11, color: 'rgba(168,75,47,0.7)', fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{c.followAge.longWait}</div>
          <div style={{ fontFamily: T.serif, fontSize: 48, lineHeight: 1, letterSpacing: '-0.03em', color: T.terra }}>{longTenure.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: T.inkMute, marginTop: 8, lineHeight: 1.4 }}>{c.followAge.longWaitDesc}</div>
        </div>

        {/* Right: oldest profile card */}
        <div style={{
          padding: '18px 20px', borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(160,149,107,0.08) 0%, var(--t-surface1) 100%)',
          border: '1px solid rgba(160,149,107,0.2)',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ fontSize: 11, color: 'rgba(160,149,107,0.8)', fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.followAge.longestWait}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(160,149,107,0.3), rgba(168,75,47,0.2))',
              border: '1px solid rgba(160,149,107,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: '#a0956b',
            }}>
              {oldest.username[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{oldest.username}</div>
              <div style={{ fontSize: 11, color: T.inkMute, marginTop: 2 }}>{c.followAge.followedDaysAgo(oldestDays)}</div>
            </div>
            <span style={{
              flexShrink: 0, fontFamily: T.serif, fontSize: 22, color: '#a0956b', letterSpacing: '-0.02em',
            }}>{oldestDays}d</span>
          </div>
          <a
            href={oldest.href} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 9, textDecoration: 'none',
              fontSize: 12, fontWeight: 600, fontFamily: T.sans,
              background: 'rgba(168,75,47,0.12)', border: '1px solid rgba(168,75,47,0.3)',
              color: T.terra, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,75,47,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(168,75,47,0.12)'; }}
          >
            <ExternalLink size={12} />
            {c.followAge.visitProfileToUnfollow}
          </a>
        </div>
      </div>

      {/* Top 10 oldest - copyable list */}
      {(() => {
        const top10 = [...withTs]
          .sort((a, b) => (a.followedAt ?? 0) - (b.followedAt ?? 0))
          .slice(0, 10);
        const usernames = top10.map(a => `@${a.username}`).join('\n');
        return (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.inkDim }}>
                {c.followAge.topOldest(top10.length)}
              </span>
              <button
                onClick={() => {
                  void navigator.clipboard.writeText(usernames);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{
                  fontSize: 11, fontFamily: T.mono, padding: '5px 14px', borderRadius: 20,
                  border: `1px solid var(--t-border3)`,
                  background: copied ? 'rgba(2,136,143,0.12)' : 'transparent',
                  color: copied ? T.tealLight : T.inkDim, cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {copied ? c.followAge.copied : c.followAge.copyAll}
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {top10.map((a, i) => {
                const days = differenceInDays(Date.now(), (a.followedAt ?? 0) * 1000);
                const intensity = Math.max(0.15, 1 - i * 0.08);
                return (
                  <a key={`${i}:${a.username}`} href={a.href} target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 11, fontFamily: T.mono, padding: '4px 11px', borderRadius: 20,
                    background: `rgba(168,75,47,${intensity * 0.08})`,
                    border: `1px solid rgba(168,75,47,${intensity * 0.25})`,
                    color: T.inkDim, textDecoration: 'none', transition: 'all 0.15s',
                  }}>
                    @{a.username}
                    <span style={{ color: `rgba(168,75,47,${intensity * 0.8})`, fontSize: 10 }}>{days}d</span>
                  </a>
                );
              })}
            </div>
          </div>
        );
      })()}

      <p style={{
        fontSize: 12, marginBottom: 12, fontStyle: 'italic', fontWeight: 600,
        background: 'linear-gradient(90deg, #01696F, #6db8bc, #a0956b, #c07a50, #A84B2F, #01696F)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        animation: 'rainbow-shine 3s linear infinite',
      }}>
        {c.followAge.clickBarToSee}
        <style>{`@keyframes rainbow-shine { 0% { background-position: 0% center } 100% { background-position: 200% center } }`}</style>
      </p>

      <div
        role="img"
        aria-label={c.followAge.chartAria(buckets.map(b => `${b.label}, ${b.count} ${c.followAge.accountsSuffix}`).join('; '))}
      >
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={buckets} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
            <XAxis type="number" tick={{ fontSize: 10, fill: T.inkMute }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: T.inkDim }} axisLine={false} tickLine={false} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              radius={[0, 4, 4, 0]}
              name={c.audience.tooltipAccounts}
              style={{ cursor: 'pointer' }}
              onClick={(data: unknown) => {
                const label = (data as { label?: string } | null)?.label;
                setSelectedBucket(prev => prev === label ? null : (label ?? null));
              }}
            >
              {buckets.map((b, i) => (
                <Cell key={i} fill={b.color} opacity={selectedBucket === null || selectedBucket === b.label ? 0.85 : 0.25} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Keyboard/screen-reader equivalent of clicking a bar above: visually
          hidden but focusable, so the same filter-by-age-range interaction
          doesn't require a mouse. */}
      <div className="sr-only" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
        {buckets.map(b => (
          <button
            key={b.label}
            onClick={() => setSelectedBucket(prev => prev === b.label ? null : b.label)}
            aria-pressed={selectedBucket === b.label}
          >
            {b.label}: {b.count} {c.followAge.accountsSuffix}
          </button>
        ))}
      </div>

      {activeBucket && activeBucket.accounts.length > 0 && (
        <div style={{ marginTop: 16, borderRadius: 10, border: `1px solid ${activeBucket.color}30`, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', background: `${activeBucket.color}10`, borderBottom: `1px solid ${activeBucket.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontFamily: T.mono, color: activeBucket.color }}>{activeBucket.label} · {activeBucket.count} {c.followAge.accountsSuffix}</span>
            <button onClick={() => setSelectedBucket(null)} style={{ background: 'none', border: 'none', color: T.inkMute, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
          </div>
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {activeBucket.accounts.map((a, i) => {
              const days = differenceInDays(now * 1000, (a.followedAt ?? 0) * 1000);
              return (
                <div key={`${i}:${a.username}`} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px',
                  borderBottom: i < activeBucket.accounts.length - 1 ? '1px solid var(--t-surface2)' : 'none',
                }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--t-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: T.inkDim, flexShrink: 0 }}>
                    {a.username[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, color: T.ink, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{a.username}</span>
                  <span style={{ fontSize: 11, fontFamily: T.mono, color: T.inkMute, flexShrink: 0 }}>{days}d</span>
                  <IGLink href={a.href} username={a.username} c={c} />
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </Card>
  );
}

// ─── 5. Pending requests ──────────────────────────────────────────────────────

function pendingLabel(c: DashboardContent, days: number | null, username: string): { text: string; color: string } | null {
  if (days === null) return null;
  const h = username.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0);
  if (days >= 365) return { text: c.pending.labelsYearPlus[h % c.pending.labelsYearPlus.length]!, color: T.terra };
  if (days >= 180) return { text: c.pending.labelsHalfYear[h % c.pending.labelsHalfYear.length]!, color: T.terra };
  if (days >= 90)  return { text: c.pending.labelsNinetyDays[h % c.pending.labelsNinetyDays.length]!, color: T.terra };
  if (days >= 30)  return { text: c.pending.labelsThirtyDays[h % c.pending.labelsThirtyDays.length]!, color: '#a0956b' };
  return null;
}

export function PendingRequestsCard({ accounts, c, locked = false }: { accounts: { username: string; href: string; followedAt: number | null }[]; c: DashboardContent; locked?: boolean }) {
  const now = Math.floor(Date.now() / 1000);
  const [activeBucket, setActiveBucket] = useState<string | null>(null);
  const byAge = (a: typeof accounts[0]) => differenceInDays(now * 1000, (a.followedAt ?? now) * 1000);
  const sorted = [...accounts].sort((a, b) => byAge(b) - byAge(a)); // oldest first

  type PBucket = { label: string; color: string; count: number; test: (days: number) => boolean };
  const buckets: PBucket[] = [
    { label: c.pending.bucket90,     color: T.terra,   count: 0, test: d => d >= 90 },
    { label: c.pending.bucket30to90, color: '#a0956b', count: 0, test: d => d >= 30 && d < 90 },
    { label: c.pending.bucketUnder30, color: T.tealMid, count: 0, test: d => d < 30 },
  ];
  buckets.forEach(b => { b.count = sorted.filter(a => b.test(byAge(a))).length; });

  // Sort: bucket accounts float to top, rest below — no filtering
  const displayAccounts = activeBucket
    ? (() => {
        const b = buckets.find(bk => bk.label === activeBucket);
        if (!b) return sorted;
        const inBucket  = sorted.filter(a => b.test(byAge(a)));
        const outBucket = sorted.filter(a => !b.test(byAge(a)));
        return [...inBucket, ...outBucket];
      })()
    : sorted;

  return (
    <Card>
      <SectionLabel>{c.pending.sectionLabel}</SectionLabel>
      <CardTitle>{c.pending.title}</CardTitle>

      <div style={locked ? lockedContentStyle : undefined} inert={locked}>
      {!accounts.length ? (
        <EmptyState text={c.pending.emptyMessage} />
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
            {buckets.map(b => {
              const active = activeBucket === b.label;
              return (
                <button
                  key={b.label}
                  onClick={() => setActiveBucket(prev => prev === b.label ? null : b.label)}
                  title={c.pending.filterBy(b.label)}
                  style={{
                    flex: 1, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                    background: active ? `${b.color}18` : 'var(--t-surface1)',
                    border: `1px solid ${active ? b.color : 'var(--t-border1)'}`,
                    boxShadow: active ? `0 0 0 1px ${b.color}30` : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontFamily: T.serif, fontSize: 24, color: b.color, letterSpacing: '-0.02em' }}>{b.count}</div>
                  <div style={{ fontSize: 10, color: active ? b.color : T.inkMute, marginTop: 4, fontFamily: T.mono }}>{b.label}</div>
                  <div style={{ fontSize: 9, color: active ? b.color : T.inkMute, fontFamily: T.mono, marginTop: 2, opacity: 0.65 }}>{active ? c.pending.tapToReset : c.pending.sortToTop}</div>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 10, border: '1px solid var(--t-border1)', overflow: 'hidden', maxHeight: 280, overflowY: 'auto' }}>
            {displayAccounts.map((a, i) => {
              const days = a.followedAt ? differenceInDays(now * 1000, a.followedAt * 1000) : null;
              const flag = pendingLabel(c, days, a.username);
              return (
                <div key={`${i}:${a.username}`} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  borderBottom: i < displayAccounts.length - 1 ? '1px solid var(--t-surface2)' : 'none',
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--t-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: T.inkDim, flexShrink: 0 }}>
                    {a.username[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, color: T.ink, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{a.username}</span>
                  {days !== null && <span style={{ fontSize: 11, fontFamily: T.mono, color: T.inkMute, flexShrink: 0 }}>{days}d</span>}
                  {flag && <span style={{ fontSize: 11, fontFamily: T.mono, color: flag.color, flexShrink: 0 }}>{flag.text}</span>}
                  <IGLink href={a.href} username={a.username} c={c} />
                </div>
              );
            })}
          </div>
        </>
      )}
      </div>
    </Card>
  );
}

// ─── 6. Recently unfollowed ───────────────────────────────────────────────────

export function RecentlyUnfollowedCard({ accounts, c, dateLocale, locked = false }: { accounts: { username: string; href: string; followedAt: number | null }[]; c: DashboardContent; dateLocale: DateFnsLocale | undefined; locked?: boolean }) {
  return (
    <Card>
      <SectionLabel>{c.recentlyUnfollowed.sectionLabel}</SectionLabel>
      <CardTitle>{c.recentlyUnfollowed.title}</CardTitle>
      <div style={locked ? lockedContentStyle : undefined} inert={locked}>
      {!accounts.length ? (
        <EmptyState text={c.recentlyUnfollowed.emptyMessage} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 10, border: '1px solid var(--t-border1)', overflow: 'hidden', marginTop: 16, maxHeight: 300, overflowY: 'auto' }}>
          {accounts.map((a, i) => (
            <div key={`${i}:${a.username}`} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              borderBottom: i < accounts.length - 1 ? '1px solid var(--t-surface2)' : 'none',
            }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--t-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: T.inkDim, flexShrink: 0 }}>
                {a.username[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: 13, color: T.ink, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{a.username}</span>
              {a.followedAt && (
                <span style={{ fontSize: 11, fontFamily: T.mono, color: T.inkMute, flexShrink: 0 }}>
                  {format(new Date(a.followedAt * 1000), 'MMM d, yyyy', dateLocale && { locale: dateLocale })}
                </span>
              )}
              <IGLink href={a.href} username={a.username} c={c} />
            </div>
          ))}
        </div>
      )}
      </div>
    </Card>
  );
}

// ─── 8. Follower growth chart ─────────────────────────────────────────────────

export type SnapshotSummary = { exportedAt: number; data: { followers: { username: string }[]; following: { username: string }[] } };

export function GrowthChart({ snapshots, c, dateLocale, locked = false }: { snapshots: SnapshotSummary[]; c: DashboardContent; dateLocale: DateFnsLocale | undefined; locked?: boolean }) {
  if (snapshots.length < 2) {
    return (
      <Card>
        <SectionLabel>{c.growth.sectionLabel}</SectionLabel>
        <CardTitle>{c.growth.title}</CardTitle>
        <EmptyState text={c.growth.emptyMessage} />
      </Card>
    );
  }

  const ordered = snapshots.slice().reverse();

  const data = ordered.map((s, i) => {
    const prev = ordered[i - 1];
    const followers = s.data.followers.length;
    const gained = prev ? Math.max(0, followers - prev.data.followers.length) : 0;
    const lost   = prev ? Math.max(0, prev.data.followers.length - followers) : 0;
    return {
      date: format(new Date(s.exportedAt * 1000), 'MMM d', dateLocale && { locale: dateLocale }),
      followers,
      gained,
      lost,
      net: gained - lost,
    };
  });

  const latest = data[data.length - 1]!;
  const prev   = data[data.length - 2]!;
  const netChange = latest.followers - prev.followers;
  const netColor  = netChange > 0 ? T.tealLight : netChange < 0 ? T.terra : T.inkDim;
  const netPrefix = netChange > 0 ? '+' : '';

  // Biggest drop
  const biggestDrop = data.reduce((max, d) => d.lost > max.lost ? d : max, { lost: 0, date: '', followers: 0, gained: 0, net: 0 });
  const showDropAlert = biggestDrop.lost >= 5;

  const GrowthTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    const entry = data.find(d => d.date === label);
    return (
      <div style={{ background: T.bgCard, border: '1px solid var(--t-border3)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: T.inkDim, minWidth: 160 }}>
        <div style={{ color: T.inkMute, marginBottom: 6, fontSize: 11 }}>{label}</div>
        <div style={{ color: T.ink, fontSize: 15, fontFamily: T.serif, marginBottom: 6 }}>{payload[0]?.value.toLocaleString()} {c.growth.followersUnit}</div>
        {entry && entry.gained > 0 && <div style={{ color: T.tealLight }}>{c.growth.gained(entry.gained.toLocaleString())}</div>}
        {entry && entry.lost > 0  && <div style={{ color: T.terra }}>{c.growth.lost(entry.lost.toLocaleString())}</div>}
      </div>
    );
  };

  return (
    <Card>
      <SectionLabel>{c.growth.sectionLabel}</SectionLabel>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
        <CardTitle>{c.growth.title}</CardTitle>
        <div style={{ textAlign: 'right', ...(locked ? lockedContentStyle : {}) }} inert={locked}>
          <div style={{ fontFamily: T.serif, fontSize: 28, letterSpacing: '-0.02em', color: netColor, lineHeight: 1 }}>
            {netPrefix}{netChange.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono, marginTop: 3 }}>{c.growth.sinceLastSnapshot}</div>
        </div>
      </div>

      <div style={locked ? lockedContentStyle : undefined} inert={locked}>
      {showDropAlert && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 10, marginBottom: 16,
          background: 'rgba(168,75,47,0.08)', border: '1px solid rgba(168,75,47,0.2)',
          fontSize: 12, color: T.terra,
        }}>
          <span style={{ fontSize: 16 }}>⚠</span>
          <span>{c.growth.biggestDrop(biggestDrop.date, biggestDrop.lost)}</span>
        </div>
      )}

      <div
        role="img"
        aria-label={c.growth.chartAria(
          data.length,
          data[0]!.followers.toLocaleString(),
          data[0]!.date,
          latest.followers.toLocaleString(),
          latest.date,
          showDropAlert ? c.growth.dropSuffix(biggestDrop.date, biggestDrop.lost) : '',
        )}
      >
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={T.tealMid} stopOpacity={0.3} />
              <stop offset="95%" stopColor={T.tealMid} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--t-surface2)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: T.inkMute }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: T.inkMute }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
          <Tooltip content={<GrowthTooltip />} />
          {showDropAlert && (
            <ReferenceLine x={biggestDrop.date} stroke={T.terra} strokeDasharray="4 2" strokeOpacity={0.5} />
          )}
          <Area type="monotone" dataKey="followers" stroke={T.tealMid} strokeWidth={2} fill="url(#growthGrad)" dot={{ fill: T.tealMid, r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: T.tealLight }} />
        </AreaChart>
      </ResponsiveContainer>
      </div>

      {/* Gained / lost summary row */}
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        {data.slice(1).some(d => d.gained > 0) && (
          <div style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: 'rgba(2,136,143,0.06)', border: '1px solid rgba(2,136,143,0.15)' }}>
            <div style={{ fontSize: 20, fontFamily: T.serif, color: T.tealLight, letterSpacing: '-0.02em' }}>
              +{data.slice(1).reduce((s, d) => s + d.gained, 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: T.inkMute, marginTop: 3 }}>{c.growth.totalGained}</div>
          </div>
        )}
        {data.slice(1).some(d => d.lost > 0) && (
          <div style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: 'rgba(168,75,47,0.06)', border: '1px solid rgba(168,75,47,0.15)' }}>
            <div style={{ fontSize: 20, fontFamily: T.serif, color: T.terra, letterSpacing: '-0.02em' }}>
              −{data.slice(1).reduce((s, d) => s + d.lost, 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: T.inkMute, marginTop: 3 }}>{c.growth.totalLost}</div>
          </div>
        )}
      </div>
      </div>
    </Card>
  );
}
