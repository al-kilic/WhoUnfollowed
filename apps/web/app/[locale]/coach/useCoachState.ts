'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AI_USED_EVENT, type CoachState } from './api';

// Loads the Pro AI state (plan, monthly use, onboarding, latest read). Right after
// checkout the subscription may not be active yet (the Stripe webhook is still
// on its way), so a 403 is retried for up to a minute. Pass enabled=false for
// visitors without Pro AI: nothing is requested. `variant` changes when sample
// mode turns on or off: the state is dropped and loaded again, so the sample's
// state (answered in the browser) never stays on screen for a real member.
export function useCoachState(enabled = true, variant = '') {
  const [state, setState] = useState<CoachState | null>(null);
  const [activating, setActivating] = useState(false);

  const load = useCallback(async (attempt = 0) => {
    const res = await fetch('/api/ai/state', { cache: 'no-store' }).catch(() => null);
    if (res?.ok) { setActivating(false); setState((await res.json()) as CoachState); return; }
    if (res?.status === 403 && attempt < 30) {
      setActivating(true);
      setTimeout(() => void load(attempt + 1), 2000);
    }
  }, []);
  useEffect(() => {
    setState(null);
    if (enabled) void load();
  }, [enabled, variant, load]);

  // After every AI action (done or refused, announced by api.ts): read the
  // state again so the monthly use notes (near the limit, used up) follow the
  // real use. Quiet: the old state stays on screen until the new one arrives.
  const refresh = useCallback(() => { void load(); }, [load]);
  useEffect(() => {
    if (!enabled) return;
    window.addEventListener(AI_USED_EVENT, refresh);
    return () => window.removeEventListener(AI_USED_EVENT, refresh);
  }, [enabled, refresh]);
  return useMemo(() => ({ state, activating, reload: load, refresh }), [state, activating, load, refresh]);
}
