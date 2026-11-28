import { AI_CHAT_LIMITS } from '@ig-tracker/core';

// Server-side checks for photos attached to Ask coach. The schema already caps
// count, size and the declared type; this decodes the file header to make sure
// the bytes really are a JPEG, PNG or WebP of the type declared, and that the
// decoded size is within limits. No image library: only the header is read.

export type ImageCheck = { ok: true; type: 'jpeg' | 'png' | 'webp'; width: number; height: number } | { ok: false; reason: 'format' | 'mismatch' | 'dimensions' | 'unreadable' };

const PREFIX = /^data:image\/(jpeg|png|webp);base64,/;

function header(dataUrl: string): { declared: 'jpeg' | 'png' | 'webp'; bytes: Uint8Array } | null {
  const m = PREFIX.exec(dataUrl);
  if (!m) return null;
  // Enough of the file for any header (JPEG SOF markers can sit after EXIF).
  const b64 = dataUrl.slice(m[0].length, m[0].length + 87_384);
  try {
    return { declared: m[1] as 'jpeg' | 'png' | 'webp', bytes: Uint8Array.from(Buffer.from(b64, 'base64')) };
  } catch { return null; }
}

const u16be = (b: Uint8Array, i: number) => (b[i]! << 8) | b[i + 1]!;
const u24le = (b: Uint8Array, i: number) => b[i]! | (b[i + 1]! << 8) | (b[i + 2]! << 16);

function sniff(b: Uint8Array): { type: 'jpeg' | 'png' | 'webp'; width: number; height: number } | null {
  if (b.length > 24 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    const w = (b[16]! << 24 >>> 0) + (b[17]! << 16) + (b[18]! << 8) + b[19]!;
    const h = (b[20]! << 24 >>> 0) + (b[21]! << 16) + (b[22]! << 8) + b[23]!;
    return { type: 'png', width: w, height: h };
  }
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1]!;
      if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01 || marker === 0xff) { i += marker === 0xff ? 1 : 2; continue; }
      const len = u16be(b, i + 2);
      const sof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (sof) return { type: 'jpeg', height: u16be(b, i + 5), width: u16be(b, i + 7) };
      if (len < 2) return null;
      i += 2 + len;
    }
    return null;
  }
  if (b.length > 30 && String.fromCharCode(...b.slice(0, 4)) === 'RIFF' && String.fromCharCode(...b.slice(8, 12)) === 'WEBP') {
    const chunk = String.fromCharCode(...b.slice(12, 16));
    if (chunk === 'VP8 ') return { type: 'webp', width: (b[26]! | (b[27]! << 8)) & 0x3fff, height: (b[28]! | (b[29]! << 8)) & 0x3fff };
    if (chunk === 'VP8L') { const v = b[21]! | (b[22]! << 8) | (b[23]! << 16) | (b[24]! << 24); return { type: 'webp', width: (v & 0x3fff) + 1, height: ((v >> 14) & 0x3fff) + 1 }; }
    if (chunk === 'VP8X') return { type: 'webp', width: u24le(b, 24) + 1, height: u24le(b, 27) + 1 };
  }
  return null;
}

export function checkChatImage(dataUrl: string): ImageCheck {
  const h = header(dataUrl);
  if (!h) return { ok: false, reason: 'format' };
  const s = sniff(h.bytes);
  if (!s) return { ok: false, reason: 'unreadable' };
  if (s.type !== h.declared) return { ok: false, reason: 'mismatch' };
  const max = AI_CHAT_LIMITS.imageMaxSide;
  if (s.width < 1 || s.height < 1 || s.width > max || s.height > max) return { ok: false, reason: 'dimensions' };
  return { ok: true, ...s };
}

// Per member: at most this many questions with attachments in a rolling
// window, on top of the allowance and its daily pace limit.
const WINDOW_MS = 10 * 60_000;
const MAX_IN_WINDOW = 10;
const recent = new Map<string, number[]>();

export function underAttachLimit(userId: string, now: number = Date.now()): boolean {
  const list = (recent.get(userId) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_IN_WINDOW) { recent.set(userId, list); return false; }
  list.push(now);
  recent.set(userId, list);
  if (recent.size > 5000) for (const [k, v] of recent) if (!v.some((t) => now - t < WINDOW_MS)) recent.delete(k);
  return true;
}
export const ATTACH_LIMIT = { windowMs: WINDOW_MS, max: MAX_IN_WINDOW } as const;
