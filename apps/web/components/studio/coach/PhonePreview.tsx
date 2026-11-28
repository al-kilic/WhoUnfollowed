'use client';

import { useState, type ReactNode } from 'react';
import { ImagePlus } from 'lucide-react';

// How a draft would look on Instagram, on an iPhone frame. Purely a preview:
// the photo (if any) is a local object URL and never leaves the browser, and
// no likes or comment counts are shown, so nothing here pretends to be real data.

export type PreviewFormat = 'reel' | 'carousel' | 'photo' | 'story';

const P = {
  heart: 'M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938z',
  comment: 'M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z',
  save: 'M20 21l-8-7.56L4 21V3h16z',
  back: 'M15 4l-8 8 8 8',
  search: 'M19 10.5A8.5 8.5 0 1110.5 2a8.5 8.5 0 018.5 8.5zM16.511 16.511L22 22',
};

function G({ d, size = 24, children }: { d?: string; size?: number; children?: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d ? <path d={d} /> : children}
    </svg>
  );
}
const Send = ({ size = 24 }: { size?: number }) => <G size={size}><line x1="22" x2="9.218" y1="3" y2="10.083" /><polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" /></G>;
const Reels = () => <G><rect x="2" y="2" width="20" height="20" rx="5.5" /><line x1="2.5" x2="21.5" y1="7.7" y2="7.7" /><line x1="7.2" x2="10.3" y1="2.2" y2="7.7" /><line x1="13.7" x2="16.8" y1="2.2" y2="7.7" /></G>;
const More = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="6" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="18" cy="12" r="1.5" /></svg>;
const Home = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 23h-6a1 1 0 01-1-1v-5.455a3 3 0 10-6 0V22a1 1 0 01-1 1H2a1 1 0 01-1-1V11.543a1 1 0 01.31-.724l10-9.543a1 1 0 011.38 0l10 9.543a1 1 0 01.31.724V22a1 1 0 01-1 1z" /></svg>;

function StatusBar() {
  return (
    <>
      <div className="ip-isl" />
      <div className="ip-sb"><span>9:41</span>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden="true"><rect x=".5" y=".5" width="23" height="12" rx="3.8" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor" /></svg>
      </div>
    </>
  );
}

// onAdd: the empty photo opens the file picker, so photos can be added right on the phone.
type AddPhotos = ((files: FileList | null) => void) | undefined;
function Photo({ src, label, className, onAdd, multiple }: { src: string | null; label: string; className: string; onAdd: AddPhotos; multiple: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
  if (src) return <img className={className} src={src} alt="" />;
  if (!onAdd) return <div className={`${className} ig-nophoto`}><ImagePlus size={28} /><span>{label}</span></div>;
  return (
    <label className={`${className} ig-nophoto add`}>
      <ImagePlus size={28} /><span>{label}</span>
      <input type="file" accept="image/*" multiple={multiple} hidden onChange={(e) => { onAdd(e.target.files); e.target.value = ''; }} />
    </label>
  );
}

export interface PhoneLabels { posts: string; reels: string; follow: string; sendMessage: string; noPhoto: string; tapToAdd?: string }

// The carousel slides: swipe or tap the arrows, like Instagram. Shows the
// "Add a photo" screen when there are none yet.
function Slides({ photos, label, onAdd }: { photos: string[]; label: string; onAdd: AddPhotos }) {
  const [i, setI] = useState(0);
  const [x0, setX0] = useState<number | null>(null);
  const n = Math.max(1, photos.length);
  const at = Math.min(i, n - 1);
  const go = (d: number) => setI((v) => Math.max(0, Math.min(n - 1, v + d)));
  return (
    <div className="ig-imgw" onPointerDown={(e) => setX0(e.clientX)} onPointerUp={(e) => { if (x0 !== null && Math.abs(e.clientX - x0) > 30) go(e.clientX < x0 ? 1 : -1); setX0(null); }}>
      <Photo src={photos[at] ?? null} label={label} className="ig-img" onAdd={onAdd} multiple />
      {photos.length > 1 && <span className="ig-cnt">{at + 1}/{photos.length}</span>}
      {at > 0 && <button type="button" className="ig-arrow l" aria-label="Previous photo" onClick={() => go(-1)}>‹</button>}
      {at < n - 1 && <button type="button" className="ig-arrow r" aria-label="Next photo" onClick={() => go(1)}>›</button>}
      {photos.length > 1 && <div className="ig-dots">{photos.slice(0, 20).map((p, k) => <i key={p} className={k === at ? 'on' : undefined} />)}</div>}
    </div>
  );
}

// blurText: the caption is blurred placeholder (locked Create).
export function PhonePreview({ format, text, photos, account, labels, blurText = false, onAdd }: {
  format: PreviewFormat; text: string; photos: string[]; account: string; labels: PhoneLabels; blurText?: boolean; onAdd?: AddPhotos;
}) {
  const blur = blurText ? { filter: 'blur(4px)', userSelect: 'none' as const } : undefined;
  const photo = photos[0] ?? null;
  const noPhotoLabel = (onAdd && labels.tapToAdd) || labels.noPhoto;
  // With the picker inside, the frame is a figure, not a flat image.
  const role = onAdd ? 'figure' : 'img';
  const first = text.split('\n')[0] ?? '';
  const avatar = <span className="ig-av" aria-hidden="true">{account.slice(0, 1).toUpperCase()}</span>;
  const tab = <div className="ig-tab"><Home /><Reels /><Send /><G d={P.search} />{avatar}</div>;

  if (format === 'reel' || format === 'story') {
    return (
      <div className="ip" role={role} aria-label={text}>
        <div className="ig dark">
          <StatusBar />
          <Photo src={photo} label={noPhotoLabel} className={format === 'story' ? 'ig-full st-full' : 'ig-full'} onAdd={onAdd} multiple={false} />
          <div className="ig-shade" />
          {format === 'reel' ? (
            <>
              <div className="rl-top"><G d={P.back} size={26} /><span>{labels.reels}</span><span style={{ width: 26 }} /></div>
              <div className="rl-side"><G d={P.heart} size={28} /><G d={P.comment} size={28} /><Send size={26} /><More /></div>
              <div className="rl-bot"><div className="u">{avatar}{account}<span className="fl">{labels.follow}</span></div><div className="c" style={blur} aria-hidden={blurText || undefined}>{first}</div></div>
              {tab}
            </>
          ) : (
            <>
              <div className="st-bars"><i /><i /><i /></div>
              <div className="st-top">{avatar}{account}<span>2h</span></div>
              {first && <div className="st-text" style={blur} aria-hidden={blurText || undefined}>{first}</div>}
              <div className="st-bot"><div>{labels.sendMessage}</div><G d={P.heart} size={26} /><Send size={26} /></div>
            </>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="ip" role={role} aria-label={text}>
      <div className="ig">
        <StatusBar />
        <div className="ig-nav"><G d={P.back} /><div><small>{account}</small><b>{labels.posts}</b></div></div>
        <div className="ig-ph"><span className="ig-ring">{avatar}</span><b>{account}</b><More /></div>
        {format === 'carousel' ? <Slides photos={photos} label={noPhotoLabel} onAdd={onAdd} /> : <div className="ig-imgw"><Photo src={photo} label={noPhotoLabel} className="ig-img" onAdd={onAdd} multiple={false} /></div>}
        <div className="ig-acts"><G d={P.heart} /><G d={P.comment} /><Send /><span className="bm"><G d={P.save} /></span></div>
        <div className="ig-cap"><b>{account}</b> <span style={blur} aria-hidden={blurText || undefined}>{text}</span></div>
        {tab}
      </div>
    </div>
  );
}
