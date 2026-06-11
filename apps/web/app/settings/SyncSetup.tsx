'use client';

import { useState } from 'react';
import { SetPassphraseForm } from '@/components/sync/SetPassphraseForm';
import { saveSyncSalt } from './actions';

interface Props {
  hasSyncSetup: boolean;
  passphraseSetAt: Date | null;
}

export function SyncSetup({ hasSyncSetup, passphraseSetAt }: Props) {
  const [saved, setSaved] = useState(hasSyncSetup);
  const [savedAt] = useState(passphraseSetAt);

  async function handleReady(_key: CryptoKey, saltB64: string) {
    await saveSyncSalt(saltB64);
    setSaved(true);
  }

  if (saved) {
    return (
      <div className="rounded-lg border p-4 text-sm">
        <p className="font-medium text-green-600 dark:text-green-400">Sync is set up on this account.</p>
        <p className="text-muted-foreground mt-1">
          Passphrase set{savedAt ? ` ${savedAt.toLocaleDateString()}` : ''}.
          To change it, you will need to re-encrypt all cloud snapshots.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4 flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Set up a sync passphrase to start saving snapshots to the cloud.
        Your data is encrypted in your browser before it leaves your device.
      </p>
      <SetPassphraseForm onReady={handleReady} />
    </div>
  );
}
