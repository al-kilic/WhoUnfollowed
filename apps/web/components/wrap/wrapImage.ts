// Draws the 3-month wrap as a 1080x1920 story image, in the browser.
// Counts only: nothing on it names an account.

export interface WrapImageInput {
  kicker: string;
  title: string;
  range: string;
  big: string;
  bigLabel: string;
  stats: { label: string; value: string }[];
  verdict: string;
  weeks: number[];
  footer: string;
}

const W = 1080;
const H = 1920;
const SERIF = "'Instrument Serif', Georgia, serif";
const SANS = "'DM Sans', system-ui, sans-serif";

export async function drawWrapImage(input: WrapImageInput): Promise<Blob> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try { await document.fonts.ready; } catch { /* system fonts */ }
  }
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not available');

  const bg = ctx.createRadialGradient(780, 420, 40, 780, 420, 1300);
  bg.addColorStop(0, '#12484b');
  bg.addColorStop(1, '#061719');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  // Orbit rings behind the headline.
  ctx.lineWidth = 3;
  [[820, 360, 300, 'rgba(63,184,189,0.35)'], [880, 420, 190, 'rgba(224,122,85,0.6)']].forEach(([x, y, r, c]) => {
    ctx.strokeStyle = c as string; ctx.beginPath(); ctx.arc(x as number, y as number, r as number, 0, Math.PI * 2); ctx.stroke();
  });

  const x = 96;
  ctx.fillStyle = '#7fc4c7';
  ctx.font = `500 32px ${SANS}`;
  ctx.fillText(input.kicker.toUpperCase(), x, 720);
  ctx.fillStyle = 'rgba(244,240,232,0.7)';
  ctx.font = `400 38px ${SANS}`;
  ctx.fillText(input.range, x, 780);

  ctx.fillStyle = '#F4F0E8';
  ctx.font = `400 300px ${SERIF}`;
  ctx.fillText(input.big, x - 10, 1070);
  ctx.font = `400 64px ${SERIF}`;
  ctx.fillText(input.bigLabel, x, 1160);

  // Weekly arrivals as a strip of bars.
  const max = Math.max(1, ...input.weeks);
  const bw = (W - x * 2) / Math.max(1, input.weeks.length);
  input.weeks.forEach((n, i) => {
    const h = Math.max(6, (n / max) * 160);
    ctx.fillStyle = n === max ? '#e07a55' : 'rgba(63,184,189,0.55)';
    ctx.fillRect(x + i * bw + 4, 1380 - h, bw - 8, h);
  });

  const colW = (W - x * 2) / input.stats.length;
  input.stats.forEach((s, i) => {
    ctx.fillStyle = '#F4F0E8';
    ctx.font = `400 84px ${SERIF}`;
    ctx.fillText(s.value, x + i * colW, 1520);
    ctx.fillStyle = 'rgba(244,240,232,0.6)';
    ctx.font = `500 28px ${SANS}`;
    ctx.fillText(s.label, x + i * colW, 1566);
  });

  ctx.fillStyle = '#e07a55';
  ctx.font = `italic 400 54px ${SERIF}`;
  ctx.fillText(input.verdict, x, 1680);

  ctx.fillStyle = 'rgba(244,240,232,0.55)';
  ctx.font = `400 30px ${SANS}`;
  ctx.fillText(input.footer, x, H - 100);

  return new Promise((resolve, reject) => {
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Could not render image'))), 'image/png');
  });
}
