import { describe, expect, it } from 'vitest';
import { AI_CHAT_LIMITS, aiChatRequestSchema, aiChatSchema } from './aiSchemas.js';

describe('aiChatRequestSchema', () => {
  it('accepts a conversation that ends with a question', () => {
    const r = aiChatRequestSchema.parse({ messages: [{ role: 'user', text: 'Hi' }, { role: 'coach', text: 'Hello' }, { role: 'user', text: ' Why? ' }] });
    expect(r.deep).toBe(false);
    expect(r.messages[2]!.text).toBe('Why?');
  });
  it('rejects a conversation that ends with the coach, or a question over 1000 characters', () => {
    expect(aiChatRequestSchema.safeParse({ messages: [{ role: 'coach', text: 'Hello' }] }).success).toBe(false);
    expect(aiChatRequestSchema.safeParse({ messages: [{ role: 'user', text: 'x'.repeat(1001) }] }).success).toBe(false);
  });
  it('caps the history at 12 turns', () => {
    const turns = Array.from({ length: 13 }, (_, i) => ({ role: i % 2 ? 'coach' : 'user', text: 'a' }));
    expect(aiChatRequestSchema.safeParse({ messages: turns }).success).toBe(false);
  });
});

describe('aiChatSchema', () => {
  it('defaults follow-ups and memory notes', () => {
    expect(aiChatSchema.parse({ answer: 'Post on Tuesdays.' })).toEqual({ answer: 'Post on Tuesdays.', followUps: [], memoryNotes: [] });
  });
});

describe('aiSignalSchema', () => {
  it('accepts a thumb, a pick and an edit, and rejects unknown kinds and long text', async () => {
    const { aiSignalRequestSchema } = await import('./aiSchemas.js');
    const { textDiff } = await import('./coach/textDiff.js');
    const ok = aiSignalRequestSchema.safeParse({ signals: [
      { kind: 'thumb', action: 'read', up: false, chip: 'too_generic' },
      { kind: 'draft_pick', action: 'draft', option: 1, of: 3, text: 'Three photos I almost kept.' },
      { kind: 'draft_edit', action: 'draft', option: 1, diff: textDiff('a b #c', 'a b'), before: 'a b #c', after: 'a b' },
    ] });
    expect(ok.success).toBe(true);
    expect(aiSignalRequestSchema.safeParse({ signals: [{ kind: 'nope', action: 'read' }] }).success).toBe(false);
    expect(aiSignalRequestSchema.safeParse({ signals: [{ kind: 'hook_used', action: 'check', text: 'x'.repeat(301) }] }).success).toBe(false);
    expect(aiSignalRequestSchema.safeParse({ signals: [] }).success).toBe(false);
  });
});

describe('photo style (3B)', () => {
  it('takes 6 to 24 small JPEG photos, and a few findings back', async () => {
    const { aiPhotoStyleRequestSchema, aiPhotoStyleSchema } = await import('./aiSchemas.js');
    const photo = 'data:image/jpeg;base64,AAAA';
    expect(aiPhotoStyleRequestSchema.safeParse({ photos: Array(6).fill(photo) }).success).toBe(true);
    expect(aiPhotoStyleRequestSchema.safeParse({ photos: Array(5).fill(photo) }).success).toBe(false);
    expect(aiPhotoStyleRequestSchema.safeParse({ photos: Array(25).fill(photo) }).success).toBe(false);
    expect(aiPhotoStyleRequestSchema.safeParse({ photos: Array(6).fill('data:image/png;base64,AAAA') }).success).toBe(false);
    const out = aiPhotoStyleSchema.safeParse({ summary: 'Warm street scenes.', findings: [{ text: 'Side light.', tags: ['Light:Golden-Hour'] }, { text: 'Small figures.' }] });
    expect(out.success && out.data.findings[0]!.tags).toEqual(['light:golden-hour']);
    expect(aiPhotoStyleSchema.safeParse({ summary: 'x', findings: [{ text: 'only one' }] }).success).toBe(false);
  });
});

describe('aiChatRequestSchema attachments', () => {
  const q = { messages: [{ role: 'user' as const, text: 'What do you see?' }] };
  const jpeg = 'data:image/jpeg;base64,/9j/4AAQ';
  it('accepts up to 3 photos and short context', () => {
    expect(aiChatRequestSchema.safeParse({ ...q, attachments: { images: [jpeg, jpeg, jpeg], context: [{ kind: 'report', label: 'Instagram export', text: 'Followers: 10' }] } }).success).toBe(true);
  });
  it('rejects a 4th photo, other image types and oversize photos', () => {
    expect(aiChatRequestSchema.safeParse({ ...q, attachments: { images: [jpeg, jpeg, jpeg, jpeg] } }).success).toBe(false);
    expect(aiChatRequestSchema.safeParse({ ...q, attachments: { images: ['data:image/gif;base64,R0lG'] } }).success).toBe(false);
    expect(aiChatRequestSchema.safeParse({ ...q, attachments: { images: [`data:image/png;base64,${'A'.repeat(AI_CHAT_LIMITS.imageChars)}`] } }).success).toBe(false);
  });
  it('caps attached text at 4000 characters in total', () => {
    const big = { kind: 'plan' as const, label: 'Plan', text: 'x'.repeat(2500) };
    expect(aiChatRequestSchema.safeParse({ ...q, attachments: { context: [big, { ...big, label: 'Plan 2' }] } }).success).toBe(false);
  });
  it('still works without attachments', () => {
    expect(aiChatRequestSchema.safeParse(q).success).toBe(true);
  });
});
