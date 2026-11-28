import { NextResponse } from 'next/server';
import { PHOTO_SLOTS, photoOfTheDay, type PhotoSlot } from '@/lib/wrapPhoto';

// GET: today's photo for a card (?slot=wrap|verdict|post), proxied from Pexels.
// ?meta=1: who took it.
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const asked = q.get('slot');
  const slot: PhotoSlot = PHOTO_SLOTS.find((s) => s === asked) ?? 'wrap';
  const photo = await photoOfTheDay(slot);
  if (!photo) return NextResponse.json({ photo: null }, { status: 404 });
  if (q.get('meta')) {
    return NextResponse.json({ photographer: photo.photographer, page: photo.page }, { headers: { 'Cache-Control': 'public, max-age=3600' } });
  }
  const img = await fetch(photo.src).catch(() => null);
  if (!img?.ok || !img.body) return NextResponse.json({ photo: null }, { status: 502 });
  return new Response(img.body, { headers: { 'Content-Type': img.headers.get('content-type') ?? 'image/jpeg', 'Cache-Control': 'public, max-age=21600' } });
}
