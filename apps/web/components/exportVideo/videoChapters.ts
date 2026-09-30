// The export video guide and where each of the six "Download to device" steps
// starts in it (seconds). Versioned filename: the file is served with a
// one-year immutable cache (see next.config.mjs), so a re-edit of the video
// needs a new name, plus new chapter times here.
export const EXPORT_VIDEO = {
  src: '/video/export-guide-v1.mp4',
  poster: '/video/export-guide-v1-poster.jpg',
  // A frame from step 1. Used where the video is click-to-play: the centered
  // play button would sit on top of the title card's headline.
  posterStep1: '/video/export-guide-v1-poster-step1.jpg',
  durationSeconds: 68.2,
  isoDuration: 'PT1M8S',
  uploadDate: '2026-09-30',
} as const;

// Chapter i covers [CHAPTER_STARTS[i], CHAPTER_STARTS[i + 1]). The 3.5s title
// card before the first boundary counts as step 1, the outro as step 6.
export const CHAPTER_STARTS = [3.5, 8, 11.75, 27, 44.25, 59.75] as const;

// Land just past the boundary so the first frame is not mid-crossfade.
const SEEK_OFFSET = 0.3;

export function chapterAt(time: number): number {
  let index = 0;
  for (let i = 0; i < CHAPTER_STARTS.length; i++) {
    if (time >= CHAPTER_STARTS[i]!) index = i;
  }
  return index;
}

export function chapterSeekTime(index: number): number {
  return (CHAPTER_STARTS[index] ?? 0) + SEEK_OFFSET;
}

// [start, end] of a chapter for the progress bar. The first segment starts at 0
// so the title card fills it too.
export function chapterRange(index: number): [number, number] {
  const start = index === 0 ? 0 : CHAPTER_STARTS[index]!;
  const end = CHAPTER_STARTS[index + 1] ?? EXPORT_VIDEO.durationSeconds;
  return [start, end];
}
