import type { ZipShape } from '@ig-tracker/core';

// Upload diagnostics for analytics. Everything here maps real-world values to
// a small closed set of labels, so no file name, content, or raw error message
// can ever reach Umami (see the allowlist rule in lib/analytics.ts).

export type SizeBucket = 'lt10mb' | '10-100mb' | '100-500mb' | '500mb-2gb' | 'gt2gb';
export type FileExt = 'json' | 'html' | 'folder' | 'rar' | '7z' | 'tar' | 'none' | 'other';
export type ErrorName = 'TypeError' | 'RangeError' | 'SyntaxError' | 'NotReadableError' | 'SecurityError' | 'QuotaExceededError' | 'other';
export type CountBucket = '0' | '1-10' | '11-100' | '101-1000' | 'gt1000';
export type YesNo = 'yes' | 'no';

const MB = 1024 * 1024;

export function sizeBucket(bytes: number): SizeBucket {
  if (bytes < 10 * MB) return 'lt10mb';
  if (bytes < 100 * MB) return '10-100mb';
  if (bytes < 500 * MB) return '100-500mb';
  if (bytes < 2048 * MB) return '500mb-2gb';
  return 'gt2gb';
}

export function fileExt(name: string): FileExt {
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  if (!m) return 'none';
  const ext = m[1];
  if (ext === 'json' || ext === 'rar' || ext === '7z' || ext === 'tar') return ext;
  if (ext === 'html' || ext === 'htm') return 'html';
  return 'other';
}

export function errorName(err: unknown): ErrorName {
  const name = err instanceof Error || (typeof DOMException !== 'undefined' && err instanceof DOMException) ? (err as Error).name : '';
  switch (name) {
    case 'TypeError': case 'RangeError': case 'SyntaxError':
    case 'NotReadableError': case 'SecurityError': case 'QuotaExceededError':
      return name;
    default:
      return 'other';
  }
}

function countBucket(n: number): CountBucket {
  if (n === 0) return '0';
  if (n <= 10) return '1-10';
  if (n <= 100) return '11-100';
  if (n <= 1000) return '101-1000';
  return 'gt1000';
}

const yn = (b: boolean): YesNo => (b ? 'yes' : 'no');

export function shapeProps(shape: ZipShape) {
  return {
    zip_files: countBucket(shape.fileCount),
    has_connections: yn(shape.hasConnectionsFolder),
    has_media: yn(shape.hasMediaFolder),
    has_threads: yn(shape.hasThreadsFolder),
    has_html: yn(shape.hasHtmlFiles),
  };
}

// Size above which the browser may run out of memory reading the whole ZIP.
// Phones are far more constrained than desktops.
export function isLikelyMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
}

export function largeFileThreshold(mobile: boolean): number {
  return mobile ? 300 * MB : 1500 * MB;
}
