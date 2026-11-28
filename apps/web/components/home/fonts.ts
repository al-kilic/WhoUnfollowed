import { Bricolage_Grotesque, Geist, Geist_Mono } from 'next/font/google';

// The homepage's type, self-hosted by next/font (no request to Google at
// runtime). Bricolage Grotesque for display, Geist for UI, Geist Mono for labels.
const display = Bricolage_Grotesque({ subsets: ['latin', 'latin-ext'], axes: ['opsz'], variable: '--font-hm-display', display: 'swap' });
const ui = Geist({ subsets: ['latin', 'latin-ext'], variable: '--font-geist', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

export const HM_FONTS = `${display.variable} ${ui.variable} ${mono.variable}`;
