import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { E2E_ADMIN_URL, E2E_DATABASE_URL, E2E_DB_NAME } from './env';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const FIXTURES = path.join(HERE, '.tmp');
export const IG_ZIP = path.join(HERE, '..', '..', '..', 'packages', 'core', 'test', 'fixtures', 'valid-export.zip');
export const COMBINED_ZIP = path.join(FIXTURES, 'combined-ig-threads.zip');
// 20 mutuals, 130 who don't follow back and 5 pending requests: enough rows
// for the Results list to load more inside its card.
export const BIG_ZIP = path.join(FIXTURES, 'big-instagram.zip');

// A fresh database for every run: dropped, recreated and migrated with the
// app's own migrations. Refuses to touch anything not named igtracker_e2e.
async function resetDatabase(): Promise<void> {
  if (!E2E_DATABASE_URL.endsWith(`/${E2E_DB_NAME}`)) throw new Error('e2e: refusing to reset a database that is not igtracker_e2e');
  if (!process.env.CI) {
    const admin = postgres(E2E_ADMIN_URL, { max: 1, onnotice: () => {} });
    try {
      await admin.unsafe(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${E2E_DB_NAME}' AND pid <> pg_backend_pid()`);
      await admin.unsafe(`DROP DATABASE IF EXISTS ${E2E_DB_NAME}`);
      await admin.unsafe(`CREATE DATABASE ${E2E_DB_NAME} OWNER igtracker`);
      // UTC like production (and the CI service). The timestamp columns have
      // no time zone, so now() in a local zone reads back hours off.
      await admin.unsafe(`ALTER DATABASE ${E2E_DB_NAME} SET timezone TO 'UTC'`);
    } finally {
      await admin.end();
    }
  }
  const client = postgres(E2E_DATABASE_URL, { max: 1, onnotice: () => {} });
  try {
    await migrate(drizzle(client), { migrationsFolder: path.join(HERE, '..', 'lib', 'db', 'migrations') });
  } finally {
    await client.end();
  }
}

// The Instagram fixture plus a Threads part, like one ZIP with both platforms.
async function buildCombinedZip(): Promise<void> {
  const requireFromCore = createRequire(path.join(HERE, '..', '..', '..', 'packages', 'core', 'package.json'));
  // jszip ships with the parser package (packages/core), not with the web app.
  type Zip = { file(name: string, data: string): void; generateAsync(o: { type: 'nodebuffer' }): Promise<Buffer> };
  const JSZip = requireFromCore('jszip') as { loadAsync(data: Buffer): Promise<Zip> };
  const zip = await JSZip.loadAsync(readFileSync(IG_ZIP));
  const entry = (u: string) => ({ title: '', media_list_data: [], string_list_data: [{ href: `https://www.threads.net/@${u}`, value: u, timestamp: 1731000000 }] });
  zip.file('your_instagram_activity/threads/followers.json', JSON.stringify({ text_post_app_text_post_app_followers: ['th_fan', 'th_mutual'].map(entry) }));
  zip.file('your_instagram_activity/threads/following.json', JSON.stringify({ text_post_app_text_post_app_following: ['th_mutual', 'th_nofollowback'].map(entry) }));
  writeFileSync(COMBINED_ZIP, await zip.generateAsync({ type: 'nodebuffer' }));
}

async function buildBigZip(): Promise<void> {
  const requireFromCore = createRequire(path.join(HERE, '..', '..', '..', 'packages', 'core', 'package.json'));
  type Zip = { file(name: string, data: string): void; generateAsync(o: { type: 'nodebuffer' }): Promise<Buffer> };
  const JSZip = requireFromCore('jszip') as new () => Zip;
  const zip = new JSZip();
  const day = 86_400;
  const at = (i: number) => 1700000000 + i * day;
  const entry = (u: string, i: number) => ({ title: u, media_list_data: [], string_list_data: [{ href: `https://www.instagram.com/${u}`, value: u, timestamp: at(i) }] });
  const mutuals = Array.from({ length: 20 }, (_, i) => `mutual_${String(i).padStart(2, '0')}`);
  const oneWay = Array.from({ length: 130 }, (_, i) => `noback_${String(i).padStart(3, '0')}`);
  const dir = 'connections/followers_and_following';
  zip.file(`${dir}/followers_1.json`, JSON.stringify(mutuals.map(entry)));
  zip.file(`${dir}/following.json`, JSON.stringify({ relationships_following: [...mutuals, ...oneWay].map(entry) }));
  zip.file(`${dir}/pending_follow_requests.json`, JSON.stringify(Array.from({ length: 5 }, (_, i) => ({ label_values: [{ label: 'Username', value: `pending_${i}` }, { label: 'URL', value: `https://www.instagram.com/pending_${i}` }] }))));
  writeFileSync(BIG_ZIP, await zip.generateAsync({ type: 'nodebuffer' }));
}

export default async function globalSetup(): Promise<void> {
  mkdirSync(FIXTURES, { recursive: true });
  await Promise.all([resetDatabase(), buildCombinedZip(), buildBigZip()]);
}
