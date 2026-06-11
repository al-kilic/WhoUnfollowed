'use client';

import { useState, useCallback } from 'react';
import {
  deriveKey,
  encrypt,
  decrypt,
  bufferToBase64,
  base64ToBuffer,
  generateSalt,
} from '@/lib/crypto';
import {
  uploadSnapshot,
  downloadSnapshot,
  listCloudSnapshots,
  type CloudSnapshotMeta,
} from '@/app/api/sync/actions';
import type { ParsedSnapshot } from '@ig-tracker/core';

type SyncState = 'idle' | 'loading' | 'error';

export function useCloudSync() {
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [saltB64, setSaltB64] = useState<string | null>(null);
  const [state, setState] = useState<SyncState>('idle');
  const [error, setError] = useState<string | null>(null);

  const unlock = useCallback(async (passphrase: string, existingSaltB64?: string) => {
    setState('loading');
    setError(null);
    try {
      const salt = existingSaltB64
        ? base64ToBuffer(existingSaltB64)
        : generateSalt();
      const derived = await deriveKey(passphrase, salt);
      setKey(derived);
      setSaltB64(existingSaltB64 ?? bufferToBase64(salt));
      setState('idle');
      return true;
    } catch {
      setError('Failed to unlock. Check your passphrase.');
      setState('error');
      return false;
    }
  }, []);

  const syncSnapshot = useCallback(
    async (label: string, exportedAt: number, data: ParsedSnapshot) => {
      if (!key || !saltB64) {
        setError('Unlock sync first by entering your passphrase.');
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
          saltB64,
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
        setError('Unlock sync first by entering your passphrase.');
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
    unlock,
    syncSnapshot,
    fetchSnapshot,
    listSnapshots,
  };
}
