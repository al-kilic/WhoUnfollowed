'use client';

const PBKDF2_ITERATIONS = 310_000; // OWASP 2024 minimum for SHA-256
const KEY_LENGTH = 256;

export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}

export async function deriveKey(
  passphrase: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH },
    // extractable: the derived key is exported to raw bytes and cached in
    // sessionStorage so cloud sync stays unlocked across page refreshes
    // without re-prompting. Cleared on logout / tab close.
    true,
    ['encrypt', 'decrypt'],
  );
}

// Export an AES-GCM key to a base64 string for short-lived sessionStorage caching.
export async function exportKeyRaw(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey('raw', key);
  return bufferToBase64(raw);
}

// Re-import a base64 raw key produced by exportKeyRaw.
export async function importKeyRaw(b64: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    base64ToBuffer(b64).buffer as ArrayBuffer,
    { name: 'AES-GCM', length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt'],
  );
}

export async function encrypt(
  data: unknown,
  key: CryptoKey,
): Promise<{ ciphertext: ArrayBuffer; iv: Uint8Array }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded,
  );

  return { ciphertext, iv };
}

export async function decrypt(
  ciphertext: ArrayBuffer,
  iv: Uint8Array,
  key: CryptoKey,
): Promise<unknown> {
  let plaintext: ArrayBuffer;

  try {
    plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
      key,
      ciphertext,
    );
  } catch {
    throw new Error('Decryption failed. Check your sync passphrase and try again.');
  }

  return JSON.parse(new TextDecoder().decode(plaintext));
}

export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return btoa(String.fromCharCode(...bytes));
}

export function base64ToBuffer(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}
