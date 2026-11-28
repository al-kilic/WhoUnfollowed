import { textDiff, type AiSignal } from '@ig-tracker/core';
import { isSampleOn } from '@/lib/sample/sampleMode';

// Browser only. Queues what a Pro AI member did with a coach answer and posts
// it in small batches to /api/ai/signal. Never sends in sample mode, and a
// failed send is dropped quietly: signals are a bonus, not something to retry.

const MAX_BATCH = 20;
const DELAY_MS = 1500;
const queue: AiSignal[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

function flush(): void {
  if (timer) { clearTimeout(timer); timer = null; }
  while (queue.length) {
    const batch = queue.splice(0, MAX_BATCH);
    void fetch('/api/ai/signal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ signals: batch }), keepalive: true }).catch(() => {});
  }
}

if (typeof window !== 'undefined') window.addEventListener('pagehide', flush);

export function sendSignal(s: AiSignal): void {
  if (typeof window === 'undefined' || isSampleOn()) return;
  queue.push(s);
  if (queue.length >= MAX_BATCH) { flush(); return; }
  timer ??= setTimeout(flush, DELAY_MS);
}

// A draft option was used (copied or sent to Check). When the member changed
// it first, the edit goes along as a word diff. `original` is the text the
// coach wrote, `used` what they actually took.
export function sendDraftUse(opts: { option: number; of: number; original: string; used: string; contentLogId: string | null }): void {
  const base = { action: 'draft' as const, contentLogId: opts.contentLogId, option: opts.option };
  sendSignal({ kind: 'draft_pick', ...base, of: opts.of, text: opts.used.slice(0, 300) });
  if (opts.original && opts.used.trim() !== opts.original.trim()) {
    sendSignal({ kind: 'draft_edit', ...base, diff: textDiff(opts.original, opts.used), before: opts.original.slice(0, 300), after: opts.used.slice(0, 300) });
  }
}
