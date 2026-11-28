import { createElement, type CSSProperties, type ReactNode } from 'react';

// The small slice of markdown the weekly brief uses (headings, paragraphs,
// lists, **bold** and [links](https://...)), turned into React elements.
// Never injects HTML: anything else is shown as plain text.

export type Block =
  | { kind: 'h1' | 'h2' | 'h3' | 'p'; text: string }
  | { kind: 'ul' | 'ol'; items: string[] };

export function parseBlocks(md: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  const flush = () => { if (para.length) { blocks.push({ kind: 'p', text: para.join(' ') }); para = []; } };
  for (const raw of md.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim();
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    const ul = /^[-*]\s+(.*)$/.exec(line);
    const ol = /^\d+[.)]\s+(.*)$/.exec(line);
    if (!line) { flush(); continue; }
    if (h) { flush(); blocks.push({ kind: (['h1', 'h2', 'h3'] as const)[h[1]!.length - 1]!, text: h[2]! }); continue; }
    if (ul || ol) {
      flush();
      const kind = ul ? 'ul' : 'ol';
      const last = blocks[blocks.length - 1];
      const item = (ul ?? ol)![1]!;
      if (last && last.kind === kind) last.items.push(item); else blocks.push({ kind, items: [item] });
      continue;
    }
    para.push(line);
  }
  flush();
  return blocks;
}

// Inline: **bold** and [text](http(s) url). Other links are kept as text.
export function renderInline(text: string, linkStyle?: CSSProperties): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let at = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > at) out.push(text.slice(at, m.index));
    if (m[1] !== undefined) out.push(createElement('strong', { key: k++ }, m[1]));
    else if (/^https?:\/\//.test(m[3]!)) out.push(createElement('a', { key: k++, href: m[3], target: '_blank', rel: 'noopener noreferrer', style: linkStyle }, m[2]));
    else out.push(m[2]);
    at = m.index + m[0].length;
  }
  if (at < text.length) out.push(text.slice(at));
  return out;
}
