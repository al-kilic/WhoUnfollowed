// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { mkdtemp, mkdir, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';

vi.mock('server-only', () => ({}));
import { getBrief, listBriefDates } from './briefs';

let root = '';

beforeAll(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'briefs-'));
  await writeFile(path.join(root, 'niches.json'), JSON.stringify({ niches: [{ id: 'fitness', name: 'Fitness and wellness', names: { es: 'Fitness y bienestar' } }] }));
  const week = path.join(root, '2026-11-16');
  await mkdir(week);
  await writeFile(path.join(week, 'index.json'), JSON.stringify({ date: '2026-11-16', editions: ['general', 'fitness', 'missing'], languages: ['en', 'es'] }));
  await writeFile(path.join(week, 'general.en.md'), '# General EN');
  await writeFile(path.join(week, 'general.es.md'), '# General ES');
  await writeFile(path.join(week, 'fitness.en.md'), '# Fitness EN');
  await mkdir(path.join(root, '2026-11-09')); // no index.json: ignored
  await mkdir(path.join(root, 'drafts')); // not a date: ignored
});
afterAll(async () => { await rm(root, { recursive: true, force: true }); });

describe('listBriefDates', () => {
  it('lists only dated folders that have an index, newest first', async () => {
    expect(await listBriefDates(root)).toEqual(['2026-11-16']);
  });
  it('returns nothing when the folder does not exist', async () => {
    expect(await listBriefDates(path.join(root, 'nope'))).toEqual([]);
  });
});

describe('getBrief', () => {
  it('never puts niche text in a free reader\'s brief', async () => {
    const b = await getBrief('2026-11-16', 'en', false, root);
    expect(b?.editions.map((e) => [e.id, e.markdown])).toEqual([
      ['general', '# General EN'],
      ['fitness', null],
      ['missing', null],
    ]);
  });

  it('gives Pro AI readers the niche text, in their language or English, and hides missing editions', async () => {
    const b = await getBrief('2026-11-16', 'es', true, root);
    expect(b?.editions.map((e) => [e.id, e.name, e.markdown])).toEqual([
      ['general', 'general', '# General ES'],
      ['fitness', 'Fitness y bienestar', '# Fitness EN'],
    ]);
  });

  it('names niche editions in the reader\'s language, English when missing', async () => {
    expect((await getBrief('2026-11-16', 'es', false, root))?.editions.find((e) => e.id === 'fitness')?.name).toBe('Fitness y bienestar');
    expect((await getBrief('2026-11-16', 'pt', false, root))?.editions.find((e) => e.id === 'fitness')?.name).toBe('Fitness and wellness');
  });

  it('rejects anything that is not a date, so paths cannot escape the folder', async () => {
    expect(await getBrief('../2026-11-16', 'en', true, root)).toBeNull();
    expect(await getBrief('2026-11-09', 'en', true, root)).toBeNull();
  });
});
