'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  encrypt,
  decrypt,
  bufferToBase64,
  base64ToBuffer,
} from '@/lib/crypto';
import {
  deriveAndStoreSyncKey,
  loadSyncKey,
  loadSyncSalt,
} from '@/lib/syncKey';
import {
  uploadSnapshot,
  downloadSnapshot,
  listCloudSnapshots,
  getUserSyncSalt,
  type CloudSnapshotMeta,
} from '@/app/api/sync/actions';
import type { ParsedSnapshot } from '@ig-tracker/core';

type SyncState = 'idle' | 'loading' | 'error';

export function useCloudSync() {
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [saltB64, setSaltB64] = useState<string | null>(null);
  const [state, setState] = useState<SyncState>('idle');
  const [error, setError] = useState<string | null>(null);

  // Cloud sync unlocks automatically: the key was derived from the account
  // password at login and cached in sessionStorage. Load it on mount.
  useEffect(() => {
    let active = true;
    (async () => {
      const cached = await loadSyncKey();
      if (active && cached) {
        setKey(cached);
        setSaltB64(loadSyncSalt());
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Fallback used only when the session key is missing (e.g. sessionStorage was
  // cleared but the login cookie is still valid). Re-derives from the account
  // password — no separate passphrase.
  const unlockWithPassword = useCallback(async (password: string) => {
    setState('loading');
    setError(null);
    try {
      const salt = await getUserSyncSalt();
      if (!salt) {
        setError('Sync is not set up for this account yet.');
        setState('error');
        return false;
      }
      const derived = await deriveAndStoreSyncKey(password, salt);
      setKey(derived);
      setSaltB64(salt);
      setState('idle');
      return true;
    } catch {
      setError('Wrong password. Try again.');
      setState('error');
      return false;
    }
  }, []);

  const syncSnapshot = useCallback(
    async (label: string, exportedAt: number, data: ParsedSnapshot) => {
      if (!key) {
        setError('Cloud sync is locked. Re-enter your password to unlock.');
        return null;
      }
      const salt = saltB64 ?? loadSyncSalt() ?? (await getUserSyncSalt());
      if (!salt) {
        setError('Sync salt missing. Try logging in again.');
        return null;
      }
      setState('loading');
      setError(null);
      try {
        const { ciphertext, iv } = await encrypt(data, key);
        const result = await uploadSnapshot({
          label,
          exportedAt,
          ciphertextB64: bufferToBase64(ciphertext),
          ivB64: bufferToBase64(iv),
          saltB64: salt,
        });
        setState('idle');
        if (!result.ok) {
          setError(result.error);
          return null;
        }
        return result.id;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Upload failed.');
        setState('error');
        return null;
      }
    },
    [key, saltB64],
  );

  const fetchSnapshot = useCallback(
    async (id: string): Promise<ParsedSnapshot | null> => {
      if (!key) {
        setError('Cloud sync is locked. Re-enter your password to unlock.');
        return null;
      }
      setState('loading');
      setError(null);
      try {
        const payload = await downloadSnapshot(id);
        if (!payload) {
          setError('Snapshot not found.');
          setState('error');
          return null;
        }
        const ciphertext = base64ToBuffer(payload.ciphertextB64).buffer as ArrayBuffer;
        const iv = base64ToBuffer(payload.ivB64);
        const data = await decrypt(ciphertext, iv, key) as ParsedSnapshot;
        setState('idle');
        return data;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Decryption failed.');
        setState('error');
        return null;
      }
    },
    [key],
  );

  const listSnapshots = useCallback(async (): Promise<CloudSnapshotMeta[]> => {
    setState('loading');
    setError(null);
    try {
      const items = await listCloudSnapshots();
      setState('idle');
      return items;
    } catch {
      setError('Failed to load cloud snapshots.');
      setState('error');
      return [];
    }
  }, []);

  return {
    isUnlocked: key !== null,
    state,
    error,
    unlockWithPassword,
    syncSnapshot,
    fetchSnapshot,
    listSnapshots,
  };
}
