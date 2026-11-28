// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { contentFromZip, type ExportContentItem } from './exportContent.js';
import { insightsFileOf, insightsFromFiles, type ExportInsights, type InsightsFile } from './exportInsights.js';
import { openZipReader, type ZipReader } from './lazyZip.js';

// One pass over a full export ZIP in the browser: what the member posted and
// Instagram's own numbers. Only the JSON lists are read, so a 1 GB+ export
// never sits in memory (lazyZip.ts).
export interface FullExport { content: ExportContentItem[]; insights: ExportInsights }

export async function insightsFromZip(zip: ZipReader): Promise<ExportInsights> {
  const files: Partial<Record<InsightsFile, unknown>> = {};
  for (const name of zip.names) {
    const kind = insightsFileOf(name);
    if (!kind || files[kind] !== undefined) continue;
    try { files[kind] = JSON.parse((await zip.text(name)) ?? 'null'); } catch { /* skip a broken file */ }
  }
  return insightsFromFiles(files);
}

export async function readFullExport(file: Blob): Promise<FullExport> {
  const zip = await openZipReader(file);
  const [content, insights] = await Promise.all([contentFromZip(zip), insightsFromZip(zip)]);
  return { content, insights };
}
