import type { AppLocale } from '@/i18n/routing';

// Planned Studio pages that are not built yet. Each one says plainly what it
// will do; nothing is collected or sent from these pages.
export type LaterKey = 'kit' | 'guides';
type Later = Record<LaterKey, { title: string; body: string; points: string[] }>;

const EN: Later = {
  kit: { title: 'Media kit', body: 'A one-page summary of your account to send to brands.', points: ['Your audience and growth, in numbers', 'Your best posts', 'A link you control and can turn off'] },
  guides: { title: 'Guides', body: 'Short guides on growing an account, included with the yearly plan.', points: ['Written for photographers and creators', 'Read here or download', 'New ones added over time'] },
};
const ES: Later = {
  kit: { title: 'Media kit', body: 'Un resumen de una página de tu cuenta para enviar a marcas.', points: ['Tu audiencia y tu crecimiento, en cifras', 'Tus mejores publicaciones', 'Un enlace que controlas y puedes desactivar'] },
  guides: { title: 'Guías', body: 'Guías breves para hacer crecer una cuenta, incluidas en el plan anual.', points: ['Escritas para fotógrafos y creadores', 'Léelas aquí o descárgalas', 'Se añaden nuevas con el tiempo'] },
};
const PT: Later = {
  kit: { title: 'Media kit', body: 'Um resumo de uma página da sua conta para enviar a marcas.', points: ['Seu público e crescimento, em números', 'Seus melhores posts', 'Um link que você controla e pode desligar'] },
  guides: { title: 'Guias', body: 'Guias curtos para crescer uma conta, incluídos no plano anual.', points: ['Escritos para fotógrafos e criadores', 'Leia aqui ou baixe', 'Novos guias com o tempo'] },
};

export function getLaterContent(locale: AppLocale): Later {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
