// Draws the verdict card as a 1080x1920 story image, entirely in the browser.
// Brand colours: deep teal ground, cream ink, terra accent.

export interface VerdictImageInput {
  typeLabel: string;
  name: string;
  line: string;
  stats: { label: string; value: string }[];
  footer: string;
}

const W = 1080;
const H = 1920;
const SERIF = "'Instrument Serif', Georgia, serif";
const SANS = "'DM Sans', system-ui, sans-serif";

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let cur = '';
  for (const word of text.split(/\s+/)) {
    const next = cur ? `${cur} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && cur) { lines.push(cur); cur = word; } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

export async function drawVerdictImage(input: VerdictImageInput): Promise<Blob> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try { await document.fonts.ready; } catch { /* fall back to system fonts */ }
  }
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not available');

  ctx.fillStyle = '#0B2426';
  ctx.fillRect(0, 0, W, H);
  // Abstract geometry: two offset rings, no people.
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(2,136,143,0.55)';
  ctx.beginPath(); ctx.arc(860, 330, 260, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(168,75,47,0.7)';
  ctx.beginPath(); ctx.arc(930, 400, 170, 0, Math.PI * 2); ctx.stroke();

  const x = 96;
  const maxW = W - x * 2;
  ctx.fillStyle = '#7fc4c7';
  ctx.font = `500 34px ${SANS}`;
  ctx.fillText(input.typeLabel.toUpperCase(), x, 760);

  ctx.fillStyle = '#F4F0E8';
  ctx.font = `400 132px ${SERIF}`;
  let y = 900;
  for (const l of wrap(ctx, input.name, maxW)) { ctx.fillText(l, x, y); y += 132; }

  ctx.fillStyle = 'rgba(244,240,232,0.85)';
  ctx.font = `400 50px ${SANS}`;
  y += 30;
  for (const l of wrap(ctx, input.line, maxW)) { ctx.fillText(l, x, y); y += 70; }

  // Stat row.
  y = Math.max(y + 90, 1460);
  ctx.fillStyle = '#A84B2F';
  ctx.fillRect(x, y - 70, 120, 6);
  const colW = maxW / input.stats.length;
  input.stats.forEach((s, i) => {
    const cx = x + i * colW;
    ctx.fillStyle = '#F4F0E8';
    ctx.font = `400 88px ${SERIF}`;
    ctx.fillText(s.value, cx, y + 40);
    ctx.fillStyle = 'rgba(244,240,232,0.6)';
    ctx.font = `500 30px ${SANS}`;
    ctx.fillText(s.label, cx, y + 90);
  });

  ctx.fillStyle = 'rgba(244,240,232,0.55)';
  ctx.font = `400 30px ${SANS}`;
  ctx.fillText(input.footer, x, H - 110);

  return new Promise((resolve, reject) => {
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Could not render image'))), 'image/png');
  });
}
