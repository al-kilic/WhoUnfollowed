import { describe, expect, it } from 'vitest';
import { followersFileSchema, followingFileSchema, parsedSnapshotSchema, contactMessageSchema } from './schemas.js';

const validEntry = {
  title: 'test_user',
  media_list_data: [],
  string_list_data: [
    {
      href: 'https://www.instagram.com/test_user',
      value: 'test_user',
      timestamp: 1700000000,
    },
  ],
};

describe('followersFileSchema', () => {
  it('parses a valid followers array', () => {
    const result = followersFileSchema.safeParse([validEntry]);
    expect(result.success).toBe(true);
  });

  it('parses an empty array', () => {
    const result = followersFileSchema.safeParse([]);
    expect(result.success).toBe(true);
  });

  it('fails when string_list_data is missing', () => {
    const invalid = { title: 'x', media_list_data: [] };
    const result = followersFileSchema.safeParse([invalid]);
    expect(result.success).toBe(false);
  });

  it('accepts a zero-length string_list_data (removed/deactivated account placeholder)', () => {
    const placeholder = { title: 'Instagram User', media_list_data: [], string_list_data: [] };
    const result = followersFileSchema.safeParse([placeholder]);
    expect(result.success).toBe(true);
  });

  it('fails when string_list_data has more than one item', () => {
    const tooMany = { ...validEntry, string_list_data: [validEntry.string_list_data[0], validEntry.string_list_data[0]] };
    const result = followersFileSchema.safeParse([tooMany]);
    expect(result.success).toBe(false);
  });

  it('accepts a null timestamp', () => {
    const nullTimestamp = {
      ...validEntry,
      string_list_data: [{ ...validEntry.string_list_data[0], timestamp: null }],
    };
    const result = followersFileSchema.safeParse([nullTimestamp]);
    expect(result.success).toBe(true);
  });

  it('fails when entry is not an array', () => {
    const result = followersFileSchema.safeParse({ not: 'an array' });
    expect(result.success).toBe(false);
  });
});

describe('followingFileSchema', () => {
  it('parses a valid following object', () => {
    const result = followingFileSchema.safeParse({
      relationships_following: [validEntry],
    });
    expect(result.success).toBe(true);
  });

  it('parses empty relationships_following', () => {
    const result = followingFileSchema.safeParse({ relationships_following: [] });
    expect(result.success).toBe(true);
  });

  it('fails when relationships_following is missing', () => {
    const result = followingFileSchema.safeParse({ other_key: [] });
    expect(result.success).toBe(false);
  });
});

describe('parsedSnapshotSchema', () => {
  it('parses a valid snapshot', () => {
    const snapshot = {
      exportedAt: 1700000000,
      followers: [{ username: 'a', href: 'https://instagram.com/a', followedAt: 1699000000 }],
      following: [{ username: 'b', href: 'https://instagram.com/b', followedAt: null }],
    };
    const result = parsedSnapshotSchema.safeParse(snapshot);
    expect(result.success).toBe(true);
  });

  it('allows followedAt: null', () => {
    const account = { username: 'x', href: 'https://instagram.com/x', followedAt: null };
    const snapshot = { exportedAt: 1700000000, followers: [account], following: [] };
    const result = parsedSnapshotSchema.safeParse(snapshot);
    expect(result.success).toBe(true);
  });

  it('fails when exportedAt is missing', () => {
    const result = parsedSnapshotSchema.safeParse({ followers: [], following: [] });
    expect(result.success).toBe(false);
  });
});

describe('contactMessageSchema', () => {
  const valid = { email: 'user@example.com', message: 'Hello', source: 'contact_page' as const };

  it('parses a minimal valid message', () => {
    expect(contactMessageSchema.safeParse(valid).success).toBe(true);
  });

  it('parses a full message with name, topic, and page', () => {
    const full = { ...valid, name: 'Alex', topic: 'bug', page: '/contact' };
    expect(contactMessageSchema.safeParse(full).success).toBe(true);
  });

  it('lowercases and trims the email', () => {
    const result = contactMessageSchema.safeParse({ ...valid, email: '  User@Example.COM  ' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe('user@example.com');
  });

  it('fails on an invalid email', () => {
    expect(contactMessageSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });

  it('allows email to be omitted (the homepage widget does not require one)', () => {
    const withoutEmail = { message: 'Hello', source: 'contact_page' as const };
    expect(contactMessageSchema.safeParse(withoutEmail).success).toBe(true);
  });

  it('fails on an empty message', () => {
    expect(contactMessageSchema.safeParse({ ...valid, message: '' }).success).toBe(false);
  });

  it('fails on a message over 2000 chars', () => {
    expect(contactMessageSchema.safeParse({ ...valid, message: 'a'.repeat(2001) }).success).toBe(false);
  });

  it('fails on an unknown source', () => {
    expect(contactMessageSchema.safeParse({ ...valid, source: 'carrier_pigeon' }).success).toBe(false);
  });

  it('accepts the homepage_widget source', () => {
    expect(contactMessageSchema.safeParse({ ...valid, source: 'homepage_widget' }).success).toBe(true);
  });
});
