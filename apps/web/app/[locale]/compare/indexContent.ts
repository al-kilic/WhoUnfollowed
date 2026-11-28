import type { AppLocale } from '@/i18n/routing';
import { PRO_AI_PRICE_USD } from '@/lib/pricing';

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
  mobileNote: string;
  studyLink: string;
  detailedComparisonsLabel: string;
  detailedComparisonLinks: { label: string; slug: string }[];
}

const EN: CompareIndexContent = {
  eyebrow: 'Compare',
  headline: 'WhoUnfollowed vs every other Instagram tracker.',
  intro: 'Most of the big apps in this space ask for your Instagram password. That is not a coincidence: your login is how they get the data. A few newer apps read your official export like we do; we compare those too. Here is the full breakdown. (WhoUnfollowed also works with Threads and TikTok exports.)',
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
        { label: 'Account check with what to fix first', values: [true, false, false, false, false] },
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
        { label: 'Price', values: [`Free · Pro AI $${PRO_AI_PRICE_USD.monthly}/mo`, '$2.99/mo', '$3.49/mo', '$1.99/mo', '$4.49/mo'] },
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
  studyLink: 'Our study: how the 30 most-rated unfollower apps get your data →',
  mobileNote: 'Soon: our iPhone and Android apps are in development. WhoUnfollowed already works on your phone today: open it in Safari or Chrome and add it to your home screen for one-tap access.',
  detailedComparisonsLabel: 'Detailed comparisons:',
  detailedComparisonLinks: [
    { label: 'vs Followers & Unfollowers', slug: 'whounfollowed-vs-followers-unfollowers' },
    { label: 'vs FollowMeter', slug: 'whounfollowed-vs-followmeter' },
    { label: 'vs Unfollowers for Instagram', slug: 'whounfollowed-vs-unfollowers-instagram' },
    { label: 'vs Reports+', slug: 'whounfollowed-vs-reports-plus' },
    { label: 'vs nFollowers', slug: 'whounfollowed-vs-nfollowers' },
    { label: 'vs FANS', slug: 'whounfollowed-vs-fans' },
    { label: 'vs Unfollowify', slug: 'whounfollowed-vs-unfollowify' },
    { label: 'vs FollowBuddy', slug: 'whounfollowed-vs-followbuddy' },
  ],
};

const ES: CompareIndexContent = {
  eyebrow: 'Comparar',
  headline: 'WhoUnfollowed vs todos los demás rastreadores de Instagram.',
  intro: 'La mayoría de las grandes apps de este espacio piden tu contraseña de Instagram. No es coincidencia: tu inicio de sesión es cómo obtienen los datos. Algunas apps más nuevas leen tu export oficial como nosotros; también las comparamos. Aquí está el desglose completo. (WhoUnfollowed también funciona con exports de Threads y TikTok.)',
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
        { label: 'Revisión de cuenta con qué arreglar primero', values: [true, false, false, false, false] },
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
        { label: 'Precio', values: [`Gratis · Pro AI $${PRO_AI_PRICE_USD.monthly}/mes`, '$2.99/mes', '$3.49/mes', '$1.99/mes', '$4.49/mes'] },
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
  studyLink: 'Nuestro estudio (en inglés): cómo obtienen tus datos las 30 apps de unfollowers más valoradas →',
  mobileNote: 'Pronto: nuestras apps para iPhone y Android están en desarrollo. WhoUnfollowed ya funciona hoy en tu móvil: ábrelo en Safari o Chrome y añádelo a tu pantalla de inicio para abrirlo con un toque.',
  detailedComparisonsLabel: 'Comparaciones detalladas:',
  detailedComparisonLinks: [
    { label: 'vs Followers & Unfollowers', slug: 'whounfollowed-vs-followers-unfollowers' },
    { label: 'vs FollowMeter', slug: 'whounfollowed-vs-followmeter' },
    { label: 'vs Unfollowers for Instagram', slug: 'whounfollowed-vs-unfollowers-instagram' },
    { label: 'vs Reports+', slug: 'whounfollowed-vs-reports-plus' },
    { label: 'vs nFollowers', slug: 'whounfollowed-vs-nfollowers' },
    { label: 'vs FANS', slug: 'whounfollowed-vs-fans' },
    { label: 'vs Unfollowify', slug: 'whounfollowed-vs-unfollowify' },
    { label: 'vs FollowBuddy', slug: 'whounfollowed-vs-followbuddy' },
  ],
};

const PT: CompareIndexContent = {
  eyebrow: 'Comparar',
  headline: 'WhoUnfollowed vs todos os outros rastreadores do Instagram.',
  intro: 'A maioria dos grandes apps nesse espaço pede sua senha do Instagram. Não é coincidência: seu login é como eles conseguem os dados. Alguns apps mais novos leem seu export oficial como nós; também comparamos esses. Aqui está o detalhamento completo. (O WhoUnfollowed também funciona com exports do Threads e do TikTok.)',
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
        { label: 'Revisão da conta com o que arrumar primeiro', values: [true, false, false, false, false] },
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
        { label: 'Preço', values: [`Grátis · Pro AI $${PRO_AI_PRICE_USD.monthly}/mês`, '$2.99/mês', '$3.49/mês', '$1.99/mês', '$4.49/mês'] },
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
  studyLink: 'Nosso estudo (em inglês): como os 30 apps de unfollowers mais avaliados conseguem seus dados →',
  mobileNote: 'Em breve: nossos apps para iPhone e Android estão em desenvolvimento. O WhoUnfollowed já funciona hoje no seu celular: abra no Safari ou no Chrome e adicione à tela de início para abrir com um toque.',
  detailedComparisonsLabel: 'Comparações detalhadas:',
  detailedComparisonLinks: [
    { label: 'vs Followers & Unfollowers', slug: 'whounfollowed-vs-followers-unfollowers' },
    { label: 'vs FollowMeter', slug: 'whounfollowed-vs-followmeter' },
    { label: 'vs Unfollowers for Instagram', slug: 'whounfollowed-vs-unfollowers-instagram' },
    { label: 'vs Reports+', slug: 'whounfollowed-vs-reports-plus' },
    { label: 'vs nFollowers', slug: 'whounfollowed-vs-nfollowers' },
    { label: 'vs FANS', slug: 'whounfollowed-vs-fans' },
    { label: 'vs Unfollowify', slug: 'whounfollowed-vs-unfollowify' },
    { label: 'vs FollowBuddy', slug: 'whounfollowed-vs-followbuddy' },
  ],
};

export function getCompareIndexContent(locale: AppLocale): CompareIndexContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
