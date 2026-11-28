'use client';

import { useEffect, useRef, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { Link } from '@/i18n/navigation';
import { trackFunnel } from '@/lib/analytics';
import { useExportUpload } from '@/hooks/useExportUpload';
import type { HomeContent } from '@/app/[locale]/homeContent';
import type { HomeCopy } from './copy';
import { Ic } from './icons';
import { UploadDialogs } from './UploadDialogs';

// The drop box. The real upload: the ZIP is read in this tab (useExportUpload),
// then Results open. The final section's button asks for it with 'hm:choose'.
export function HeroUpload({ c, errors, isPro }: { c: HomeCopy['hero']; errors: HomeContent['hero']; isPro: boolean }) {
  const u = useExportUpload({ isPro, errors: errors.errors });
  const { phase } = u;
  const busy = phase === 'parsing' || phase === 'error';

  const choose = useRef(u.choose);
  choose.current = u.choose;
  useEffect(() => {
    const open = () => choose.current();
    window.addEventListener('hm:choose', open);
    return () => window.removeEventListener('hm:choose', open);
  }, []);

  const stop = (e: MouseEvent) => e.stopPropagation();
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); u.choose(); } };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--sx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--sy', `${e.clientY - r.top}px`);
  };
  const lines = c.parseLines.map((l, i) => {
    const on = u.progress >= i * 25, ok = u.progress >= (i + 1) * 25;
    return <div key={l} className={`pline${on ? ' on' : ''}${ok ? ' ok' : ''}`}><span>{l}</span></div>;
  });

  return (
    <>
      <div
        id="drop"
        className={`drop${busy ? ' busy' : ''}${phase === 'dragging' ? ' drag' : ''}${phase === 'error' ? ' err' : ''}`}
        tabIndex={0} role="button" aria-label={c.dropAria}
        onClick={u.choose} onKeyDown={onKey} onPointerMove={onMove}
        onDrop={u.drop.onDrop} onDragOver={u.drop.onDragOver} onDragEnter={u.drop.onDragOver} onDragLeave={u.drop.onDragLeave}
      >
        <div className="drop-in"><span className="spot" />
          <div className="drop-dash">
            <div className="up-ic idle"><Ic n="up" s={22} /></div>
            <div className="dt idle"><b>{phase === 'dragging' ? c.dropDrag : c.dropT}</b><span>{c.dropB}</span></div>
            <div className="dact idle">
              <span className="dchip">{c.noUnzip}</span><span className="dchip amber">{c.allTime}</span>
              <button className="btn pri sm" id="choose" type="button" onClick={(e) => { stop(e); u.choose(); }}>{c.choose}</button>
            </div>
            {phase === 'error' ? (
              <div className="parse" role="alert" onClick={stop}>
                <div className="ptitle">{errors.errorTitle}</div>
                <div className="pnote-d">{u.errInfo?.message}</div>
                <div className="perr">
                  <button className="btn pri sm" type="button" onClick={u.reset}>{errors.tryAgain}</button>
                  {u.errInfo?.showGuideCta && (
                    <Link href="/how-to-export" className="perr-l" onClick={() => trackFunnel('Export Guide Opened', { entry: 'upload_error' })}>
                      {u.errInfo.kind === 'missing_data' ? errors.guideCtaMissingData : errors.guideCtaDefault}
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="parse" aria-live="polite">
                <div className="ptitle">{errors.parsingTitle}</div>
                <div className="pbar"><i style={{ width: `${u.progress}%` }} /></div>
                {lines}
                <div className="pnote-d">{c.parseNote}</div>
              </div>
            )}
          </div>
        </div>
        <input ref={u.inputRef} type="file" accept=".zip,application/zip,application/x-zip-compressed,.json,application/json,.html,.txt" multiple hidden onChange={u.onFileChange} onClick={stop} />
      </div>
      <div className="dlinks">
        <a href="#flow" onClick={() => trackFunnel('Export Guide Opened', { entry: 'hero' })}>{c.noExport}</a>
        <Link href="/app/results?sample=1&from=home">{c.sample}</Link>
      </div>
      <UploadDialogs d={u.dialogs} c={errors} />
    </>
  );
}
