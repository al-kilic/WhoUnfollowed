import { AtSign, Instagram, Music2 } from 'lucide-react';
import type { Platform } from '@/lib/platform';

// Line glyphs in the same style as the rest of the UI. The at-sign stands in
// for the Threads mark and a music note for TikTok's.
const ICONS = { instagram: Instagram, threads: AtSign, tiktok: Music2 } as const;

export function PlatformIcon({ platform, size = 14 }: { platform: Platform; size?: number }) {
  const Icon = ICONS[platform];
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
