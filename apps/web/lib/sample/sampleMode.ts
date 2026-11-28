'use client';

import { create } from 'zustand';
import type { PlanRecord, TriageState } from '@/lib/db';
import { track } from '@/lib/analytics';
import { installSampleFetch, uninstallSampleFetch } from './sampleIntercept';

// "Try it with sample data": a made-up account shown in Studio. The on/off
// flag lives in sessionStorage (this tab only); marks, stars and the unfollow
// plan made on the sample live in memory only. Nothing about the sample is
// ever written to IndexedDB, cloud sync or history (see sampleGuard.ts, which
// blocks those writes), and the coach API is answered in the browser while it
// is on (sampleIntercept.ts), so it never costs a model call.

export type SampleEntry = 'home' | 'empty' | 'results' | 'url';
const KEY = 'wu:sample';

interface SampleStore {
  on: boolean;
  marks: Map<string, TriageState>;
  visited: Set<string>;
  stars: Set<string>;
  plan: PlanRecord | null;
  enter: (entry: SampleEntry) => void;
  // Picks the flag back up after a reload (no event).
  resume: () => void;
  exit: () => void;
  mark: (username: string, state: TriageState | null) => void;
  visit: (username: string) => void;
  star: (username: string) => void;
  setPlan: (plan: PlanRecord | null) => void;
}

const readFlag = () => { try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; } };

export const useSampleStore = create<SampleStore>((set) => ({
  // Off on the server and on the first client render (same HTML); SampleGate
  // turns it on after mount.
  on: false,
  marks: new Map(),
  visited: new Set(),
  stars: new Set(),
  plan: null,
  enter: (entry) => {
    try { sessionStorage.setItem(KEY, '1'); } catch { /* storage blocked: memory only */ }
    installSampleFetch();
    track('Sample Opened', { entry });
    set({ on: true });
  },
  resume: () => { if (readFlag()) { installSampleFetch(); set({ on: true }); } },
  exit: () => {
    try { sessionStorage.removeItem(KEY); } catch { /* storage blocked */ }
    uninstallSampleFetch();
    set({ on: false, marks: new Map(), visited: new Set(), stars: new Set(), plan: null });
  },
  mark: (username, state) => set((s) => {
    const marks = new Map(s.marks);
    if (state) marks.set(username, state); else marks.delete(username);
    return { marks };
  }),
  visit: (username) => set((s) => (s.visited.has(username) ? s : { visited: new Set(s.visited).add(username) })),
  star: (username) => set((s) => {
    const stars = new Set(s.stars);
    if (stars.has(username)) stars.delete(username); else stars.add(username);
    return { stars };
  }),
  setPlan: (plan) => set({ plan }),
}));

export const useSampleOn = () => useSampleStore((s) => s.on);

// For code outside React (the IndexedDB write guard).
export function isSampleOn(): boolean {
  return useSampleStore.getState().on;
}

// Fixed event names; never anything user-provided.
export type SampleEvent = 'Sample Screen' | 'Sample Export Started' | 'Sample Reminder Added' | 'Sample ProAI Clicked';
export function trackSample(event: SampleEvent, data?: { screen?: string; via?: string }): void {
  track(event, data);
}
