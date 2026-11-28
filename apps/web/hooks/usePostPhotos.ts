'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/db';

export const MAX_PHOTOS = 20; // Instagram's carousel limit

// Shrinks a photo in the browser to at most 1080 px wide (Instagram's width)
// before keeping it, so many carousel photos fit in local storage.
async function shrink(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1080 / bmp.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext('2d')?.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b ?? file), 'image/jpeg', 0.85));
}

// Photos for one post, kept in this browser (IndexedDB) and never uploaded.
// key null: kept in memory only for this page (Create's preview).
export function usePostPhotos(key: string | null, max = MAX_PHOTOS, onChange?: () => void) {
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    if (!key) { setBlobs([]); return; }
    void db.postPhotos.get(key).then((r) => { if (alive) setBlobs(r?.photos ?? []); }).catch(() => undefined);
    return () => { alive = false; };
  }, [key]);

  useEffect(() => {
    const u = blobs.map((b) => URL.createObjectURL(b));
    setUrls(u);
    return () => u.forEach((x) => URL.revokeObjectURL(x));
  }, [blobs]);

  const save = (next: Blob[]) => {
    setBlobs(next);
    if (key) void db.postPhotos.put({ key, photos: next, updatedAt: Date.now() }).then(() => onChange?.()).catch(() => undefined);
  };
  const add = async (files: FileList | null) => {
    if (!files) return;
    const picked = [...files].filter((f) => f.type.startsWith('image/')).slice(0, max);
    const shrunk = await Promise.all(picked.map((f) => shrink(f).catch(() => f)));
    save([...blobs, ...shrunk].slice(0, max));
  };
  const remove = (i: number) => save(blobs.filter((_, j) => j !== i));
  const move = (i: number, by: -1 | 1) => {
    const j = i + by;
    if (j < 0 || j >= blobs.length) return;
    const next = [...blobs];
    [next[i], next[j]] = [next[j]!, next[i]!];
    save(next);
  };
  return { urls, blobs, add, remove, move, clear: () => save([]), full: blobs.length >= max };
}

// Which photo slot a planned post uses: its idea, plus a counter when the
// same idea repeats in the plan (every Tuesday, say), so each repeat keeps
// its own photos. Keyed by the post rather than the day, so photos follow
// a moved post.
export function planPhotoId(items: readonly { day: number; idea: string }[], it: { day: number; idea: string }): string {
  const n = items.filter((x) => x.idea === it.idea && x.day < it.day).length;
  return `${it.idea.slice(0, 120)}${n ? `#${n}` : ''}`;
}

export const postPhotoKey = (owner: string, planId: string, photoId: string) => `${owner}:${planId}:${photoId}`;

// The first photo of each planned post whose key starts with `prefix`
// (`${owner}:${planId}:`), as object URLs by post idea, for the calendar.
export function usePlanCovers(prefix: string | null, version: number): Map<string, string> {
  const [covers, setCovers] = useState<Map<string, string>>(new Map());
  useEffect(() => {
    if (!prefix) return;
    let alive = true;
    let made: string[] = [];
    void db.postPhotos.where('key').startsWith(prefix).toArray().then((rows) => {
      if (!alive) return;
      const m = new Map<string, string>();
      for (const r of rows) {
        const first = r.photos[0];
        if (!first) continue;
        const url = URL.createObjectURL(first);
        made.push(url);
        m.set(r.key.slice(prefix.length), url);
      }
      setCovers(m);
    }).catch(() => undefined);
    return () => { alive = false; made.forEach((u) => URL.revokeObjectURL(u)); made = []; };
  }, [prefix, version]);
  return covers;
}
