// The Studio verdict poster as a 1080x1920 story image, drawn in the browser.
// A photo fills the frame (a bundled photo from public/home/post, so the canvas stays
// readable), under a fixed dark gradient; all text is white with a soft
// shadow, so it reads on any photo. Without a photo it falls back to teal.

export interface StudioVerdictImageInput {
  typeLabel: string;
  name: string;
  line: string;
  stats: { label: string; value: string }[];
  ribbon: { mutuals: number; oneWay: number; fans: number };
  footer: string;
  photo?: string | undefined;
}

const W = 1080;
const H = 1920;

function lines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const out: string[] = [];
  let cur = '';
  for (const word of text.split(/\s+/)) {
    const next = cur ? `${cur} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && cur) { out.push(cur); cur = word; } else cur = next;
  }
  if (cur) out.push(cur);
  return out;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

export async function drawStudioVerdictImage(input: StudioVerdictImageInput): Promise<Blob> {
  if ('fonts' in document) { try { await document.fonts.ready; } catch { /* system fonts */ } }
  const sans = getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif';
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not available');

  // Ground: the photo, cover-fit, or the teal fallback.
  const img = input.photo ? await loadImage(input.photo) : null;
  if (img) {
    const s = Math.max(W / img.width, H / img.height);
    ctx.drawImage(img, (W - img.width * s) / 2, (H - img.height * s) / 2, img.width * s, img.height * s);
  } else {
    const g = ctx.createRadialGradient(W * 0.85, H * 0.1, 40, W * 0.85, H * 0.1, 900);
    g.addColorStop(0, '#2a6f72'); g.addColorStop(1, '#0b1a1b');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  // The scrim: light at the top, near black where the text sits.
  const scrim = ctx.createLinearGradient(0, 0, 0, H);
  scrim.addColorStop(0, 'rgba(0,0,0,0.25)');
  scrim.addColorStop(0.38, 'rgba(0,0,0,0.35)');
  scrim.addColorStop(0.62, 'rgba(6,14,15,0.82)');
  scrim.addColorStop(1, 'rgba(6,14,15,0.95)');
  ctx.fillStyle = scrim; ctx.fillRect(0, 0, W, H);

  const x = 96, maxW = W - x * 2;
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 18;
  ctx.textBaseline = 'alphabetic';

  // Bottom-up layout so long names push the heading up, never into the stats.
  let y = H - 120;
  ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = `500 30px ${sans}`;
  ctx.fillText(input.footer, x, y);

  y -= 110;
  const colW = maxW / input.stats.length;
  input.stats.forEach((s, i) => {
    ctx.fillStyle = '#ffffff'; ctx.font = `600 76px ${sans}`;
    ctx.fillText(s.value, x + i * colW, y - 44);
    ctx.fillStyle = 'rgba(255,255,255,0.72)'; ctx.font = `500 30px ${sans}`;
    ctx.fillText(s.label, x + i * colW, y);
  });

  y -= 170;
  ctx.shadowBlur = 0;
  const parts = [[input.ribbon.mutuals, '#4cc3c8'], [input.ribbon.oneWay, '#f87171'], [input.ribbon.fans, '#dcbd80']] as const;
  const total = Math.max(1, parts.reduce((a, [v]) => a + v, 0));
  let rx = x;
  for (const [v, color] of parts) {
    if (!v) continue;
    const w = Math.max(18, (v / total) * maxW - 8);
    ctx.fillStyle = color; roundRect(ctx, rx, y, w, 26, 13);
    rx += w + 8;
  }
  ctx.shadowBlur = 18;

  y -= 60;
  ctx.font = `400 48px ${sans}`;
  const quote = lines(ctx, `“${input.line}”`, maxW);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (let i = quote.length - 1; i >= 0; i--) { ctx.fillText(quote[i]!, x, y); y -= 66; }

  y -= 40;
  ctx.font = `600 120px ${sans}`;
  const name = lines(ctx, input.name, maxW);
  ctx.fillStyle = '#ffffff';
  for (let i = name.length - 1; i >= 0; i--) { ctx.fillText(name[i]!, x, y); y -= 128; }

  y -= 10;
  ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = `600 32px ${sans}`;
  ctx.fillText(input.typeLabel.toUpperCase(), x, y);

  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not render image'))), 'image/png');
  });
}
