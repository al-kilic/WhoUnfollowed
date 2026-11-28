import { NextResponse } from 'next/server';
import { aiPhotoStyleRequestSchema, platformSchema } from '@ig-tracker/core';
import { actionResponse, guardProAi, localeOf, needsOnboarding } from '@/lib/ai/guard';
import { guardUpload } from '@/lib/ai/uploadGuard';
import { UPLOAD_LIMITS } from '@/lib/uploadLimits';
import { runPhotoStyle } from '@/lib/ai/actions';

// "Learn my photo style": 6 to 24 small first photos from the member's own
// export. Photos are used for this one call and never stored.
export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!g.onboarded) return needsOnboarding();
  const up = await guardUpload(req, g.userId, 'photoStyle', UPLOAD_LIMITS.body.photoStyle);
  if (!up.ok) return up.response;
  const body = up.json as Record<string, unknown> | null;
  const parsed = aiPhotoStyleRequestSchema.safeParse(body ?? {});
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const platform = platformSchema.catch('instagram').parse(body?.platform);
  const res = await runPhotoStyle(g.userId, { ...parsed.data, platform }, localeOf(body?.locale));
  const out = actionResponse(res);
  if (!res.ok) return out;
  up.done();
  return NextResponse.json({ ...((await out.json()) as object), saved: res.saved ?? 0 }, { status: out.status });
}
