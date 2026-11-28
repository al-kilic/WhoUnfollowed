'use client';

import { ArrowRight, Check, ImagePlus, Undo2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { planStart } from '@/lib/ai/planDays';
import { MAX_PHOTOS, planPhotoId, postPhotoKey, usePostPhotos } from '@/hooks/usePostPhotos';
import { useStudio } from '../StudioContext';
import { FORMAT_ICON, FormatBadge, type Format } from './formats';
import { Blur } from './ProPreview';
import { getStudioCoachContent } from './studioCoach.content';
import { getTodayContent } from './today.content';
import { Lockchip, type useTodayPlan } from './TodayWidgets';

// Today's planned post: the photo at feed size on top, the idea under it.
// Photos are the same ones the plan uses, kept in this browser.
export function PostWidget({ tp }: { tp: ReturnType<typeof useTodayPlan> }) {
  const { locale, hasProAi, openUpgrade, userId } = useStudio();
  const t = getTodayContent(locale);
  const k = getStudioCoachContent(locale);
  // Before the plan's first Monday, show its first post as what's coming.
  const early = tp.day < 0;
  const items = tp.plan?.calendar ?? [];
  const it = early ? items[0] : items.find((x) => x.day === tp.day);
  const photos = usePostPhotos(it && tp.plan ? postPhotoKey(userId ?? 'me', tp.plan.id, planPhotoId(items, it)) : null, MAX_PHOTOS);
  const startLabel = tp.plan && early ? new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short' }).format(planStart(new Date(tp.plan.createdAt))) : '';
  const hd = <div className="s-hd"><h3 className="s-h3">{t.post}</h3>{hasProAi ? (early && tp.plan ? <span className="s-sub-t">{t.startsOn(startLabel)}</span> : tp.day >= 0 && tp.day < 30 && <span className="s-sub-t">{t.dayOf(tp.day + 1)}</span>) : <Lockchip />}</div>;
  const wrap = (body: React.ReactNode) => <section className="s-card s-wg s-tpw">{hd}{body}</section>;

  if (!hasProAi) {
    const fmt: Format = 'reel';
    const Ic = FORMAT_ICON[fmt];
    return wrap(
      <>
        <div className="s-tpmedia"><div className={`s-noimg f-${fmt}`}><Ic size={24} /></div></div>
        <div className="s-col s-pad" style={{ gap: 8 }}>
          <FormatBadge format={fmt} />
          <h2 className="s-tpt"><Blur>{k.examplePlan[0]}</Blur></h2>
          <span className="s-sub-t" style={{ fontSize: 13 }}>{t.postLocked}</span>
          <button type="button" className="s-btn xs acc" style={{ alignSelf: 'flex-start' }} onClick={() => openUpgrade('plan')}>{t.unlock}</button>
        </div>
      </>,
    );
  }
  if (tp.plan === undefined) return wrap(<div className="s-pad"><span className="s-shim" style={{ width: '70%' }} /></div>);
  if (!tp.plan) return wrap(<div className="s-pad s-col" style={{ gap: 8 }}><span className="s-sub-t">{t.noPlan}</span><Link href="/app/plan" className="s-lnk">{t.makePlan}<ArrowRight size={13} /></Link></div>);
  if (!it) return wrap(<div className="s-pad s-col" style={{ gap: 8 }}><span className="s-sub-t">{t.nothingToday}</span><Link href="/app/plan" className="s-lnk">{t.openPlan}<ArrowRight size={13} /></Link></div>);

  const Ic = FORMAT_ICON[it.format];
  const multiple = it.format === 'carousel';
  const setPosted = (posted: boolean) => void tp.save(items.map((x) => (x.day === it.day ? { ...x, posted } : x)));
  return wrap(
    <>
      <div className="s-tpmedia">
        {photos.urls[0] ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- local object URL from this browser */}
            <img src={photos.urls[0]} alt="" />
            {photos.urls.length > 1 && <span className="ig-cnt">1/{photos.urls.length}</span>}
          </>
        ) : (
          <label className={`s-noimg f-${it.format}`} style={{ cursor: 'pointer' }}>
            <Ic size={24} /><small>{t.noPhoto}</small>
            <span className="s-btn sec xs" style={{ marginTop: 4 }}><ImagePlus size={13} />{multiple ? t.addPhotos : t.addPhoto}</span>
            <input type="file" accept="image/*" multiple={multiple} hidden onChange={(e) => { void photos.add(e.target.files); e.target.value = ''; }} />
          </label>
        )}
      </div>
      <div className="s-col s-pad" style={{ gap: 8 }}>
        <FormatBadge format={it.format} />
        <h2 className="s-tpt">{it.idea}</h2>
        {it.hook && <span className="s-sub-t" style={{ fontSize: 13.5 }}>&ldquo;{it.hook}&rdquo;</span>}
        <div className="s-row" style={{ flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
          {it.posted ? <>
            <span className="s-badge good"><Check size={12} />{t.postedDone}</span>
            <button type="button" className="s-btn sec xs" onClick={() => setPosted(false)}><Undo2 size={13} />{t.undo}</button>
          </> : <>
            <Link href={`/app/create?topic=${encodeURIComponent(it.idea)}&format=${it.format}`} className="s-btn xs">{t.writeIt}</Link>
            <button type="button" className="s-btn sec xs" onClick={() => setPosted(true)}><Check size={13} />{t.posted}</button>
          </>}
        </div>
      </div>
    </>,
  );
}
