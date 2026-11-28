'use client';

import { useCallback, useEffect, useState } from 'react';

// The member's avatar: one of the animal icons in /public/avatars, or a photo
// they picked, resized in the browser. Kept in this browser only; nothing is
// uploaded. Every component using it updates together.

export const ANIMALS = ['fox', 'cat', 'owl', 'panda', 'koala', 'tiger', 'rabbit', 'bear', 'frog', 'hamster'] as const;
export type Animal = (typeof ANIMALS)[number];
export type AvatarValue = { kind: 'animal'; animal: Animal } | { kind: 'photo'; src: string };

const KEY = 'wu:avatar';
const EVENT = 'wu:avatar';

function defaultFor(seed: string): AvatarValue {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return { kind: 'animal', animal: ANIMALS[h % ANIMALS.length]! };
}

function read(seed: string): AvatarValue {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw?.startsWith('animal:')) {
      const a = raw.slice(7) as Animal;
      if (ANIMALS.includes(a)) return { kind: 'animal', animal: a };
    }
    if (raw?.startsWith('data:image/')) return { kind: 'photo', src: raw };
  } catch { /* storage blocked */ }
  return defaultFor(seed);
}

// Square-crops and shrinks a picked photo to 192px, as a small JPEG.
export async function shrinkAvatar(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const side = Math.min(bmp.width, bmp.height);
  const c = document.createElement('canvas');
  c.width = c.height = 192;
  c.getContext('2d')?.drawImage(bmp, (bmp.width - side) / 2, (bmp.height - side) / 2, side, side, 0, 0, 192, 192);
  bmp.close();
  return c.toDataURL('image/jpeg', 0.85);
}

export function useAvatar(seed: string) {
  const [value, setValue] = useState<AvatarValue>(() => defaultFor(seed));
  useEffect(() => {
    const sync = () => setValue(read(seed));
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener('storage', sync); };
  }, [seed]);
  const save = useCallback((v: AvatarValue | null) => {
    try {
      if (!v) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, v.kind === 'animal' ? `animal:${v.animal}` : v.src);
    } catch { /* storage full or blocked */ }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { value, save };
}

export const avatarSrc = (v: AvatarValue) => (v.kind === 'animal' ? `/avatars/${v.animal}.svg` : v.src);
