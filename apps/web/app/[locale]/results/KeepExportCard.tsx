'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { T } from '@/components/landing/tokens';
import { Events, track } from '@/lib/analytics';
import type { AppLocale } from '@/i18n/routing';

// For signed-out visitors only. Their export is tied to this tab session (see
// lib/localOwnership.ts), so without an account the next upload has nothing to
// compare against. Signing up in this same tab claims the export (history page),
// and it stays in this browser. Inline card, never a pop-up.
interface KeepExportContent { eyebrow: string; title: string; body: string; cta: string; note: string }

const CONTENT: Record<AppLocale, KeepExportContent> = {
  en: {
    eyebrow: 'NEXT TIME',
    title: 'Keep this export so next time shows who left.',
    body: 'Right now this export only lives in this browser tab. Close it and it is gone, so your next upload has nothing to compare with. A free account keeps it in this browser for next time. Your lists still never leave your device.',
    cta: 'Keep it with a free account',
    note: 'Free, no Instagram, Threads or TikTok password. We email you when it is worth checking again, with one click to stop.',
  },
  es: {
    eyebrow: 'LA PRÓXIMA VEZ',
    title: 'Guarda esta exportación para ver quién se fue la próxima vez.',
    body: 'Ahora mismo esta exportación solo vive en esta pestaña. Si la cierras, se pierde, y tu próxima subida no tendrá con qué compararse. Una cuenta gratis la guarda en este navegador para la próxima vez. Tus listas siguen sin salir de tu dispositivo.',
    cta: 'Guárdala con una cuenta gratis',
    note: 'Gratis, sin contraseña de Instagram, Threads ni TikTok. Te escribimos cuando valga la pena revisar de nuevo, y lo paras con un clic.',
  },
  pt: {
    eyebrow: 'DA PRÓXIMA VEZ',
    title: 'Guarde esta exportação para ver quem saiu da próxima vez.',
    body: 'Agora esta exportação só existe nesta aba. Se você fechar, ela some, e o próximo envio não terá com o que comparar. Uma conta grátis guarda ela neste navegador para a próxima vez. Suas listas continuam sem sair do seu dispositivo.',
    cta: 'Guardar com uma conta grátis',
    note: 'Grátis, sem senha do Instagram, do Threads ou do TikTok. Avisamos por e-mail quando valer a pena checar de novo, e você para com um clique.',
  },
};

export function KeepExportCard({ locale }: { locale: AppLocale }) {
  const c = CONTENT[locale];
  useEffect(() => { track(Events.offerView, { placement: 'results-keep-export' }); }, []);

  return (
    <section style={{ marginTop: 32, padding: '22px 24px', borderRadius: 16, background: T.surface1, border: `1px solid ${T.border2}` }}>
      <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '0.12em', color: T.tealMid, marginBottom: 8 }}>{c.eyebrow}</div>
      <h2 style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 400, lineHeight: 1.25, margin: '0 0 8px', color: T.ink }}>{c.title}</h2>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: T.inkDim, margin: '0 0 16px', maxWidth: 620 }}>{c.body}</p>
      <Link
        href="/signup"
        onClick={() => track(Events.keepExportClick, { placement: 'results' })}
        style={{ display: 'inline-block', fontSize: 14, fontWeight: 600, color: T.cream, textDecoration: 'none', padding: '11px 20px', borderRadius: 10, background: T.teal }}
      >
        {c.cta}
      </Link>
      <p style={{ fontSize: 12, lineHeight: 1.5, color: T.inkMute, margin: '12px 0 0' }}>{c.note}</p>
    </section>
  );
}
