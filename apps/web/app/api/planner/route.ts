import { NextResponse } from 'next/server';
import { plannerSyncSchema, platformSchema } from '@ig-tracker/core';
import { routing } from '@/i18n/routing';
import { validateRequest } from '@/lib/auth/session';
import { isProUser } from '@/lib/flags';
import { deletePlan, upsertPlan } from '@/lib/planner/store';

// Unfollow planner progress for the nudge email: counts and settings only.
// Pro feature, so it needs a logged-in Pro account.
async function proUserId(): Promise<string | null> {
  const { user } = await validateRequest();
  if (!user) return null;
  return (await isProUser()) ? user.id : null;
}

export async function POST(req: Request) {
  const userId = await proUserId();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const parsed = plannerSyncSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  const { locale, ...rest } = parsed.data;
  try {
    await upsertPlan({ userId, ...rest, locale: locale ?? routing.defaultLocale });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[planner] save failed:', err);
    return NextResponse.json({ error: 'save_failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const userId = await proUserId();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const platform = platformSchema.safeParse(new URL(req.url).searchParams.get('platform'));
  if (!platform.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  await deletePlan(userId, platform.data);
  return NextResponse.json({ ok: true });
}
