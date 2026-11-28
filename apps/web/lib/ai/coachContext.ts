import type { ExportStats } from '@ig-tracker/core';
import { describeStats } from './describeStats';
import { radarLines } from './radarLines';

// Builds the exact text the coach sees, plus a summary of where it came from
// (the source line under every answer). Pure, so tests can pin it down.
// Split in two for caching: `core` (account and memory) changes only when the
// member edits something, so it is byte-stable across days and actions and
// sent as the cached part of the request. `volatile` (numbers, Radar, results,
// brief) changes with every export and goes after the cache breakpoint.
// `core` must never hold today's date or numbers that move daily.
// The whole text goes through scrubHandles last: export numbers never hold
// usernames, but memory and post topics are typed by people and might.

export interface ContextSources {
  exports: number;
  // Epoch seconds of the oldest export in the context.
  since: number | null;
  goal: boolean;
  posted: number;
  memory: boolean;
  brief: string | null;
  facts: number;
  // Memory v2: notes sent (core + task).
  notes: number;
}

export interface CoachContext { text: string; core: string; volatile: string; sources: ContextSources }

export interface ContextInput {
  accountLine: string;
  extraLines: string[];
  goal: boolean;
  memory: string;
  stats: ExportStats[];
  results: string[];
  brief: { date: string; lines: string[] } | null;
  // The platform updates ledger: status and last check per change (platformUpdates.ts).
  updates?: string[];
  // Memory v2: notes in the cached core (pinned, strongest likes and
  // dislikes; byte-stable) and notes picked for this task.
  coreNotes?: string[];
  notes?: string[];
  // Memory v2 (phase 2E): how the member writes (cached core, byte-stable),
  // their posting history and the what-worked ledger (uncached).
  voice?: string[];
  history?: string[];
  ledger?: string[];
}

const HANDLE = /(^|[^\w.])@[A-Za-z0-9._]{2,30}/g;

export function scrubHandles(text: string): string {
  return text.replace(HANDLE, '$1@[account]');
}

export function buildCoachContext(i: ContextInput): CoachContext {
  const facts = radarLines(i.stats[0]?.facts);
  const core = [
    '# Account',
    i.accountLine,
    ...i.extraLines,
    '',
    "# Memory (written by the user and the coach; the user's lines win)",
    i.memory.trim() || '(empty)',
    ...(i.coreNotes?.length ? ['', '# What the coach knows (notes: [id] type · tags · note)', ...i.coreNotes] : []),
    ...(i.voice?.length ? ['', '# How they write (from their own captions; > lines are their words)', ...i.voice] : []),
  ].join('\n');
  const volatile = [
    '# Numbers (counted in code from the exports)',
    describeStats(i.stats),
    ...(facts.length ? ['', '# Radar findings (counted in code from the latest export)', ...facts] : []),
    ...(i.results.length ? ['', '# How recent posts did', ...i.results] : []),
    ...(i.history?.length ? ['', '# Posting history (from the export)', ...i.history] : []),
    ...(i.ledger?.length ? ['', '# What brought followers (posts marked as posted)', ...i.ledger] : []),
    ...(i.updates?.length ? ['', '# Platform updates (status and the day each was last checked)', ...i.updates] : []),
    ...(i.brief ? ['', '# This week on the platforms (from the weekly brief)', ...i.brief.lines] : []),
    ...(i.notes?.length ? ['', '# Notes for this task ([id] type · tags · note)', ...i.notes] : []),
  ].join('\n');
  const scrubbedCore = scrubHandles(core);
  const scrubbedVolatile = scrubHandles(volatile);
  const oldest = i.stats.length ? Math.min(...i.stats.map((s) => s.exportedAt)) : null;
  return {
    text: `${scrubbedCore}\n\n${scrubbedVolatile}`,
    core: scrubbedCore,
    volatile: scrubbedVolatile,
    sources: { exports: i.stats.length, since: oldest, goal: i.goal, posted: i.results.length, memory: i.memory.trim().length > 0, brief: i.brief?.date ?? null, facts: facts.length, notes: (i.coreNotes?.length ?? 0) + (i.notes?.length ?? 0) },
  };
}
