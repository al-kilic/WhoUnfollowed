// Every limit for things members upload or drop, in one place. The browser
// checks these before anything is read or sent (fast feedback), and the
// server checks them again (the only check that counts). AI routes that take
// uploads also get an hourly cap and refuse the same request twice in a row,
// on top of the monthly allowance and the daily pace.

export const UPLOAD_LIMITS = {
  // Files picked or dropped in the browser.
  client: {
    imageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'] as const,
    maxImageBytes: 25 * 1024 * 1024,
    // Decoded size: refuses "image bombs" (tiny files that decode huge).
    maxImagePixels: 60_000_000,
    maxImageSide: 12_000,
    maxPhotoPicks: 24,
    maxPastedChars: 20_000,
  },
  // Request bodies on the server, in bytes (JSON, photos already resized to
  // small JPEG data URLs in the browser).
  body: {
    voice: 64_000,
    photoStyle: 24 * 250_000 + 16_000,
    insights: 8 * 250_000 + 64_000,
    chat: 3 * 250_000 + 48_000,
  },
  // Calls per member per hour, per route.
  perHour: {
    voice: 12,
    photoStyle: 4,
    insights: 8,
    chatAttachments: 40,
  },
  // The same body again within this window is refused as a duplicate.
  dedupeMinutes: 10,
} as const;

export type UploadRoute = keyof typeof UPLOAD_LIMITS.perHour;
