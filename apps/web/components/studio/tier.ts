// Which plan Studio treats the visitor as. Kept apart from React so the rules
// are tested (tier.test.ts).
//  anon: no account. free: signed in, nothing paid. pro: the old one-time Pro
//  unlock (or Pro without the coach). proAi: the subscription with the coach.
// Old Pro buyers keep the coach on their one-off trial credits (hasProAi true)
// but read as 'pro', so Studio offers them the upgrade.
export type StudioTier = 'anon' | 'free' | 'pro' | 'proAi';

export function studioTier(a: { userId: string | null; isPro: boolean; hasProAi: boolean; isLegacyPro: boolean }, coachLoaded: boolean): { tier: StudioTier; hasProAi: boolean } {
  // Right after checkout the webhook may not have landed yet: a loaded coach
  // state proves Pro AI is active.
  const hasProAi = a.hasProAi || coachLoaded;
  // A lapsed old-Pro buyer keeps only the coach trial: Pro features (Radar,
  // History) stay locked, so they read as 'free' with the coach on.
  const tier: StudioTier = a.isLegacyPro ? (a.isPro ? 'pro' : 'free') : hasProAi ? 'proAi' : a.isPro ? 'pro' : a.userId ? 'free' : 'anon';
  return { tier, hasProAi };
}
