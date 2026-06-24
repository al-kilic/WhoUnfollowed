'use client';

import { useCallback, useRef, useState } from 'react';
import type { Account } from '@ig-tracker/core';
import { downloadCsv } from '@/lib/csv';
import { useAuth } from '@/components/AuthProvider';
import { freeCsvExportUsed, markFreeCsvExportUsed } from '@/lib/exportLimit';
import { EmailCaptureModal } from '@/components/EmailCaptureModal';
import { ExportLimitModal } from '@/components/ExportLimitModal';

// Centralises CSV export gating so every list behaves the same:
//  - Pro            -> download immediately, every time
//  - free, used up  -> upgrade prompt (one free export only)
//  - logged-in free -> download immediately (first time), no email prompt
//  - logged-out     -> email-capture modal (email optional, for product updates),
//                      then download. The CSV never leaves the browser.
export function useCsvExport(csvFilename: string) {
  const { isPro, userEmail } = useAuth();
  const [modal, setModal] = useState<'capture' | 'limit' | null>(null);
  const pending = useRef<Account[]>([]);

  const requestExport = useCallback((accounts: Account[]) => {
    if (isPro) {
      downloadCsv(accounts, csvFilename);
      return;
    }
    if (freeCsvExportUsed()) {
      setModal('limit');
      return;
    }
    if (userEmail) {
      // Logged-in free user: automatic export, no email prompt.
      downloadCsv(accounts, csvFilename);
      markFreeCsvExportUsed();
      return;
    }
    // Logged-out, first export: offer the optional email capture.
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
