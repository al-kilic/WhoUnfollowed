import { UPLOAD_LIMITS } from '@/lib/uploadLimits';

// Checks a picked file before it is read: an image type, not too big, and not
// a "bomb" that decodes to a huge size. Runs in the browser only.
const L = UPLOAD_LIMITS.client;

export function imageFileOk(file: { type: string; size: number }): boolean {
  return (L.imageTypes as readonly string[]).includes(file.type.toLowerCase()) && file.size > 0 && file.size <= L.maxImageBytes;
}

export function imageSizeOk(width: number, height: number): boolean {
  return width > 0 && height > 0 && width <= L.maxImageSide && height <= L.maxImageSide && width * height <= L.maxImagePixels;
}

// Keeps the files that pass both checks, at most `max`.
export async function filterImages(files: readonly File[], max: number = L.maxPhotoPicks): Promise<{ ok: File[]; skipped: number }> {
  const ok: File[] = [];
  let skipped = 0;
  for (const f of files) {
    if (ok.length >= max) { skipped++; continue; }
    if (!imageFileOk(f)) { skipped++; continue; }
    try {
      const bmp = await createImageBitmap(f);
      const fine = imageSizeOk(bmp.width, bmp.height);
      bmp.close();
      if (fine) ok.push(f); else skipped++;
    } catch { skipped++; }
  }
  return { ok, skipped };
}
