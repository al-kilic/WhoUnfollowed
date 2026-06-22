import { describe, it, expect } from 'vitest';
import {
  generateSalt,
  deriveKey,
  encrypt,
  decrypt,
  exportKeyRaw,
  importKeyRaw,
  bufferToBase64,
  base64ToBuffer,
} from './crypto';

describe('generateSalt', () => {
  it('returns 16 random bytes', () => {
    const salt = generateSalt();
    expect(salt).toBeInstanceOf(Uint8Array);
    expect(salt.length).toBe(16);
  });

  it('returns different values each call', () => {
    const a = generateSalt();
    const b = generateSalt();
    expect(bufferToBase64(a)).not.toBe(bufferToBase64(b));
  });
});

describe('deriveKey', () => {
  it('derives a CryptoKey from passphrase + salt', async () => {
    const salt = generateSalt();
    const key = await deriveKey('correct-horse-battery-staple', salt);
    expect(key).toBeInstanceOf(CryptoKey);
    expect(key.algorithm.name).toBe('AES-GCM');
    expect(key.usages).toContain('encrypt');
    expect(key.usages).toContain('decrypt');
  });

  it('produces the same key for the same inputs', async () => {
    const salt = generateSalt();
    const passphrase = 'same-passphrase-123';
    const key1 = await deriveKey(passphrase, salt);
    const key2 = await deriveKey(passphrase, salt);

    // Encrypt with key1, decrypt with key2 — should succeed
    const { ciphertext, iv } = await encrypt({ test: true }, key1);
    const result = await decrypt(ciphertext, iv, key2);
    expect(result).toEqual({ test: true });
  });

  it('produces different keys for different salts', async () => {
    const passphrase = 'same-passphrase-456';
    const key1 = await deriveKey(passphrase, generateSalt());
    const key2 = await deriveKey(passphrase, generateSalt());

    const { ciphertext, iv } = await encrypt({ data: 'secret' }, key1);
    await expect(decrypt(ciphertext, iv, key2)).rejects.toThrow(
      'Decryption failed',
    );
  });
});

describe('encrypt / decrypt', () => {
  it('round-trips arbitrary JSON data', async () => {
    const key = await deriveKey('test-passphrase-abc', generateSalt());
    const data = {
      followers: ['alice', 'bob'],
      following: ['carol'],
      timestamp: 1234567890,
    };

    const { ciphertext, iv } = await encrypt(data, key);
    const result = await decrypt(ciphertext, iv, key);
    expect(result).toEqual(data);
  });

  it('uses a fresh IV each call', async () => {
    const key = await deriveKey('test-passphrase-def', generateSalt());
    const data = { n: 1 };
    const a = await encrypt(data, key);
    const b = await encrypt(data, key);
    expect(bufferToBase64(a.iv)).not.toBe(bufferToBase64(b.iv));
  });

  it('throws a clear error on tampered ciphertext', async () => {
    const key = await deriveKey('test-passphrase-ghi', generateSalt());
    const { ciphertext, iv } = await encrypt({ secret: 'data' }, key);

    const tampered = ciphertext.slice(0) as ArrayBuffer;
    const tamperedBytes = new Uint8Array(tampered);
    if (tamperedBytes[0] !== undefined) tamperedBytes[0] ^= 0xff;

    await expect(decrypt(tampered, iv, key)).rejects.toThrow(
      'Decryption failed',
    );
  });

  it('throws a clear error with wrong key', async () => {
    const salt = generateSalt();
    const goodKey = await deriveKey('correct-passphrase', salt);
    const wrongKey = await deriveKey('wrong-passphrase', salt);

    const { ciphertext, iv } = await encrypt({ value: 42 }, goodKey);
    await expect(decrypt(ciphertext, iv, wrongKey)).rejects.toThrow(
      'Decryption failed',
    );
  });
});

describe('exportKeyRaw / importKeyRaw', () => {
  it('re-imported key decrypts data encrypted with the original (sessionStorage path)', async () => {
    const salt = generateSalt();
    const key = await deriveKey('account-password', salt);
    const { ciphertext, iv } = await encrypt({ secret: 'data' }, key);

    const exported = await exportKeyRaw(key);
    const reimported = await importKeyRaw(exported);

    expect(await decrypt(ciphertext, iv, reimported)).toEqual({ secret: 'data' });
  });

  it('a key re-derived from the same password + salt decrypts (new-device login)', async () => {
    const salt = generateSalt();
    const saltB64 = bufferToBase64(salt);
    const key1 = await deriveKey('account-password', salt);
    const { ciphertext, iv } = await encrypt({ n: 7 }, key1);

    // simulate logging in on another device: same password, salt from server
    const key2 = await deriveKey('account-password', base64ToBuffer(saltB64));
    expect(await decrypt(ciphertext, iv, key2)).toEqual({ n: 7 });
  });
});

describe('bufferToBase64 / base64ToBuffer', () => {
  it('round-trips Uint8Array', () => {
    const original = new Uint8Array([1, 2, 3, 255, 0, 128]);
    const b64 = bufferToBase64(original);
    const back = base64ToBuffer(b64);
    expect(back).toEqual(original);
  });

  it('round-trips ArrayBuffer', () => {
    const buf = new Uint8Array([10, 20, 30]).buffer;
    const b64 = bufferToBase64(buf);
    const back = base64ToBuffer(b64);
    expect(back).toEqual(new Uint8Array([10, 20, 30]));
  });

  it('round-trips a large buffer without overflowing the call stack', () => {
    // Regression: spreading the whole array into String.fromCharCode(...)
    // threw "Maximum call stack size exceeded" on real snapshot ciphertexts.
    const large = new Uint8Array(500_000);
    for (let i = 0; i < large.length; i++) large[i] = i % 256;
    const b64 = bufferToBase64(large);
    expect(base64ToBuffer(b64)).toEqual(large);
  });

  it('round-trips an encrypted blob from a large snapshot', async () => {
    const key = await deriveKey('account-password', generateSalt());
    const big = {
      followers: Array.from({ length: 4000 }, (_, i) => ({ username: `user_${i}`, href: `https://instagram.com/user_${i}`, timestamp: 1700000000 + i })),
      following: Array.from({ length: 3000 }, (_, i) => ({ username: `follow_${i}`, href: `https://instagram.com/follow_${i}`, timestamp: 1700000000 + i })),
    };
    const { ciphertext, iv } = await encrypt(big, key);
    // This is the upload path that previously overflowed.
    const b64 = bufferToBase64(ciphertext);
    const restored = base64ToBuffer(b64).buffer as ArrayBuffer;
    expect(await decrypt(restored, iv, key)).toEqual(big);
  });
});
