import type { FxCtx } from './ctx';

// The export video plays muted from 0:03 while it's on screen, and loops
// back to 0:03. The chapter buttons jump to their step.
export function initVideo(x: FxCtx) {
  const vid = x.$<HTMLVideoElement>('#vid');
  if (!vid) return;
  const START = 3;
  let on = false;
  vid.muted = true;
  const play = () => { try { if (vid.currentTime < START) vid.currentTime = START; void vid.play().catch(() => {}); } catch { /* not ready yet */ } };
  x.on(vid, 'ended', () => { vid.currentTime = START; if (on) play(); });
  if (!x.reduce) x.watch(vid, (e) => {
    on = e.isIntersecting;
    if (on) { vid.preload = 'auto'; if (vid.readyState >= 1) play(); else x.on(vid, 'loadedmetadata', () => { if (on) play(); }, { once: true }); }
    else if (!vid.paused) vid.pause();
  }, { threshold: 0.5 });
  const chaps = x.$$('#chaps button');
  chaps.forEach((b) => x.on(b, 'click', () => {
    chaps.forEach((c) => c.classList.toggle('on', c === b));
    try { vid.currentTime = Number(b.dataset.t); void vid.play().catch(() => {}); } catch { /* not ready yet */ }
  }));
}

// Privacy: a password typed into someone else's app, then what follows, next
// to the ZIP read in this tab. Loops while it's on screen.
export function initPrivacy(x: FxCtx) {
  const pw = x.$('#pw'), themM = x.$('#themM'), lbtn = x.$('#lbtn'), pb = x.$('#pb'), box = x.$('#priv');
  if (!pw || !themM || !lbtn || !pb || !box) return;
  const cqs = [...x.$$('#conseq .cq'), ...x.$$('#uconseq .cq')];
  let timers: number[] = [], on = false;
  const stop = () => { timers.forEach(clearTimeout); timers = []; };
  const loop = () => {
    stop();
    pw.textContent = ''; themM.classList.remove('done'); lbtn.classList.remove('press'); cqs.forEach((c) => c.classList.remove('on'));
    pb.style.transition = 'none'; pb.style.width = '0';
    for (let i = 1; i <= 11; i++) timers.push(x.later(() => { pw.textContent = '•'.repeat(i); }, 300 + i * 95));
    timers.push(x.later(() => lbtn.classList.add('press'), 1550));
    timers.push(x.later(() => { lbtn.classList.remove('press'); themM.classList.add('done'); }, 1800));
    x.$$('#conseq .cq').forEach((c, j) => timers.push(x.later(() => c.classList.add('on'), 2100 + j * 650)));
    x.$$('#uconseq .cq').forEach((c, j) => timers.push(x.later(() => c.classList.add('on'), 2100 + j * 650)));
    timers.push(x.later(() => { pb.style.transition = 'width 2.4s cubic-bezier(.6,0,.2,1)'; pb.style.width = '100%'; }, 400));
    if (!x.reduce) timers.push(x.timeout(loop, 9000));
  };
  x.watch(box, (e) => {
    if (e.isIntersecting && !on) { on = true; loop(); } else if (!e.isIntersecting && on) { on = false; stop(); }
  }, { threshold: 0.3 });
}

// The final section: usernames drift; now and then one turns red and leaves.
// Its button scrolls up to the drop box and opens the file picker.
export function initFinal(x: FxCtx, handles: string[]) {
  const gh = x.$('#ghosts');
  const pos = [[6, 18], [80, 14], [12, 70], [84, 66], [30, 86], [64, 88], [3, 44], [90, 40]];
  if (gh) {
    gh.textContent = '';
    handles.slice(0, 8).forEach((h, i) => {
      const s = document.createElement('span'); s.className = 'gh'; s.textContent = `@${h}`;
      s.style.left = `${pos[i]![0]}%`; s.style.top = `${pos[i]![1]}%`; s.style.animationDelay = `${-i * 1.7}s`;
      gh.appendChild(s);
    });
    if (!x.reduce) x.every(() => {
      const all = x.$$('.gh', gh), g = all[Math.floor(Math.random() * all.length)];
      g?.animate?.([{ opacity: 0.7 }, { opacity: 0.7, offset: 0.3, borderColor: 'var(--bad)', color: 'var(--bad)' }, { opacity: 0, transform: 'translateY(-24px)' }, { opacity: 0, offset: 0.8 }, { opacity: 0.7 }], { duration: 4200, easing: 'ease-in-out' });
    }, 3000);
  }
  x.on(x.$('#finDrop'), 'click', () => {
    x.$('#upload')?.scrollIntoView({ behavior: x.reduce ? 'auto' : 'smooth' });
    x.timeout(() => window.dispatchEvent(new Event('hm:choose')), 600);
  });
  // Primary buttons lean a little toward the cursor.
  if (!x.reduce && x.fine) x.$$('.btn.pri').forEach((b) => {
    x.on(b, 'pointermove', (e) => {
      const p = e as PointerEvent, r = b.getBoundingClientRect();
      b.style.transform = `translate(${((p.clientX - r.left - r.width / 2) * 0.16).toFixed(1)}px,${((p.clientY - r.top - r.height / 2) * 0.22).toFixed(1)}px)`;
    });
    x.on(b, 'pointerleave', () => { b.style.transform = ''; });
  });
}
