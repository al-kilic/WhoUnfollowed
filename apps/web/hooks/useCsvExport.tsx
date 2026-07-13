'use client';

import { useCallback, useRef, useState } from 'react';
import type { Account } from '@ig-tracker/core';
import { downloadCsv } from '@/lib/csv';
import { useAuth } from '@/components/AuthProvider';
import { track, Events } from '@/lib/analytics';
import { freeCsvExportUsed, markFreeCsvExportUsed } from '@/lib/exportLimit';
import { EmailCaptureModal } from '@/components/EmailCaptureModal';
import { ExportLimitModal } from '@/components/ExportLimitModal';

// Centralises CSV export gating so every list behaves the same:
//  - Pro             -> download immediately, every time
//  - logged-in free  -> download immediately, every time (unlimited exports are
//                       the tangible reason to create a free account)
//  - logged-out, 1st -> email-capture modal (email optional, for product updates),
//                       then download. The CSV never leaves the browser.
//  - logged-out, 2nd -> "create a free account" prompt (a free account lifts the
//                       one-export limit; Pro is offered as the deeper option)
export function useCsvExport(csvFilename: string) {
  const { isPro, userEmail } = useAuth();
  const [modal, setModal] = useState<'capture' | 'limit' | null>(null);
  const pending = useRef<Account[]>([]);

  const requestExport = useCallback((accounts: Account[]) => {
    if (isPro) {
      track(Events.csvExport, { mode: 'pro' });
      downloadCsv(accounts, csvFilename);
      return;
    }
    if (userEmail) {
      // Logged-in free user: unlimited exports, no prompt, no limit.
      track(Events.csvExport, { mode: 'free' });
      downloadCsv(accounts, csvFilename);
      return;
    }
    // Anonymous below.
    if (freeCsvExportUsed()) {
      setModal('limit');
      return;
    }
    // Anonymous first export: offer the optional email capture, then download.
    pending.current = accounts;
    setModal('capture');
  }, [isPro, userEmail, csvFilename]);

  const modalEl =
    modal === 'capture' ? (
      <EmailCaptureModal
        csvFilename={csvFilename}
        onClose={() => setModal(null)}
        onDownload={() => {
          downloadCsv(pending.current, csvFilename);
          markFreeCsvExportUsed();
        }}
      />
    ) : modal === 'limit' ? (
      <ExportLimitModal onClose={() => setModal(null)} />
    ) : null;

  return { requestExport, modal: modalEl };
}
