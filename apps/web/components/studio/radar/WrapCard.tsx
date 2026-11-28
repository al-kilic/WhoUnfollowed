'use client';

import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';

export type PhotoSlot = 'wrap' | 'verdict';

// Bundled photos (public/home/post), one per day and slot, so nothing is
// fetched from a photo service and no credit link is needed.
const PHOTOS = Array.from({ length: 10 }, (_, i) => `/home/post/ph${String(i + 1).padStart(2, '0')}.jpg`);
export const photoSrc = (slot: PhotoSlot, now: Date = new Date()) => {
  const day = Math.floor(now.getTime() / 86_400_000) + (slot === 'verdict' ? 5 : 0);
  return PHOTOS[day % PHOTOS.length]!;
};

// Today's photo for a card: whether it loaded. `credit` stays null (bundled).
export function useCardPhoto(slot: PhotoSlot) {
  const [ok, setOk] = useState(false);
  const [src] = useState(() => photoSrc(slot));
  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.onload = () => { if (alive) setOk(true); };
    img.src = src;
    return () => { alive = false; };
  }, [src]);
  return { ok, credit: null as { photographer: string; page: string } | null, src };
}

export function PhotoCredit({ credit }: { credit: { photographer: string; page: string } | null }) {
  if (!credit?.photographer) return null;
  return <a className="s-credit" href={credit.page} target="_blank" rel="noopener noreferrer">{credit.photographer}</a>;
}

// The 3-month wrap card: a fresh photo each day, or a teal gradient when there is none.
export function WrapCard({ onOpen, kicker, title, sub, label }: { onOpen: () => void; kicker: string; title: string; sub: string; label: string }) {
  const p = useCardPhoto('wrap');
  return (
    <div className="s-card s-wrapc s-onphoto" style={p.ok ? { backgroundImage: `var(--s-scrim-b), url(${p.src})` } : undefined}>
      <button type="button" className="s-wrapc-hit" onClick={onOpen} aria-label={label} />
      <span className="s-wplay" aria-hidden="true"><Play size={22} /></span>
      <div className="s-col" style={{ gap: 4 }}>
        <span className="s-lab">{kicker}</span>
        <h2>{title}</h2>
        <span className="s-sub-t">{sub}</span>
      </div>
      {p.ok && <PhotoCredit credit={p.credit} />}
    </div>
  );
}
