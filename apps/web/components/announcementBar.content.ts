import { routing, type AppLocale } from '@/i18n/routing';

// Bump the version to show the strip again to visitors who closed an older
// one. Lives here (not in the client component) so the root layout's inline
// script can import the plain string.
export const ANNOUNCE_STORAGE_KEY = 'wu:announce:waitlist-v1';

// Copy for the sitewide "something big is coming" strip above the nav.
export interface AnnouncementBarContent {
  badge: string;
  text: string;
  textShort: string;
  cta: string;
  dismiss: string;
}

const EN: AnnouncementBarContent = {
  badge: 'Coming soon',
  text: 'Something big is coming. New tools that help you grow, not just track.',
  textShort: 'Something big is coming.',
  cta: 'Join the waitlist',
  dismiss: 'Hide this announcement',
};

const ES: AnnouncementBarContent = {
  badge: 'Muy pronto',
  text: 'Algo grande se acerca. Nuevas herramientas para crecer, no solo medir.',
  textShort: 'Algo grande se acerca.',
  cta: 'Únete a la lista',
  dismiss: 'Ocultar este anuncio',
};

const PT: AnnouncementBarContent = {
  badge: 'Em breve',
  text: 'Algo grande está chegando. Novas ferramentas para crescer, não só acompanhar.',
  textShort: 'Algo grande está chegando.',
  cta: 'Entrar na lista',
  dismiss: 'Ocultar este aviso',
};

export function getAnnouncementBarContent(locale: AppLocale): AnnouncementBarContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}

// Auth flows, the post-purchase welcome and the waitlist itself: the strip
// would only distract there.
const HIDDEN_ON = ['/waitlist', '/login', '/signup', '/verify-email', '/forgot-password', '/reset-password', '/unsubscribe', '/welcome'];

// Where the strip should point for a pathname, or null when it stays hidden.
// The locale comes from the /es or /pt prefix (the root layout can't read it).
export function announcementTarget(pathname: string): { locale: AppLocale; href: string } | null {
  const seg = pathname.split('/')[1] ?? '';
  const prefixed = routing.locales.find((l) => l !== routing.defaultLocale && l === seg);
  const locale = prefixed ?? routing.defaultLocale;
  const rest = prefixed ? pathname.slice(seg.length + 1) || '/' : pathname;
  if (HIDDEN_ON.some((p) => rest === p || rest.startsWith(`${p}/`))) return null;
  return { locale, href: prefixed ? `/${prefixed}/waitlist` : '/waitlist' };
}
