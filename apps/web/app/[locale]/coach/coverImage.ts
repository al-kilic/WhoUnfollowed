'use client';

// Prepares a cover image for the pre-post check, entirely in the browser:
// scales it to at most 1024 px and re-encodes it as JPEG. Drawing to a canvas
// drops all metadata (EXIF, including location), so none of it is uploaded.
const MAX_SIDE = 1024;

export async function prepareCover(file: File, maxSide = MAX_SIDE, quality = 0.82): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('not_image');
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no_canvas');
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', quality);
}
