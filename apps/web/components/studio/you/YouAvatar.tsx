'use client';

import { useState } from 'react';
import { Camera, Check, ImagePlus, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { ANIMALS, avatarSrc, shrinkAvatar, useAvatar } from '@/hooks/useAvatar';
import { useStudio } from '../StudioContext';
import { StudioDialog } from '../StudioDialog';
import { getYouContent } from './you.content';

// The avatar, as a round image. Used in the sidebar and in You > Settings.
export function Avatar({ size = 28 }: { size?: number }) {
  const { userEmail } = useAuth();
  const { value } = useAvatar(userEmail ?? 'guest');
  // eslint-disable-next-line @next/next/no-img-element -- local file or data URL from this browser
  return <img className={`s-avimg${value.kind === 'animal' ? ' an' : ''}`} src={avatarSrc(value)} alt="" width={size} height={size} />;
}

// Settings > Profile: the avatar with a camera button, and a picker with the
// animals and an upload. The photo never leaves this browser.
export function AvatarPicker() {
  const { locale } = useStudio();
  const t = getYouContent(locale);
  const { userEmail } = useAuth();
  const { value, save } = useAvatar(userEmail ?? 'guest');
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState(false);
  const upload = async (f: File | undefined) => {
    if (!f) return;
    setErr(false);
    try { save({ kind: 'photo', src: await shrinkAvatar(f) }); setOpen(false); } catch { setErr(true); }
  };
  return (
    <>
      <div className="s-avw">
        <Avatar size={72} />
        <button type="button" aria-label={t.avatar.change} onClick={() => setOpen(true)}><Camera size={14} /></button>
      </div>
      <StudioDialog open={open} onClose={() => setOpen(false)} title={t.avatar.title}>
        <div className="s-col" style={{ gap: 14 }}>
          <span className="s-sub-t" style={{ fontSize: 13 }}>{t.avatar.body}</span>
          <div className="s-avgrid">
            {ANIMALS.map((a) => {
              const on = value.kind === 'animal' && value.animal === a;
              return (
                <button key={a} type="button" className={on ? 'on' : undefined} aria-pressed={on} aria-label={a} onClick={() => { save({ kind: 'animal', animal: a }); setOpen(false); }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- static icon */}
                  <img src={`/avatars/${a}.svg`} alt="" width={36} height={36} />
                  {on && <span className="tick"><Check size={10} strokeWidth={3} /></span>}
                </button>
              );
            })}
          </div>
          <div className="s-row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <label className="s-btn sec" style={{ cursor: 'pointer' }}><ImagePlus size={14} />{t.avatar.upload}
              <input type="file" accept="image/*" hidden onChange={(e) => { void upload(e.target.files?.[0]); e.target.value = ''; }} /></label>
            {value.kind === 'photo' && <button type="button" className="s-btn sec" onClick={() => { save(null); setOpen(false); }}><Trash2 size={14} />{t.avatar.remove}</button>}
          </div>
          {err && <span role="alert" style={{ color: 'var(--bad)', fontSize: 13 }}>{t.avatar.error}</span>}
          <span className="s-sub-t" style={{ fontSize: 12 }}>{t.avatar.privacy}</span>
        </div>
      </StudioDialog>
    </>
  );
}
