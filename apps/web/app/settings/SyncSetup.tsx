'use client';

interface Props {
  hasSyncSetup: boolean;
  passphraseSetAt: Date | null;
}

// Cloud sync no longer needs a separate passphrase. The encryption key is
// derived from the account password at login and cached for the session, so
// this is now an informational status panel rather than a setup form.
export function SyncSetup({ hasSyncSetup, passphraseSetAt }: Props) {
  return (
    <div className="rounded-lg border p-4 text-sm flex flex-col gap-1">
      <p className="font-medium text-green-600 dark:text-green-400">
        Cloud sync is on.
      </p>
      <p className="text-muted-foreground">
        Your snapshots are encrypted in your browser with a key derived from your
        account password before they are stored. We never see your unencrypted
        data. Nothing to set up or remember.
        {hasSyncSetup && passphraseSetAt
          ? ` Enabled ${passphraseSetAt.toLocaleDateString()}.`
          : ''}
      </p>
    </div>
  );
}
