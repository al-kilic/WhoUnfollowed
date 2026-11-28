import { NextResponse } from 'next/server';
import { aiOnboardingSchema } from '@ig-tracker/core';
import { guardProAi, readJson } from '@/lib/ai/guard';
import { saveOnboarding } from '@/lib/ai/store';

// Onboarding answers. The first time, this also starts memory.md.
export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  const body = await readJson(req);
  const parsed = aiOnboardingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  // The starting memory is written in the language the user onboarded in.
  const locale = (body as { locale?: unknown } | null)?.locale;
  await saveOnboarding(g.userId, parsed.data, locale === 'es' || locale === 'pt' ? locale : 'en');
  return NextResponse.json({ ok: true });
}
