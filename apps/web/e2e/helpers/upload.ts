import { readFileSync } from 'node:fs';
import { expect, type APIRequestContext, type Page } from '@playwright/test';
import { exportStats, parseExportZip } from '@ig-tracker/core';
import type { TestUser } from './db';

// Uploads an export ZIP from the home page, the way a visitor does, and
// waits for Results. The tiny fixtures can trip the "incremental export"
// warning; the test then chooses to see the results anyway.
export async function uploadFromHome(page: Page, zipPath: string): Promise<void> {
  await page.goto('/');
  await page.locator('input[type="file"]').first().setInputFiles(zipPath);
  const notIncremental = page.getByRole('button', { name: 'This is not an incremental export' });
  // Either Results opens, or the warning shows first: then see them anyway.
  const first = await Promise.race([
    page.waitForURL(/\/app\/results/, { timeout: 30_000 }).then(() => 'results' as const, () => 'none' as const),
    notIncremental.waitFor({ state: 'visible', timeout: 30_000 }).then(() => 'warning' as const, () => 'none' as const),
  ]);
  if (first === 'warning') {
    await notIncremental.click();
    await page.getByRole('button', { name: /Show me anyway/i }).click();
    await page.waitForURL(/\/app\/results/, { timeout: 30_000 });
  }
}

// The numbers a Pro AI member's upload sends to the server (counts and dates
// only), posted straight to /api/ai/stats for every platform in the ZIP.
export async function seedExportStats(request: APIRequestContext, user: TestUser, zipPath: string): Promise<string[]> {
  const buf = readFileSync(zipPath);
  const parsed = await parseExportZip(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  const snaps = [parsed.snapshot, ...(parsed.extraSnapshots ?? [])];
  for (const snap of snaps) {
    const res = await request.post('/api/ai/stats', { data: { stats: exportStats(snap), locale: 'en' }, headers: { cookie: `auth_session=${user.sessionId}` } });
    expect(res.status(), `stats for ${snap.platform}`).toBeLessThan(300);
  }
  return snaps.map((s) => s.platform ?? 'instagram');
}
