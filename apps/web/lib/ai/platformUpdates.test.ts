import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { platformUpdatesFileSchema } from '@ig-tracker/core';

vi.mock('server-only', () => ({}));

// The ledger file the weekly brief keeps: a broken edit should fail here, not
// silently leave the coach without updates.
describe('content/briefs/platform-updates.json', () => {
  const file = path.join(process.cwd(), 'content', 'briefs', 'platform-updates.json');
  const data = JSON.parse(readFileSync(file, 'utf8')) as unknown;

  it('matches the schema, with unique ids and no em dashes', () => {
    const parsed = platformUpdatesFileSchema.safeParse(data);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const ids = parsed.data.items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(JSON.stringify(parsed.data)).not.toContain('—');
    for (const i of parsed.data.items) expect(i.lastVerified >= i.firstSeen).toBe(true);
  });

  it('reaches the coach as status lines for the member\'s platform', async () => {
    const { platformUpdateLines } = await import('./platformUpdates');
    const lines = await platformUpdateLines('instagram', new Date('2026-11-24T12:00:00Z'));
    expect(lines.length).toBeGreaterThan(0);
    expect(lines.join('\n')).toContain('[a test on some accounts only');
    expect(lines.join('\n')).not.toContain('TikTok:');
    expect(await platformUpdateLines('instagram', new Date('2027-06-01T12:00:00Z'))).toEqual([]);
  });
});
