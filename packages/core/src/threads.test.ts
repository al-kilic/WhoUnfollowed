import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';
import { detectDeltaExport } from './delta.js';
import { MissingFilesError, SchemaValidationError } from './errors.js';
import { parseExportZip, parseInstagramZip } from './parser.js';
import { snapshotPlatform } from './schemas.js';

// Synthetic fixtures modeled on a real Threads export's `threads/` folder
// (usernames here are made up).

const IG_DIR = 'connections/followers_and_following';

function threadsEntry(username: string, timestamp = 1700000000) {
  return {
    title: `${username} display name`,
    string_list_data: [{ href: `https://www.threads.com/${username}`, value: username, timestamp }],
  };
}

function igEntry(username: string, timestamp = 1700000000) {
  return {
    title: username,
    media_list_data: [],
    string_list_data: [{ href: `https://www.instagram.com/${username}`, value: username, timestamp }],
  };
}

function addThreads(z: JSZip, followers: string[], following: string[], unfollowed: string[] = []) {
  z.file('threads/followers.json', JSON.stringify({ text_post_app_text_post_app_followers: followers.map(u => threadsEntry(u)) }));
  z.file('threads/following.json', JSON.stringify({ text_post_app_text_post_app_following: following.map(u => threadsEntry(u)) }));
  if (unfollowed.length > 0) {
    z.file(
      'threads/recently_unfollowed_profiles.json',
      JSON.stringify({ text_post_app_text_post_app_unfollowed_users: unfollowed.map(u => threadsEntry(u)) }),
    );
  }
}

function addInstagram(z: JSZip, followers: string[], following: string[]) {
  z.file(`${IG_DIR}/followers_1.json`, JSON.stringify(followers.map(u => igEntry(u))));
  z.file(`${IG_DIR}/following.json`, JSON.stringify({ relationships_following: following.map(u => igEntry(u)) }));
}

async function toBuffer(z: JSZip): Promise<ArrayBuffer> {
  return z.generateAsync({ type: 'arraybuffer' });
}

describe('parseExportZip: Threads export', () => {
  it('parses a Threads-only export', async () => {
    const z = new JSZip();
    addThreads(z, ['ann', 'ben'], ['ann', 'cat', 'dan'], ['eve']);
    z.file('threads/liked_threads.json', '{}');

    const { snapshot, skippedPlatforms } = await parseExportZip(await toBuffer(z));

    expect(snapshot.platform).toBe('threads');
    expect(snapshot.format).toBe('json');
    expect(skippedPlatforms).toEqual([]);
    expect(snapshot.followers.map(a => a.username)).toEqual(['ann', 'ben']);
    expect(snapshot.following.map(a => a.username)).toEqual(['ann', 'cat', 'dan']);
    expect(snapshot.following[0]).toEqual({ username: 'ann', href: 'https://www.threads.com/ann', followedAt: 1700000000 });
    expect(snapshot.recentlyUnfollowed?.map(a => a.username)).toEqual(['eve']);
    expect(snapshot.pendingRequests).toBeUndefined();
  });

  it('parseInstagramZip also returns the Threads snapshot', async () => {
    const z = new JSZip();
    addThreads(z, ['ann'], ['ben']);
    const snapshot = await parseInstagramZip(await toBuffer(z));
    expect(snapshot.platform).toBe('threads');
  });

  it('merges paginated Threads followers files', async () => {
    const z = new JSZip();
    z.file('threads/followers_1.json', JSON.stringify({ text_post_app_text_post_app_followers: [threadsEntry('a1')] }));
    z.file('threads/followers_2.json', JSON.stringify({ text_post_app_text_post_app_followers: [threadsEntry('a2')] }));
    z.file('threads/following.json', JSON.stringify({ text_post_app_text_post_app_following: [] }));

    const { snapshot } = await parseExportZip(await toBuffer(z));
    expect(snapshot.followers.map(a => a.username)).toEqual(['a1', 'a2']);
  });

  it('replaces a non-Threads href with a threads.com profile link', async () => {
    const z = new JSZip();
    z.file(
      'threads/followers.json',
      JSON.stringify({
        text_post_app_text_post_app_followers: [
          { string_list_data: [{ href: 'javascript:alert(1)', value: 'mallory', timestamp: 1 }] },
          { string_list_data: [{ href: 'https://www.threads.net/@old', value: 'old', timestamp: 1 }] },
        ],
      }),
    );
    z.file('threads/following.json', JSON.stringify({ text_post_app_text_post_app_following: [] }));

    const { snapshot } = await parseExportZip(await toBuffer(z));
    expect(snapshot.followers[0]!.href).toBe('https://www.threads.com/mallory');
    expect(snapshot.followers[1]!.href).toBe('https://www.threads.net/@old');
  });

  it('throws a Threads MissingFilesError when following.json is missing', async () => {
    const z = new JSZip();
    z.file('threads/followers.json', JSON.stringify({ text_post_app_text_post_app_followers: [] }));

    const err = await parseExportZip(await toBuffer(z)).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(MissingFilesError);
    expect((err as MissingFilesError).platform).toBe('threads');
    expect((err as MissingFilesError).message).toContain('threads/following.json');
  });

  it('throws a Threads MissingFilesError for a Threads export without follower data', async () => {
    const z = new JSZip();
    z.file('threads/liked_threads.json', '{}');
    z.file('threads/threads_and_replies.json', '{}');

    const err = await parseExportZip(await toBuffer(z)).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(MissingFilesError);
    expect((err as MissingFilesError).platform).toBe('threads');
  });

  it('attaches a non-identifying ZIP shape to MissingFilesError', async () => {
    const z = new JSZip();
    z.file('media/posts/1.jpg', 'x');
    z.file('your_instagram_activity/likes/liked_posts.json', '{}');

    const err = await parseExportZip(await toBuffer(z)).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(MissingFilesError);
    expect((err as MissingFilesError).shape).toEqual({
      fileCount: 2, hasConnectionsFolder: false, hasMediaFolder: true, hasThreadsFolder: false, hasHtmlFiles: false,
    });
  });

  it('throws SchemaValidationError for a malformed Threads file', async () => {
    const z = new JSZip();
    z.file('threads/followers.json', JSON.stringify([threadsEntry('ann')]));
    z.file('threads/following.json', JSON.stringify({ text_post_app_text_post_app_following: [] }));
    await expect(parseExportZip(await toBuffer(z))).rejects.toThrow(SchemaValidationError);
  });
});

describe('parseExportZip: Instagram + Threads in one ZIP', () => {
  // Threads' following.json sorts before Instagram's in the first ZIP, after
  // it in the second: the result must not depend on archive order.
  for (const threadsFirst of [true, false]) {
    it(`parses Instagram and reports Threads as skipped (threads first: ${threadsFirst})`, async () => {
      const z = new JSZip();
      if (threadsFirst) {
        addThreads(z, ['t_follower'], ['t_following'], ['t_gone']);
        addInstagram(z, ['ig_follower'], ['ig_following']);
      } else {
        addInstagram(z, ['ig_follower'], ['ig_following']);
        addThreads(z, ['t_follower'], ['t_following'], ['t_gone']);
      }

      const { snapshot, skippedPlatforms } = await parseExportZip(await toBuffer(z));

      expect(snapshot.platform).toBe('instagram');
      expect(skippedPlatforms).toEqual(['threads']);
      expect(snapshot.followers.map(a => a.username)).toEqual(['ig_follower']);
      expect(snapshot.following.map(a => a.username)).toEqual(['ig_following']);
      // Threads' recently_unfollowed file has a different schema; it must not
      // be picked up in place of Instagram's (absent here).
      expect(snapshot.recentlyUnfollowed).toBeUndefined();
    });
  }

  it('an Instagram-only export has platform instagram and nothing skipped', async () => {
    const z = new JSZip();
    addInstagram(z, ['a'], ['b']);
    const { snapshot, skippedPlatforms } = await parseExportZip(await toBuffer(z));
    expect(snapshot.platform).toBe('instagram');
    expect(skippedPlatforms).toEqual([]);
  });
});

describe('snapshotPlatform', () => {
  it('treats snapshots saved before the platform field existed as Instagram', () => {
    expect(snapshotPlatform({})).toBe('instagram');
    expect(snapshotPlatform({ platform: 'threads' })).toBe('threads');
  });
});

describe('detectDeltaExport on Threads snapshots', () => {
  const old = 1600000000;
  const account = (username: string) => ({ username, href: `https://www.threads.com/${username}`, followedAt: old });

  it('does not flag a small Threads account as a partial export', () => {
    const snap = { exportedAt: old, followers: [account('a')], following: [account('b')], platform: 'threads' as const };
    expect(detectDeltaExport(snap).reasons).not.toContain('small_counts');
  });

  it('still flags a small Instagram account', () => {
    const snap = { exportedAt: old, followers: [account('a')], following: [account('b')] };
    expect(detectDeltaExport(snap).reasons).toContain('small_counts');
  });
});
