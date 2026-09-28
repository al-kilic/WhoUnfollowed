import { AtSign, Instagram } from 'lucide-react';
import type { Platform } from '@/lib/platform';

// Line glyphs in the same style as the rest of the UI. The at-sign stands in
// for the Threads mark.
export function PlatformIcon({ platform, size = 14 }: { platform: Platform; size?: number }) {
  const Icon = platform === 'threads' ? AtSign : Instagram;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
