import { POST_PHOTOS } from './data';
import { shuffle, type FxCtx } from './ctx';

// The coach post's three slides: bundled photos, a different set each visit.
// Returns the calendar's "Yours" chip, which shows the first slide's photo.
export function coachPhotos(x: FxCtx): HTMLElement | null {
  const bundled = shuffle([...POST_PHOTOS]);
  const slides = x.$$('#slides .slide'), mine = x.$('.cal .p.mine');
  slides.forEach((s, k) => {
    const im = document.createElement('img'); im.alt = ''; im.decoding = 'async';
    im.src = bundled[k % bundled.length]!;
    s.querySelectorAll('img').forEach((o) => o.remove());
    s.appendChild(im); s.classList.add('ph');
  });
  if (mine) {
    mine.style.backgroundImage = `linear-gradient(rgba(0,0,0,.25),rgba(0,0,0,.25)),url(${bundled[0]!})`;
    mine.style.backgroundSize = 'cover'; mine.style.backgroundPosition = 'center';
  }
  return mine;
}
