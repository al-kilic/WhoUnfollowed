import { describe, expect, it } from 'vitest';
import { aiPrefsSchema } from './aiSchemas.js';

describe('aiPrefsSchema', () => {
  it('fills defaults', () => {
    expect(aiPrefsSchema.parse({})).toEqual({ tone: 'voice', length: 'medium', days: [], bestTime: null, briefEmail: true, postingReminder: false, reminderWhen: 'day_of' });
  });
  it('sorts and dedupes posting days', () => {
    expect(aiPrefsSchema.parse({ days: [4, 0, 4, 2] }).days).toEqual([0, 2, 4]);
  });
  it('rejects bad values', () => {
    expect(aiPrefsSchema.safeParse({ days: [7] }).success).toBe(false);
    expect(aiPrefsSchema.safeParse({ bestTime: '25:00' }).success).toBe(false);
    expect(aiPrefsSchema.safeParse({ tone: 'loud' }).success).toBe(false);
    expect(aiPrefsSchema.safeParse({ bestTime: '18:30' }).success).toBe(true);
  });
});
