import type { LooseFile } from '@ig-tracker/core';

// An export someone already unzipped (phones and Safari on Mac do it on their
// own): the files they picked, or a folder they dropped. Only the follower and
// following lists are read, in the browser, like the ZIP.

// followers_1.json, following.json, their .html versions, TikTok's
// Follower.txt / Following.txt lists (same names as packages/core tiktok.ts). Never photos or other data.
const RELATIONSHIP = /(?:^|\/)(followers(?:_\d+)?|following)\.(?:json|html?)$|(?:^|\/)(?:follower|followers|fans|following)(?:[ _]list)?\.txt$/i;

export function isRelationshipFile(path: string): boolean {
  return RELATIONSHIP.test(path);
}

export function looseFromFiles(files: readonly File[]): LooseFile[] {
  return files.map((f) => ({ path: (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name, text: () => f.text() }));
}

type Entry = FileSystemEntry & { isFile: boolean; isDirectory: boolean; fullPath: string };

// Walks a dropped folder (at most 4000 entries, 8 levels) and keeps the
// relationship files with their paths inside the export.
export async function filesFromDrop(dt: DataTransfer): Promise<LooseFile[]> {
  const out: LooseFile[] = [];
  let seen = 0;
  const walk = async (entry: Entry | null, depth: number): Promise<void> => {
    if (!entry || depth > 8 || seen > 4000) return;
    seen++;
    if (entry.isFile) {
      if (!isRelationshipFile(entry.fullPath)) return;
      const file = await new Promise<File | null>((res) => (entry as unknown as FileSystemFileEntry).file(res, () => res(null)));
      if (file) out.push({ path: entry.fullPath, text: () => file.text() });
      return;
    }
    if (!entry.isDirectory) return;
    const reader = (entry as unknown as FileSystemDirectoryEntry).createReader();
    // readEntries returns at most 100 at a time; call until it comes back empty.
    for (;;) {
      const batch = await new Promise<FileSystemEntry[]>((res) => reader.readEntries(res, () => res([])));
      if (!batch.length) break;
      for (const child of batch) await walk(child as Entry, depth + 1);
    }
  };
  const items = [...(dt.items ?? [])];
  if (items.length) {
    for (const it of items) await walk((it.webkitGetAsEntry?.() ?? null) as Entry | null, 0);
  } else {
    for (const f of [...dt.files]) if (isRelationshipFile(f.name)) out.push({ path: f.name, text: () => f.text() });
  }
  return out;
}
