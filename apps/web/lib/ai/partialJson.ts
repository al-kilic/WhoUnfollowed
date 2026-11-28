// Streaming answers arrive as a JSON object written left to right. This reads
// one string field out of the text received so far, so the page can show the
// answer while the rest is still coming. Returns null until the field starts.
export function partialJsonString(text: string, key: string): string | null {
  const m = new RegExp(`"${key}"\\s*:\\s*"`).exec(text);
  if (!m) return null;
  let out = '';
  for (let i = m.index + m[0].length; i < text.length; i++) {
    const ch = text[i]!;
    if (ch === '"') return out;
    if (ch !== '\\') { out += ch; continue; }
    const next = text[i + 1];
    if (next === undefined) return out; // escape cut in half: wait for more
    const simple: Record<string, string> = { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', '"': '"', '\\': '\\', '/': '/' };
    if (next in simple) { out += simple[next]; i++; continue; }
    if (next === 'u') {
      const hex = text.slice(i + 2, i + 6);
      if (hex.length < 4) return out;
      out += String.fromCharCode(parseInt(hex, 16));
      i += 5;
      continue;
    }
    i++;
  }
  return out;
}
