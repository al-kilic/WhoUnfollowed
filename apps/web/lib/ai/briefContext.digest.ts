// Pure helpers for briefContext.ts (no server-only), so tests can use them.

const NICHES: [RegExp, string][] = [
  [/photo|video|film|camera|wedding|portrait/i, 'photo-video'],
  [/fit|gym|yoga|wellness|health|run|coach/i, 'fitness'],
  [/beauty|fashion|makeup|style|skin|hair|nail/i, 'beauty-fashion'],
  [/shop|store|business|local|brand|cafe|café|restaurant|bakery|salon/i, 'small-business'],
];

export function nicheEdition(niche: string | null | undefined): string {
  if (!niche) return 'general';
  return NICHES.find(([re]) => re.test(niche))?.[1] ?? 'general';
}

export function briefDigest(markdown: string): { title: string; items: string[]; tryLine: string | null } {
  const title = /^#\s+(.+)$/m.exec(markdown)?.[1]?.trim() ?? '';
  const week = /##\s+This week\s*\n([\s\S]*?)(\n##\s|$)/i.exec(markdown)?.[1] ?? '';
  const items = [...week.matchAll(/^-\s+\*\*(.+?)\*\*/gm)].map((m) => m[1]!.trim()).slice(0, 5);
  const tryBlock = /##\s+One thing to try[^\n]*\n+([^\n]+)/i.exec(markdown)?.[1]?.trim() ?? null;
  return { title, items, tryLine: tryBlock ? tryBlock.slice(0, 280) : null };
}
