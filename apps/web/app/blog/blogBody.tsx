// Renders a post body (server only). Styles live in styles/blog.css (.bl-prose).
import React from 'react';
import { BlogArt, type ArtVariant } from './BlogArt';

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Inline formatting: [text](url) links and **bold**. This is the sole HTML-
// injection point for every post body (rendered via dangerouslySetInnerHTML
// below). Post content is static developer-authored TypeScript today, not
// user input, but a `url` of `javascript:...` would still execute if one
// ever slipped into posts.ts, so only http(s) and site-relative links render
// as real hrefs, and `label` is HTML-escaped before interpolation.
function inline(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
      const safeUrl = /^https?:\/\//i.test(url) || url.startsWith('/') || url === '#' ? url : '#';
      const ext = safeUrl.startsWith('http');
      return `<a href="${safeUrl}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(label)}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, (_, b) => `<strong>${escapeHtml(b)}</strong>`);
}

// `post.body` is NOT full markdown, it's a small hand-rolled subset. Only the
// syntax explicitly handled below actually renders correctly; anything else
// (blockquotes, code fences, nested/indented lists, single-asterisk italics,
// setext headers, etc.) silently falls through to a plain <p> and prints as
// literal text. Supported block-level syntax (each must be its own
// \n\n-separated paragraph):
//   [[art:variant]]         inline abstract cover art (see ArtVariant)
//   ![alt](src)              image, src usually /blog/<file>.jpg
//   ### text                 h3
//   ## text                  h2
//   - item                   bullet list (every line in the block must start with "- ")
//   1. item                  numbered list (every line must start with "N. ")
//   | a | b |\n|---|---|\n...  pipe table (header row + separator + body rows)
// Supported inline syntax (works inside paragraphs, list items, table cells):
//   **bold**, [text](url)
// If you're generating a new post body, only use the syntax above.
export function renderBody(body: string) {
  return body.split('\n\n').map((raw, i) => {
    const para = raw.trim();

    const artMatch = para.match(/^\[\[art:(\w+)\]\]$/);
    if (artMatch) {
      return (
        <figure key={i} className="bl-fig art">
          <BlogArt variant={artMatch[1] as ArtVariant} alt="" rounded={0} />
        </figure>
      );
    }

    const imgMatch = para.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      return (
        <figure key={i} className="bl-fig">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgMatch[2]} alt={imgMatch[1]} loading="lazy" />
        </figure>
      );
    }

    if (para.startsWith('### ')) return <h3 key={i}>{para.replace('### ', '')}</h3>;
    if (para.startsWith('## ')) return <h2 key={i}>{para.replace('## ', '')}</h2>;

    // Pipe table: header row, |---|---| separator, body rows.
    if (para.startsWith('|')) {
      const rows = para.split('\n').map((r) => r.trim()).filter(Boolean);
      const toCells = (r: string) => r.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      const isSeparator = (r: string) => /^[|\-:\s]+$/.test(r) && r.includes('-');
      const headerRow = rows[0];
      const separatorRow = rows[1];
      if (headerRow && separatorRow && rows.length >= 2 && isSeparator(separatorRow)) {
        const header = toCells(headerRow);
        const bodyRows = rows.slice(2).map(toCells);
        return (
          <div key={i} className="bl-table">
            <table>
              <thead><tr>{header.map((h, hi) => <th key={hi}>{h}</th>)}</tr></thead>
              <tbody>
                {bodyRows.map((row, ri) => (
                  <tr key={ri}>{row.map((c, ci) => <td key={ci} dangerouslySetInnerHTML={{ __html: inline(c) }} />)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }

    if (/^\d+\.\s/.test(para)) {
      const items = para.split('\n').filter((l) => /^\d+\.\s/.test(l.trim()));
      return (
        <ol key={i} className="bl-list">
          {items.map((item, j) => (
            <li key={j}>
              <span className="num">{item.trim().match(/^\d+/)?.[0]}.</span>
              <span dangerouslySetInnerHTML={{ __html: inline(item.replace(/^\s*\d+\.\s/, '')) }} />
            </li>
          ))}
        </ol>
      );
    }

    if (para.startsWith('- ')) {
      const items = para.split('\n').filter((l) => l.trim().startsWith('- '));
      return (
        <ul key={i} className="bl-list">
          {items.map((item, j) => (
            <li key={j}>
              <span className="mk" aria-hidden="true" />
              <span dangerouslySetInnerHTML={{ __html: inline(item.replace(/^-\s/, '')) }} />
            </li>
          ))}
        </ul>
      );
    }
    return <p key={i} dangerouslySetInnerHTML={{ __html: inline(para) }} />;
  });
}
