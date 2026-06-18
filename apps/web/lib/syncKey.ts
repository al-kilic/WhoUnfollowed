'use client';

// Manages the cloud-sync encryption key for the current browser session.
//
// The key is derived (PBKDF2) from the user's account password at login/signup
// and cached here so the user never types a separate passphrase. We cache the
// raw key bytes in sessionStorage so sync stays unlocked across refreshes but is
// cleared when the tab closes or on logout. The account password itself is never
// stored.

import { deriveKey, exportKeyRaw, importKeyRaw, base64ToBuffer } from '@/lib/crypto';

const KEY_STORAGE = 'wu.syncKey';
const SALT_STORAGE = 'wu.syncSalt';

// Derive the sync key from the account password + the user's server-stored salt,
// then cache it for the session. Returns the live CryptoKey.
export async function deriveAndStoreSyncKey(
  password: string,
  saltB64: string,
): Promise<CryptoKey> {
  const key = await deriveKey(password, base64ToBuffer(saltB64));
  try {
    sessionStorage.setItem(KEY_STORAGE, await exportKeyRaw(key));
    sessionStorage.setItem(SALT_STORAGE, saltB64);
  } catch {
    // sessionStorage may be unavailable (private mode); key still works in-memory
  }
  return key;
}

// Load the cached sync key for this session, or null if not unlocked.
export async function loadSyncKey(): Promise<CryptoKey | null> {
  try {
    const raw = sessionStorage.getItem(KEY_STORAGE);
    if (!raw) return null;
    return await importKeyRaw(raw);
  } catch {
    return null;
  }
}

export function loadSyncSalt(): string | null {
  try {
    return sessionStorage.getItem(SALT_STORAGE);
  } catch {
    return null;
  }
}

export function clearSyncKey(): void {
  try {
    sessionStorage.removeItem(KEY_STORAGE);
    sessionStorage.removeItem(SALT_STORAGE);
  } catch {
    // ignore
  }
}
