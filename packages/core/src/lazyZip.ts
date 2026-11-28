// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

// Reads a ZIP without loading it into memory: the central directory is read
// from the end of the file, and each wanted entry is sliced out of the Blob and
// inflated on its own (DecompressionStream, built into browsers and Node 18+).
// A 1 GB+ Instagram export then costs a few MB to read posts and insights,
// which matters on phones. Supports ZIP64, stored and deflated entries.
// Anything else (encrypted entries, other methods) reads as null.

import JSZip from 'jszip';
import { canReadLazily } from './zipSupport.js';

export interface ZipReader {
  names: string[];
  bytes(name: string): Promise<Uint8Array | null>;
  text(name: string): Promise<string | null>;
}

interface Entry { method: number; compSize: number; offset: number }

const EOCD = 0x06054b50, Z64_LOC = 0x07064b50, Z64_EOCD = 0x06064b50, CEN = 0x02014b50, LOC = 0x04034b50;

async function read(blob: Blob, start: number, end: number): Promise<DataView> {
  return new DataView(await blob.slice(start, end).arrayBuffer());
}
const u64 = (v: DataView, at: number) => Number(v.getBigUint64(at, true));

async function directory(blob: Blob): Promise<{ count: number; size: number; offset: number }> {
  const tailStart = Math.max(0, blob.size - 65_557);
  const tail = await read(blob, tailStart, blob.size);
  let at = -1;
  for (let i = tail.byteLength - 22; i >= 0; i--) if (tail.getUint32(i, true) === EOCD) { at = i; break; }
  if (at < 0) throw new Error('not a zip');
  let count = tail.getUint16(at + 10, true), size = tail.getUint32(at + 12, true), offset = tail.getUint32(at + 16, true);
  if (count === 0xffff || size === 0xffffffff || offset === 0xffffffff) {
    const loc = at - 20;
    if (loc < 0 || tail.getUint32(loc, true) !== Z64_LOC) throw new Error('zip64 locator missing');
    const z64At = u64(tail, loc + 8);
    const z = await read(blob, z64At, z64At + 56);
    if (z.getUint32(0, true) !== Z64_EOCD) throw new Error('zip64 record missing');
    count = u64(z, 32); size = u64(z, 40); offset = u64(z, 48);
  }
  return { count, size, offset };
}

export async function openLazyZip(blob: Blob): Promise<ZipReader> {
  const dir = await directory(blob);
  const cd = await read(blob, dir.offset, dir.offset + dir.size);
  const entries = new Map<string, Entry>();
  const utf8 = new TextDecoder('utf-8');
  let p = 0;
  for (let k = 0; k < dir.count && p + 46 <= cd.byteLength; k++) {
    if (cd.getUint32(p, true) !== CEN) throw new Error('bad directory');
    const method = cd.getUint16(p + 10, true);
    let compSize = cd.getUint32(p + 20, true);
    const uncomp = cd.getUint32(p + 24, true);
    const nameLen = cd.getUint16(p + 28, true), extraLen = cd.getUint16(p + 30, true), commentLen = cd.getUint16(p + 32, true);
    let offset = cd.getUint32(p + 42, true);
    const name = utf8.decode(new Uint8Array(cd.buffer, cd.byteOffset + p + 46, nameLen));
    // ZIP64 extra field: the 0xFFFFFFFF values, in order (uncompressed, compressed, offset).
    let e = p + 46 + nameLen;
    const extraEnd = e + extraLen;
    while (e + 4 <= extraEnd) {
      const id = cd.getUint16(e, true), len = cd.getUint16(e + 2, true);
      if (id === 0x0001) {
        let q = e + 4;
        if (uncomp === 0xffffffff) q += 8;
        if (compSize === 0xffffffff) { compSize = u64(cd, q); q += 8; }
        if (offset === 0xffffffff) offset = u64(cd, q);
      }
      e += 4 + len;
    }
    // Folder entries are listed too (names ending in '/'), as JSZip lists them.
    entries.set(name, { method, compSize, offset });
    p = extraEnd + commentLen;
  }

  async function bytes(name: string): Promise<Uint8Array | null> {
    const en = entries.get(name);
    if (!en) return null;
    const head = await read(blob, en.offset, en.offset + 30);
    if (head.getUint32(0, true) !== LOC) return null;
    const start = en.offset + 30 + head.getUint16(26, true) + head.getUint16(28, true);
    const raw = blob.slice(start, start + en.compSize);
    if (en.method === 0) return new Uint8Array(await raw.arrayBuffer());
    if (en.method !== 8) return null;
    const out = raw.stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(out).arrayBuffer());
  }

  return {
    names: [...entries.keys()],
    bytes,
    async text(name) { const b = await bytes(name); return b ? utf8.decode(b) : null; },
  };
}

// The lazy reader, or JSZip (whole file in memory) when the ZIP is one the
// lazy reader can't parse. Same interface either way.
// Browsers without DecompressionStream (iOS Safari before 16.4, older
// Android WebViews) or Blob.stream can't inflate lazily: they get JSZip.
export { canReadLazily };

export async function openZipReader(blob: Blob, lazy: boolean = canReadLazily()): Promise<ZipReader> {
  if (lazy) { try { return await openLazyZip(blob); } catch { /* fall back */ } }
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  const names = Object.keys(zip.files);
  const bytes = async (n: string) => (zip.files[n] ? zip.files[n]!.async('uint8array') : null);
  return { names, bytes, async text(n) { return zip.files[n] ? zip.files[n]!.async('string') : null; } };
}
