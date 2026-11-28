import { describe, expect, it } from 'vitest';
import { isValidElement } from 'react';
import { parseBlocks, renderInline } from './miniMarkdown';

describe('parseBlocks', () => {
  it('reads headings, paragraphs and lists', () => {
    const blocks = parseBlocks('# Title\nNov 10 to 16\n\n## This week\n- one\n- two\n\n1. a\n2. b\nlast line');
    expect(blocks).toEqual([
      { kind: 'h1', text: 'Title' },
      { kind: 'p', text: 'Nov 10 to 16' },
      { kind: 'h2', text: 'This week' },
      { kind: 'ul', items: ['one', 'two'] },
      { kind: 'ol', items: ['a', 'b'] },
      { kind: 'p', text: 'last line' },
    ]);
  });
});

describe('renderInline', () => {
  it('turns bold and http links into elements and keeps the rest as text', () => {
    const out = renderInline('Read **this** at [the source](https://example.com) now');
    expect(out[0]).toBe('Read ');
    expect(isValidElement(out[1])).toBe(true);
    expect(isValidElement(out[3])).toBe(true);
    expect(out[4]).toBe(' now');
  });

  it('never makes a link out of a non-http url and never passes HTML through', () => {
    const out = renderInline('[x](javascript:alert(1)) <b>hi</b>');
    expect(out.some((n) => isValidElement(n))).toBe(false);
    expect(out.join('')).toContain('<b>hi</b>');
  });
});
