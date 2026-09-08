'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { format } from 'date-fns';
import { compareSnapshots } from '@ig-tracker/core';
import type { Account, SnapshotComparison } from '@ig-tracker/core';
import type { SnapshotRecord } from '@/lib/db';
import { getSnapshot } from '@/hooks/useSnapshots';
import { useAuth } from '@/components/AuthProvider';
import { T } from '@/components/landing/tokens';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AccountList } from '@/components/AccountList';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { getDiffContent } from './content';
import { getListToolbarContent } from '@/components/listToolbar.content';
import type { AppLocale } from '@/i18n/routing';

// ─── Simple collapsible section ───────────────────────────────────────────────

function DiffSection({
  title, label, count, accounts, csvFilename, emptyMessage, toolbarContent, accent = false, defaultOpen = false,
}: {
  title: string; label: string; count: number; accounts: Account[]; csvFilename: string; emptyMessage: string;
  toolbarContent: ReturnType<typeof getListToolbarContent>; accent?: boolean; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const accentColor = accent ? T.terra : T.tealMid;
  const accentBg    = accent ? 'rgba(168,75,47,0.06)' : 'rgba(2,136,143,0.06)';
  const accentBorder = accent ? 'rgba(168,75,47,0.25)' : 'rgba(2,136,143,0.25)';

  return (
    <div style={{ borderRadius: 16, border: `1px solid ${open ? accentBorder : 'var(--t-border1)'}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px',
          background: open ? accentBg : 'var(--t-surface1)',
          border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12,
          transition: 'background 0.2s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontFamily: T.serif, fontSize: 20, color: T.ink, letterSpacing: '-0.01em',
          }}>
            {title}
          </span>
          <span style={{
            fontSize: 11, fontFamily: T.mono, padding: '3px 10px', borderRadius: 20,
            background: `${accentColor}22`, color: accentColor, letterSpacing: '0.04em',
          }}>
            {label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: T.serif, fontSize: 28, color: accentColor, letterSpacing: '-0.02em' }}>
            {count.toLocaleString()}
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
            <path d="M3 6 L8 11 L13 6" stroke={T.inkMute} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px' }}>
          {count === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: T.inkMute, fontSize: 13, fontStyle: 'italic' }}>
              {emptyMessage}
            </div>
          ) : (
            <AccountList accounts={accounts} csvFilename={csvFilename} emptyMessage={emptyMessage} content={toolbarContent} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Stat chip ────────────────────────────────────────────────────────────────

function StatChip({ label, value, positive }: { label: string; value: number; positive: boolean }) {
  const color = value === 0 ? T.inkMute : positive ? T.tealLight : T.terra;
  const prefix = value > 0 ? '+' : '';
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 4,
      padding: '14px 20px', borderRadius: 14,
      background: value === 0 ? 'var(--t-surface1)' : positive ? 'rgba(2,136,143,0.07)' : 'rgba(168,75,47,0.07)',
      border: `1px solid ${value === 0 ? 'var(--t-border1)' : positive ? 'rgba(2,136,143,0.2)' : 'rgba(168,75,47,0.2)'}`,
    }}>
      <span style={{ fontFamily: T.serif, fontSize: 32, color, letterSpacing: '-0.03em', lineHeight: 1 }}>
        {prefix}{value.toLocaleString()}
      </span>
      <span style={{ fontSize: 11, color: T.inkDim, fontFamily: T.mono, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function DiffPageInner({ locale }: { locale: AppLocale }) {
  const c = getDiffContent(locale);
  const toolbarContent = getListToolbarContent(locale);
  const searchParams = useSearchParams();
  const { userId } = useAuth();

  const oldId     = Number(searchParams.get('old'));
  const currentId = Number(searchParams.get('current'));

  const [oldRecord, setOldRecord]         = useState<SnapshotRecord | null>(null);
  const [currentRecord, setCurrentRecord] = useState<SnapshotRecord | null>(null);
  const [diff, setDiff]                   = useState<SnapshotComparison | null>(null);
  const [error, setError]                 = useState<string | null>(null);

  useEffect(() => {
    if (!oldId || !currentId) { setError(c.missingIds); return; }

    // getSnapshot verifies ownership, not just existence — a guessed or
    // reused id belonging to someone else on this browser returns undefined
    // rather than their data.
    Promise.all([getSnapshot(oldId, userId), getSnapshot(currentId, userId)]).then(([o, cur]) => {
      if (!o || !cur) { setError(c.notFound); return; }
      setOldRecord(o);
      setCurrentRecord(cur);
      setDiff(compareSnapshots(o.data, cur.data));
    }).catch(() => setError(c.failedToLoad));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oldId, currentId, userId]);

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <p style={{ color: T.terra, fontFamily: T.mono, fontSize: 14 }}>{error}</p>
        <Link href="/history" style={{ color: T.tealLight, fontSize: 13, fontFamily: T.sans }}>{c.backToHistory}</Link>
      </div>
    );
  }

  if (!diff || !oldRecord || !currentRecord) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: T.mono, fontSize: 13, color: T.inkMute }}>{c.loadingSnapshots}</span>
      </div>
    );
  }

  const periodDays = Math.round(Math.abs(diff.periodDays));
  const oldDate    = format(new Date(oldRecord.exportedAt * 1000), 'MMM d, yyyy');
  const curDate    = format(new Date(currentRecord.exportedAt * 1000), 'MMM d, yyyy');
  const netFollowers = diff.newFollowers.length - diff.lostFollowers.length;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-4 sm:px-8 py-4 sticky top-0 z-50"
        style={{ borderBottom: `1px solid ${T.border1}`, backdropFilter: 'blur(14px)', background: T.navBg }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="WhoUnfollowed" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6" style={{ fontSize: 13 }}>
          <Link href="/history" style={{ color: T.inkDim, textDecoration: 'none' }}>{c.historyNav}</Link>
          <ThemeToggle />
        </div>
      </nav>

      <main className="px-4 sm:px-8 py-10 sm:py-12" style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 12 }}>{c.eyebrow}</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 12 }}>
            {c.headlineTemplate(periodDays)}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ padding: '5px 12px', borderRadius: 8, background: 'var(--t-surface2)', border: '1px solid var(--t-border2)', fontSize: 12, color: T.inkDim, fontFamily: T.mono }}>
              {oldRecord.label} · {oldDate}
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8 H13 M9 4 L13 8 L9 12" stroke={T.inkMute} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(2,136,143,0.08)', border: '1px solid rgba(2,136,143,0.25)', fontSize: 12, color: T.tealLight, fontFamily: T.mono }}>
              {currentRecord.label} · {curDate}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 10, marginBottom: 40 }}>
          <StatChip label={c.statUnfollowedYou}  value={-diff.lostFollowers.length} positive={false} />
          <StatChip label={c.statNewFollowers}   value={diff.newFollowers.length}   positive={true}  />
          <StatChip label={c.statYouUnfollowed}  value={-diff.unfollowed.length}    positive={false} />
          <StatChip label={c.statNetChange}      value={netFollowers}               positive={netFollowers >= 0} />
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <DiffSection
            title={c.lostFollowersTitle}
            label={c.lostFollowersLabel}
            count={diff.lostFollowers.length}
            accounts={diff.lostFollowers}
            csvFilename={`unfollowers-${oldRecord.exportedAt}-${currentRecord.exportedAt}.csv`}
            emptyMessage={c.lostFollowersEmpty}
            toolbarContent={toolbarContent}
            accent={true}
            defaultOpen={true}
          />
          <DiffSection
            title={c.newFollowersTitle}
            label={c.newFollowersLabel}
            count={diff.newFollowers.length}
            accounts={diff.newFollowers}
            csvFilename={`new-followers-${oldRecord.exportedAt}-${currentRecord.exportedAt}.csv`}
            emptyMessage={c.newFollowersEmpty}
            toolbarContent={toolbarContent}
            defaultOpen={diff.lostFollowers.length === 0}
          />
          <DiffSection
            title={c.youUnfollowedTitle}
            label={c.youUnfollowedLabel}
            count={diff.unfollowed.length}
            accounts={diff.unfollowed}
            csvFilename={`you-unfollowed-${oldRecord.exportedAt}-${currentRecord.exportedAt}.csv`}
            emptyMessage={c.youUnfollowedEmpty}
            toolbarContent={toolbarContent}
          />
          <DiffSection
            title={c.newFollowingTitle}
            label={c.newFollowingLabel}
            count={diff.newFollowing.length}
            accounts={diff.newFollowing}
            csvFilename={`new-following-${oldRecord.exportedAt}-${currentRecord.exportedAt}.csv`}
            emptyMessage={c.newFollowingEmpty}
            toolbarContent={toolbarContent}
          />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

export function DiffContent({ locale }: { locale: AppLocale }) {
  const c = getDiffContent(locale);
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--t-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--t-ink-mute)' }}>{c.loading}</span>
      </div>
    }>
      <DiffPageInner locale={locale} />
    </Suspense>
  );
}
