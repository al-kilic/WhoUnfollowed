'use client';

import { useState } from 'react';
import { generateSalt, deriveKey, bufferToBase64 } from '@/lib/crypto';

interface Props {
  onReady: (key: CryptoKey, saltB64: string) => void;
}

export function SetPassphraseForm({ onReady }: Props) {
  const [passphrase, setPassphrase] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (passphrase.length < 12) {
      setError('Passphrase must be at least 12 characters.');
      return;
    }

    if (passphrase !== confirm) {
      setError('Passphrases do not match.');
      return;
    }

    if (!acknowledged) {
      setError('You must acknowledge the warning before continuing.');
      return;
    }

    setLoading(true);
    try {
      const salt = generateSalt();
      const key = await deriveKey(passphrase, salt);
      onReady(key, bufferToBase64(salt));
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm text-yellow-700 dark:text-yellow-300">
        <p className="font-semibold mb-1">Your passphrase cannot be recovered.</p>
        <p>
          Snapshots are encrypted in your browser before being stored. If you
          forget this passphrase, your cloud snapshots are permanently
          unreadable. We cannot help you recover them.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="passphrase" className="text-sm font-medium">
          Sync passphrase
        </label>
        <input
          id="passphrase"
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          minLength={12}
          required
          autoComplete="new-password"
          className="border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground">Minimum 12 characters.</p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="confirm" className="text-sm font-medium">
          Confirm passphrase
        </label>
        <input
          id="confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
          className="border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <label className="flex items-start gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          I understand that if I forget this passphrase, my synced snapshots
          cannot be recovered.
        </span>
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Setting up...' : 'Set passphrase and enable sync'}
      </button>
    </form>
  );
}
