'use client';

import { useRef, useState } from 'react';
import { FileArchive, Lock, RefreshCw } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useStudio } from '../../StudioContext';
import { LearnVoice } from './LearnVoice';
import { LearnPhotoStyle } from './LearnPhotoStyle';
import { getTeachContent } from './teach.content';
import { IgOnlyBadge } from '../../IgOnlyBadge';

// Instagram exports run to a few GB; anything bigger is not an export.
const MAX_ZIP = 8 * 1024 * 1024 * 1024;

// Memory > "Teach your coach": choose the full Instagram export once (it stays
// in this browser), then learn the voice and the photo style from it. Each
// card also has a manual way in. Nothing is sent before its review step.
export function TeachCoach({ voiceLearned, photoLearned, onSaved }: { voiceLearned: boolean; photoLearned: boolean; onSaved?: () => void }) {
  const { locale } = useStudio();
  const k = getTeachContent(locale);
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [over, setOver] = useState(false);

  const take = (f: File | undefined) => {
    if (!f || f.size > MAX_ZIP || !/\.zip$/i.test(f.name)) return;
    setFile(f);
  };

  return (
    <section className="s-teach" aria-labelledby="teach-title">
      <div className="s-teach-top">
        <div>
          <h2 id="teach-title" className="s-teach-h">{k.title}</h2>
          <p className="s-sub-t" style={{ margin: '2px 0 0' }}>{k.sub}</p>
        </div>
        <IgOnlyBadge feature="memory" />
      </div>
      <div
        className={`s-teach-drop${over ? ' over' : ''}${file ? ' has' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files?.[0]); }}
      >
        <span className="s-teach-ic big"><FileArchive size={18} /></span>
        <span className="s-grow s-col" style={{ gap: 2, minWidth: 0 }}>
          <b>{file ? k.exportUsing(file.name) : k.exportTitle}</b>
          <span className="s-sub-t s-row" style={{ gap: 6, fontSize: 12.5 }}><Lock size={12} />{k.exportBody}</span>
        </span>
        <span className="s-row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className={`s-btn ${file ? 'sec ' : ''}xs`} onClick={() => input.current?.click()}>{file ? <><RefreshCw size={13} />{k.exportChange}</> : k.exportPick}</button>
          {!file && <Link href="/how-to-export" className="s-lnk" style={{ fontSize: 13 }}>{k.exportHow}</Link>}
        </span>
        <input ref={input} type="file" accept=".zip,application/zip" hidden aria-label={k.exportPick} onChange={(e) => { take(e.target.files?.[0]); e.target.value = ''; }} />
      </div>
      <div className="s-teach-cards">
        <LearnVoice file={file} learned={voiceLearned} />
        <LearnPhotoStyle file={file} learned={photoLearned} {...(onSaved ? { onSaved } : {})} />
      </div>
    </section>
  );
}
