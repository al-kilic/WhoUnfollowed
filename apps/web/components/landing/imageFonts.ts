import { DM_Mono, DM_Sans, Instrument_Serif } from 'next/font/google';

// The type of the share images (verdict card, quarter wrap) and the Radar
// sweep numbers, self-hosted by next/font. They used to come from a Google
// Fonts stylesheet in the root layout: a render-blocking request to Google
// on every page, which also handed Google each visitor's IP. Not preloaded:
// a font file downloads only when an image actually draws with it.
const serif = Instrument_Serif({ weight: '400', style: ['normal', 'italic'], subsets: ['latin', 'latin-ext'], preload: false, display: 'swap' });
const sans = DM_Sans({ style: ['normal', 'italic'], axes: ['opsz'], subsets: ['latin', 'latin-ext'], preload: false, display: 'swap' });
const mono = DM_Mono({ weight: ['400', '500'], subsets: ['latin'], preload: false, display: 'swap' });

export const IMAGE_SERIF = `${serif.style.fontFamily}, Georgia, serif`;
export const IMAGE_SANS = `${sans.style.fontFamily}, system-ui, sans-serif`;
export const IMAGE_MONO = `${mono.style.fontFamily}, monospace`;

// Canvas text never waits for a web font, so load the faces first.
export async function loadImageFonts(): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) return;
  const faces = [`400 16px ${IMAGE_SERIF}`, `italic 400 16px ${IMAGE_SERIF}`, `400 16px ${IMAGE_SANS}`, `500 16px ${IMAGE_SANS}`];
  try { await Promise.all(faces.map((f) => document.fonts.load(f))); await document.fonts.ready; } catch { /* system fonts */ }
}
