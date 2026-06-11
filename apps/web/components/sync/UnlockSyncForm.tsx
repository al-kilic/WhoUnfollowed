'use client';

import { useState } from 'react';

interface Props {
  onUnlock: (passphrase: string) => Promise<boolean>;
}

export function UnlockSyncForm({ onUnlock }: Props) {
  const [passphrase, setPassphrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await onUnlock(passphrase);
    setLoading(false);
    if (!ok) setError('Wrong passphrase. Try again.');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Enter your sync passphrase to enable cloud sync on this device.
      </p>
      <div className="flex gap-2">
        <input
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder="Sync passphrase"
          required
          autoComplete="current-password"
          className="flex-1 border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 shrink-0"
        >
          {loading ? 'Unlocking...' : 'Unlock'}
        </button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
