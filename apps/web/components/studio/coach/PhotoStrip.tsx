'use client';

import { ChevronLeft, ChevronRight, ImagePlus, X } from 'lucide-react';
import type { usePostPhotos } from '@/hooks/usePostPhotos';
import { useStudio } from '../StudioContext';
import { getStudioCoachContent } from './studioCoach.content';

// Thumbnails of a post's photos. A carousel takes several (in order, each
// one movable); other formats take one. Photos never leave the browser.
// swipeNote: say the phone preview can be swiped (only where there is one).
export function PhotoStrip({ photos, multiple, max, swipeNote = true }: { photos: ReturnType<typeof usePostPhotos>; multiple: boolean; max: number; swipeNote?: boolean }) {
  const { locale } = useStudio();
  const k = getStudioCoachContent(locale).phone;
  const limit = multiple ? max : 1;
  const canAdd = photos.urls.length < limit;
  return (
    <div className="s-col" style={{ gap: 6 }}>
      <div className="s-pick">
        {photos.urls.slice(0, limit).map((u, i) => (
          <span key={u} className="s-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
            <img src={u} alt="" />
            <button type="button" aria-label={`${k.removePhoto} ${i + 1}`} onClick={() => photos.remove(i)}><X size={11} /></button>
            {multiple && photos.urls.length > 1 && (
              <span className="s-thumb-mv">
                <button type="button" aria-label={`${k.moveLeft} ${i + 1}`} disabled={i === 0} onClick={() => photos.move(i, -1)}><ChevronLeft size={11} /></button>
                <button type="button" aria-label={`${k.moveRight} ${i + 1}`} disabled={i === photos.urls.length - 1} onClick={() => photos.move(i, 1)}><ChevronRight size={11} /></button>
              </span>
            )}
          </span>
        ))}
        {canAdd && (
          <label className="s-btn sec xs" style={{ cursor: 'pointer', flex: 'none' }}><ImagePlus size={14} />{multiple ? k.addPhotos : k.addPhoto}
            <input type="file" accept="image/*" multiple={multiple} hidden onChange={(e) => { void photos.add(e.target.files); e.target.value = ''; }} /></label>
        )}
      </div>
      <span className="s-sub-t" style={{ fontSize: 12 }}>{multiple ? `${k.count(photos.urls.length, max)} · ${swipeNote ? `${k.carouselNote} ` : ''}` : ''}{k.photoNote}</span>
    </div>
  );
}
