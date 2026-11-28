import { describe, expect, it } from 'vitest';
import { aiChatSchema, aiMemoryOpsSchema, aiReadSchema } from './aiSchemas';

const read = { headline: 'h', happening: ['a'], stop: { what: 'w', why: 'y' }, try: [{ what: 'w', why: 'y' }] };

describe('memory ops in answers', () => {
  it('is optional, so old answers and mocks still parse', () => {
    const r = aiReadSchema.parse({ ...read, memoryNotes: ['Posts on Tuesdays'] });
    expect(r.memory).toBeUndefined();
    expect(r.memoryNotes).toEqual(['Posts on Tuesdays']);
  });

  it('keeps valid ops', () => {
    const r = aiChatSchema.parse({ answer: 'ok', memory: { add: [{ type: 'like', text: 'Prefers short captions', tags: ['format:carousel'] }], confirm: ['a1b2c3'] } });
    expect(r.memory!.add[0]).toMatchObject({ type: 'like', confidence: 0.6, tags: ['format:carousel'] });
    expect(r.memory!.confirm).toEqual(['a1b2c3']);
  });

  it('drops invalid ops instead of failing the answer', () => {
    const r = aiChatSchema.parse({ answer: 'ok', memory: { add: [{ type: 'secret', text: 'x' }], confirm: ['not-an-id'] } });
    expect(r.answer).toBe('ok');
    expect(r.memory).toBeUndefined();
  });

  it('caps the number of ops', () => {
    const add = Array.from({ length: 4 }, (_, i) => ({ type: 'fact', text: `f${i}` }));
    expect(aiMemoryOpsSchema.safeParse({ add }).success).toBe(false);
  });
});
