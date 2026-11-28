'use client';

import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { trackFunnel } from '@/lib/analytics';
import { savePendingReveal } from '@/lib/pendingReveal';
import { DeltaWarning } from '@/components/DeltaWarning';
import { CombinedExportNotice } from '@/components/CombinedExportNotice';
import { LargeFileNotice } from '@/components/LargeFileNotice';
import { UpgradeDialog } from '@/components/UpgradeDialog';
import { RevealDialog } from '@/components/RevealDialog';
import type { HomeContent } from '@/app/[locale]/homeContent';
import type { ExportUpload } from '@/hooks/useExportUpload';

// The questions an upload can raise before Results open: a ZIP too big for
// the tab, Instagram and Threads in one ZIP, an incomplete ("delta") export,
// the free snapshot limit, or a second export worth comparing.
export function UploadDialogs({ d, c }: { d: ExportUpload['dialogs']; c: HomeContent['hero'] }) {
  const router = useRouter();
  const locale = useLocale() as AppLocale;

  if (d.largeFile) {
    const file = d.largeFile;
    const mb = file.size / (1024 * 1024);
    return (
      <LargeFileNotice
        sizeLabel={mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`}
        content={c.largeFile}
        onSmallerExport={() => { trackFunnel('Large File Choice', { choice: 'smaller_export' }); d.closeLarge(); router.push('/how-to-export'); }}
        onContinue={() => { trackFunnel('Large File Choice', { choice: 'continue' }); d.continueLarge(file); }}
        onCancel={() => { trackFunnel('Large File Choice', { choice: 'cancel' }); d.closeLarge(); }}
      />
    );
  }
  if (d.combinedNotice) return <CombinedExportNotice content={c.combinedExport} onContinue={d.continueCombined} />;
  if (d.deltaWarning) {
    const w = d.deltaWarning;
    return (
      <DeltaWarning
        reasons={w.reasons}
        followerCount={w.snapshot.followers.length}
        followingCount={w.snapshot.following.length}
        onReExport={() => { trackFunnel('Export Warning Choice', { choice: 're_export' }); d.closeDelta(); }}
        onNewAccount={() => { trackFunnel('Export Warning Choice', { choice: 'new_account' }); void d.proceedDelta(); }}
        onProceedAnyway={() => { trackFunnel('Export Warning Choice', { choice: 'proceed_anyway' }); void d.proceedDelta(); }}
        onSample={() => { trackFunnel('Export Warning Choice', { choice: 'sample' }); d.closeDelta(); router.push('/app?sample=1'); }}
        content={c.deltaWarning}
      />
    );
  }
  if (d.reveal) {
    const r = d.reveal;
    return (
      <RevealDialog
        comparison={r.comparison}
        sinceLabel={r.sinceLabel}
        locale={locale}
        onContinueFree={() => void d.revealContinueFree()}
        onClose={d.closeReveal}
        onCheckoutStart={() => savePendingReveal({ oldId: r.oldId, newId: r.newId })}
      />
    );
  }
  if (d.pending && d.oldestLabel) {
    return <UpgradeDialog oldestLabel={d.oldestLabel} onDeleteOldest={d.deleteOldest} onUpgrade={d.upgrade} onClose={d.closePending} content={c.upgradeDialog} />;
  }
  return null;
}
