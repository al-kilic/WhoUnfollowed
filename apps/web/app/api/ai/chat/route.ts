import { NextResponse } from 'next/server';
import { aiChatRequestSchema, platformSchema } from '@ig-tracker/core';
import { actionResponse, guardProAi, localeOf, readJson } from '@/lib/ai/guard';
import { runChat } from '@/lib/ai/actions';
import { checkChatImage, underAttachLimit } from '@/lib/ai/imageCheck';

// Ask coach: one question with the last few turns of the conversation.
// With `stream: true` the answer streams as server-sent events: `delta` events
// carry the answer so far, one `done` event carries the usual JSON reply.
export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  const body = (await readJson(req)) as Record<string, unknown> | null;
  const parsed = aiChatRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  // Attachments: every photo must really be a JPEG, PNG or WebP of a sane size,
  // and a member can send only so many questions with attachments in a while.
  // The allowance and its daily pace limit apply on top (runAiAction).
  const att = parsed.data.attachments;
  if (att?.images.length && att.images.some((img) => !checkChatImage(img).ok)) return NextResponse.json({ error: 'invalid_image' }, { status: 400 });
  if ((att?.images.length || att?.context.length) && !underAttachLimit(g.userId)) return NextResponse.json({ error: 'attach_limit' }, { status: 429 });
  const platform = platformSchema.catch('instagram').parse(body?.platform);
  const locale = localeOf(body?.locale);

  const reply = async (res: Awaited<ReturnType<typeof runChat>>) => {
    const out = actionResponse(res);
    const json = (await out.json()) as object;
    return { status: out.status, json: res.ok && res.left !== undefined ? { ...json, left: res.left } : json };
  };

  if (body?.stream !== true) {
    const r = await reply(await runChat(g.userId, { ...parsed.data, platform }, locale));
    return NextResponse.json(r.json, { status: r.status });
  }

  const enc = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => controller.enqueue(enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      let last = '';
      try {
        const res = await runChat(g.userId, { ...parsed.data, platform }, locale, (answer) => {
          if (answer.length > last.length) { last = answer; send('delta', { answer }); }
        });
        const r = await reply(res);
        send('done', { status: r.status, ...r.json });
      } catch {
        send('done', { status: 502, ok: false, error: 'failed' });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', 'X-Accel-Buffering': 'no' } });
}
