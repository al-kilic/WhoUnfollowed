import { TIKTOK_LIST_CAP, tiktokListNearCap, type ParsedSnapshot } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import type { AppLocale } from '@/i18n/routing';
import { snapshotPlatform } from '@/lib/platform';

const COPY: Record<AppLocale, (cap: string) => string> = {
  en: cap => `TikTok's download lists up to about ${cap} followers. You're at that limit, so your oldest followers may be missing and could show up as "doesn't follow back". Check before you unfollow anyone you know.`,
  es: cap => `La descarga de TikTok lista hasta unos ${cap} seguidores. Estás en ese límite, así que pueden faltar tus seguidores más antiguos y aparecer como "no te sigue". Revisa antes de dejar de seguir a alguien que conoces.`,
  pt: cap => `O download do TikTok lista até uns ${cap} seguidores. Você está nesse limite, então seus seguidores mais antigos podem faltar e aparecer como "não segue de volta". Confira antes de deixar de seguir alguém que você conhece.`,
};

// Shown on TikTok results when a list is at TikTok's export cap.
export function TikTokCapNotice({ snapshot, locale }: { snapshot: ParsedSnapshot; locale: AppLocale }) {
  if (snapshotPlatform(snapshot) !== 'tiktok' || !tiktokListNearCap(snapshot)) return null;
  return (
    <div role="note" style={{ marginTop: 16, padding: '12px 16px', borderRadius: 12, border: '1px solid var(--t-terra)', fontSize: 13, color: T.inkDim, lineHeight: 1.5, maxWidth: 560 }}>
      {COPY[locale](new Intl.NumberFormat(locale).format(TIKTOK_LIST_CAP))}
    </div>
  );
}
