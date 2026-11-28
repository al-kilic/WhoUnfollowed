// Tells the founder fast when the coach stops answering (beta, 2026-11-28):
// the first failure sends an alert at once, later ones are counted and sent at
// most once per quiet period, and the first answer after a failing stretch
// sends a short "working again". Pure: the clock and the sender are passed in.

export interface FailureAlerter {
  failed(action: string, detail: string, now: number): void;
  succeeded(now: number): void;
}

export function createFailureAlerter(opts: { quietMs: number; send: (text: string) => void }): FailureAlerter {
  let lastSent = -Infinity;
  let unsent = 0;
  let failing = false;
  let firstAt = 0;
  return {
    failed(action, detail, now) {
      if (!failing) { failing = true; firstAt = now; }
      unsent++;
      if (now - lastSent < opts.quietMs) return;
      const mins = Math.max(1, Math.round((now - firstAt) / 60_000));
      opts.send(`🚨 <b>Coach failing</b>: ${action}, ${detail}. ${unsent} failed request${unsent === 1 ? '' : 's'} ${unsent === 1 ? 'just now' : `in the last ${mins} min`}. Members see the beta error message.`);
      lastSent = now;
      unsent = 0;
    },
    succeeded(now) {
      if (!failing) return;
      failing = false;
      const extra = unsent ? ` (${unsent} more failed since the last alert)` : '';
      opts.send(`✅ Coach answering again${extra}.`);
      lastSent = now - opts.quietMs;
      unsent = 0;
    },
  };
}
