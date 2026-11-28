import { describe, expect, it } from 'vitest';
import { partialJsonString } from './partialJson';

describe('partialJsonString', () => {
  it('is null until the field starts', () => {
    expect(partialJsonString('{"ans', 'answer')).toBeNull();
    expect(partialJsonString('{"followUps": [], "answer"', 'answer')).toBeNull();
  });
  it('reads a field that is still arriving', () => {
    expect(partialJsonString('{"answer": "Post on Tues', 'answer')).toBe('Post on Tues');
  });
  it('stops at the closing quote and decodes escapes', () => {
    expect(partialJsonString('{"answer":"Line one.\\nSay \\"hi\\" \\u00e9", "followUps": []}', 'answer')).toBe('Line one.\nSay "hi" é');
  });
  it('waits when an escape is cut in half', () => {
    expect(partialJsonString('{"answer": "a\\', 'answer')).toBe('a');
    expect(partialJsonString('{"answer": "a\\u00', 'answer')).toBe('a');
  });
  it('handles a code fence before the object', () => {
    expect(partialJsonString('```json\n{"answer": "ok', 'answer')).toBe('ok');
  });
});
