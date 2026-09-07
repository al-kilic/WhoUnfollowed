import type { AppLocale } from '@/i18n/routing';
import { UNLOCK_PRICE_USD } from '@/lib/pricing';

export type Val = true | false | 'partial' | string;

export interface FeatureRow {
  label: string;
  values: Val[]; // order matches competitor list
}

export interface FeatureGroup {
  category: string;
  icon: 'ShieldCheck' | 'Sparkles' | 'BarChart3' | 'Tag';
  rows: FeatureRow[];
}

export interface CompareIndexContent {
  eyebrow: string;
  headline: string;
  intro: string;
  competitorNames: string[]; // order: us, fau, followmeter, unfollowers, reportplus
  youAreHere: string;
  featureHeader: string;
  features: FeatureGroup[];
  getStarted: string;
  tryFree: string;
  requiresLogin: string;
  legendAvailable: string;
  legendNotAvailable: string;
  legendLimited: string;
  paidLabel: string;
  soonLabel: string;
  detailedComparisonsLabel: string;
  detailedComparisonLinks: { label: string; slug: string }[];
}

const EN: CompareIndexContent = {
  eyebrow: 'Compare',
  headline: 'WhoUnfollowed vs every other Instagram tracker.',
  intro: 'Every other app in this space asks for your Instagram password. That is not a coincidence. Your credentials are part of their business model. Here is the full breakdown.',
  competitorNames: ['WhoUnfollowed', 'Followers & Unfollowers', 'FollowMeter', 'Unfollowers for Instagram', 'Reports+'],
  youAreHere: 'You are here',
  featureHeader: 'FEATURE',
  features: [
    {
      category: 'Privacy & Safety', icon: 'ShieldCheck',
      rows: [
        { label: 'No password required', values: [true, false, false, false, false] },
        { label: 'Data stays on your device', values: [true, false, false, false, false] },
        { label: 'Zero account ban risk', values: [true, false, false, false, false] },
        { label: 'Open source & auditable', values: [true, false, false, false, false] },
        { label: 'Works in browser, no app needed', values: [true, false, false, false, false] },
      ],
    },
    {
      category: 'Core Features', icon: 'Sparkles',
      rows: [
        { label: 'Full non-followers list', values: [true, true, true, true, true] },
        { label: 'Who unfollowed you', values: [true, true, true, true, 'paid'] },
        { label: 'New followers detected', values: [true, true, true, true, true] },
        { label: 'Fans list', values: [true, true, true, true, 'paid'] },
        { label: 'Mutual follows', values: [true, true, true, true, true] },
        { label: 'CSV export', values: [true, false, 'paid', false, 'paid'] },
        { label: 'Free tier', values: [true, true, true, true, true] },
        { label: 'No signup required', values: [true, false, false, false, false] },
      ],
    },
    {
      category: 'Advanced Analytics', icon: 'BarChart3',
      rows: [
        { label: 'Snapshot history & comparison', values: [true, false, 'paid', false, 'paid'] },
        { label: 'Triage workflow', values: [true, false, false, false, false] },
        { label: 'Follow age analysis', values: [true, false, false, false, false] },
        { label: 'Account health score', values: [true, false, false, false, false] },
        { label: 'Growth charts', values: [true, false, 'paid', false, 'paid'] },
        { label: 'Pending requests shown', values: [true, false, false, false, false] },
      ],
    },
    {
      category: 'Platform & Pricing', icon: 'Tag',
      rows: [
        { label: 'Web app', values: [true, false, false, false, false] },
        { label: 'iOS app', values: ['soon', true, true, true, true] },
        { label: 'Android app', values: ['soon', true, true, true, true] },
        { label: 'Full list on free plan', values: [true, 'partial', 'partial', 'partial', false] },
        { label: 'Price', values: [`$${UNLOCK_PRICE_USD.monthly} one-time (30 days)`, '$2.99/mo', '$3.49/mo', '$1.99/mo', '$4.49/mo'] },
      ],
    },
  ],
  getStarted: 'Get started',
  tryFree: 'Try free →',
  requiresLogin: 'requires login',
  legendAvailable: 'Available',
  legendNotAvailable: 'Not available',
  legendLimited: 'Limited',
  paidLabel: 'Paid',
  soonLabel: 'Soon',
  detailedComparisonsLabel: 'Detailed comparisons:',
  detailedComparisonLinks: [
    { label: 'vs Followers & Unfollowers', slug: 'whounfollowed-vs-followers-unfollowers' },
    { label: 'vs FollowMeter', slug: 'whounfollowed-vs-followmeter' },
    { label: 'vs Unfollowers for Instagram', slug: 'whounfollowed-vs-unfollowers-instagram' },
  ],
};

const ES: CompareIndexContent = {
  eyebrow: 'Comparar',
  headline: 'WhoUnfollowed vs todos los demás rastreadores de Instagram.',
  intro: 'Todas las demás apps en este espacio piden tu contraseña de Instagram. Eso no es coincidencia. Tus credenciales son parte de su modelo de negocio. Aquí está el desglose completo.',
  competitorNames: ['WhoUnfollowed', 'Followers & Unfollowers', 'FollowMeter', 'Unfollowers for Instagram', 'Reports+'],
  youAreHere: 'Estás aquí',
  featureHeader: 'FUNCIÓN',
  features: [
    {
      category: 'Privacidad y seguridad', icon: 'ShieldCheck',
      rows: [
        { label: 'No requiere contraseña', values: [true, false, false, false, false] },
        { label: 'Los datos se quedan en tu dispositivo', values: [true, false, false, false, false] },
        { label: 'Cero riesgo de baneo de cuenta', values: [true, false, false, false, false] },
        { label: 'Código abierto y auditable', values: [true, false, false, false, false] },
        { label: 'Funciona en el navegador, sin app necesaria', values: [true, false, false, false, false] },
      ],
    },
    {
      category: 'Funciones principales', icon: 'Sparkles',
      rows: [
        { label: 'Lista completa de no-seguidores', values: [true, true, true, true, true] },
        { label: 'Quién te dejó de seguir', values: [true, true, true, true, 'paid'] },
        { label: 'Nuevos seguidores detectados', values: [true, true, true, true, true] },
        { label: 'Lista de fans', values: [true, true, true, true, 'paid'] },
        { label: 'Seguidores mutuos', values: [true, true, true, true, true] },
        { label: 'Exportar CSV', values: [true, false, 'paid', false, 'paid'] },
        { label: 'Plan gratuito', values: [true, true, true, true, true] },
        { label: 'No requiere registro', values: [true, false, false, false, false] },
      ],
    },
    {
      category: 'Análisis avanzado', icon: 'BarChart3',
      rows: [
        { label: 'Historial y comparación de snapshots', values: [true, false, 'paid', false, 'paid'] },
        { label: 'Flujo de triaje', values: [true, false, false, false, false] },
        { label: 'Análisis de antigüedad de seguidores', values: [true, false, false, false, false] },
        { label: 'Puntaje de salud de cuenta', values: [true, false, false, false, false] },
        { label: 'Gráficos de crecimiento', values: [true, false, 'paid', false, 'paid'] },
        { label: 'Solicitudes pendientes visibles', values: [true, false, false, false, false] },
      ],
    },
    {
      category: 'Plataforma y precios', icon: 'Tag',
      rows: [
        { label: 'App web', values: [true, false, false, false, false] },
        { label: 'App para iOS', values: ['soon', true, true, true, true] },
        { label: 'App para Android', values: ['soon', true, true, true, true] },
        { label: 'Lista completa en el plan gratuito', values: [true, 'partial', 'partial', 'partial', false] },
        { label: 'Precio', values: [`$${UNLOCK_PRICE_USD.monthly} único (30 días)`, '$2.99/mes', '$3.49/mes', '$1.99/mes', '$4.49/mes'] },
      ],
    },
  ],
  getStarted: 'Empezar',
  tryFree: 'Probar gratis →',
  requiresLogin: 'requiere inicio de sesión',
  legendAvailable: 'Disponible',
  legendNotAvailable: 'No disponible',
  legendLimited: 'Limitado',
  paidLabel: 'De pago',
  soonLabel: 'Pronto',
  detailedComparisonsLabel: 'Comparaciones detalladas:',
  detailedComparisonLinks: [
    { label: 'vs Followers & Unfollowers', slug: 'whounfollowed-vs-followers-unfollowers' },
    { label: 'vs FollowMeter', slug: 'whounfollowed-vs-followmeter' },
    { label: 'vs Unfollowers for Instagram', slug: 'whounfollowed-vs-unfollowers-instagram' },
  ],
};

const PT: CompareIndexContent = {
  eyebrow: 'Comparar',
  headline: 'WhoUnfollowed vs todos os outros rastreadores do Instagram.',
  intro: 'Todos os outros apps nesse espaço pedem sua senha do Instagram. Isso não é coincidência. Suas credenciais são parte do modelo de negócio deles. Aqui está o detalhamento completo.',
  competitorNames: ['WhoUnfollowed', 'Followers & Unfollowers', 'FollowMeter', 'Unfollowers for Instagram', 'Reports+'],
  youAreHere: 'Você está aqui',
  featureHeader: 'RECURSO',
  features: [
    {
      category: 'Privacidade e segurança', icon: 'ShieldCheck',
      rows: [
        { label: 'Não exige senha', values: [true, false, false, false, false] },
        { label: 'Dados ficam no seu dispositivo', values: [true, false, false, false, false] },
        { label: 'Zero risco de banimento de conta', values: [true, false, false, false, false] },
        { label: 'Código aberto e auditável', values: [true, false, false, false, false] },
        { label: 'Funciona no navegador, sem app', values: [true, false, false, false, false] },
      ],
    },
    {
      category: 'Recursos principais', icon: 'Sparkles',
      rows: [
        { label: 'Lista completa de não-seguidores', values: [true, true, true, true, true] },
        { label: 'Quem deixou de te seguir', values: [true, true, true, true, 'paid'] },
        { label: 'Novos seguidores detectados', values: [true, true, true, true, true] },
        { label: 'Lista de fãs', values: [true, true, true, true, 'paid'] },
        { label: 'Seguidores mútuos', values: [true, true, true, true, true] },
        { label: 'Exportar CSV', values: [true, false, 'paid', false, 'paid'] },
        { label: 'Plano grátis', values: [true, true, true, true, true] },
        { label: 'Sem necessidade de cadastro', values: [true, false, false, false, false] },
      ],
    },
    {
      category: 'Análises avançadas', icon: 'BarChart3',
      rows: [
        { label: 'Histórico e comparação de snapshots', values: [true, false, 'paid', false, 'paid'] },
        { label: 'Fluxo de triagem', values: [true, false, false, false, false] },
        { label: 'Análise de tempo de seguidor', values: [true, false, false, false, false] },
        { label: 'Pontuação de saúde da conta', values: [true, false, false, false, false] },
        { label: 'Gráficos de crescimento', values: [true, false, 'paid', false, 'paid'] },
        { label: 'Solicitações pendentes visíveis', values: [true, false, false, false, false] },
      ],
    },
    {
      category: 'Plataforma e preços', icon: 'Tag',
      rows: [
        { label: 'App web', values: [true, false, false, false, false] },
        { label: 'App para iOS', values: ['soon', true, true, true, true] },
        { label: 'App para Android', values: ['soon', true, true, true, true] },
        { label: 'Lista completa no plano grátis', values: [true, 'partial', 'partial', 'partial', false] },
        { label: 'Preço', values: [`$${UNLOCK_PRICE_USD.monthly} único (30 dias)`, '$2.99/mês', '$3.49/mês', '$1.99/mês', '$4.49/mês'] },
      ],
    },
  ],
  getStarted: 'Começar',
  tryFree: 'Testar grátis →',
  requiresLogin: 'exige login',
  legendAvailable: 'Disponível',
  legendNotAvailable: 'Não disponível',
  legendLimited: 'Limitado',
  paidLabel: 'Pago',
  soonLabel: 'Em breve',
  detailedComparisonsLabel: 'Comparações detalhadas:',
  detailedComparisonLinks: [
    { label: 'vs Followers & Unfollowers', slug: 'whounfollowed-vs-followers-unfollowers' },
    { label: 'vs FollowMeter', slug: 'whounfollowed-vs-followmeter' },
    { label: 'vs Unfollowers for Instagram', slug: 'whounfollowed-vs-unfollowers-instagram' },
  ],
};

export function getCompareIndexContent(locale: AppLocale): CompareIndexContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
