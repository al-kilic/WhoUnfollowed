// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { ParsedSnapshot } from '../schemas.js';
import { runHealthChecks } from './healthChecks.js';
import { curiosities } from './curiosities.js';

// Radar's findings (health checks + curiosities) reduced to facts the coach
// may see: an id and its numbers or dates. Account lists, chart series and any
// other string are dropped here, in the browser, so no username can ever
// leave it this way. The schema on the server enforces the same shape.

export interface RadarFact {
  id: string;
  params: Record<string, number | string>;
}

// Only numbers and ISO-ish dates ('2026-03' or '2026-03-14') pass.
export const RADAR_FACT_VALUE = /^\d{4}-\d{2}(-\d{2})?$/;
export const RADAR_FACTS_MAX = 16;

function clean(params: Record<string, number | string>): Record<string, number | string> {
  const out: Record<string, number | string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
    else if (typeof v === 'string' && RADAR_FACT_VALUE.test(v)) out[k] = v;
  }
  return out;
}

export function radarFacts(current: ParsedSnapshot, previous?: ParsedSnapshot, now?: number): RadarFact[] {
  const health = runHealthChecks({ current, previous, ...(now !== undefined ? { now } : {}) })
    .filter(f => f.id !== 'second_export')
    .sort((a, b) => b.impact - a.impact)
    .map(f => ({ id: `fix.${f.id}`, params: clean(f.params) }));
  const facts = curiosities({ current, previous })
    .filter(c => c.id !== 'since_last') // describeStats already says this, from the ledger
    .map(c => ({ id: `fact.${c.id}`, params: clean(c.params) }));
  return [...health, ...facts].slice(0, RADAR_FACTS_MAX);
}
