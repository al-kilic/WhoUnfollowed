import { describe, expect, it, vi } from 'vitest';
import { createSharedQuery, type Start } from './sharedQuery';

function source() {
  const emits = new Map<string, (v: number) => void>();
  const stops: string[] = [];
  const start = vi.fn<Start<number>>((key, emit) => {
    emits.set(key, emit);
    return () => { stops.push(key); };
  });
  return { start, emits, stops };
}

describe('createSharedQuery', () => {
  it('starts the source once for many subscribers and shares the value', () => {
    const s = source();
    const q = createSharedQuery(s.start);
    const a = vi.fn(); const b = vi.fn();
    q.subscribe('u1', a);
    q.subscribe('u1', b);
    expect(s.start).toHaveBeenCalledTimes(1);
    expect(q.get('u1')).toBeUndefined();
    s.emits.get('u1')!(7);
    expect(q.get('u1')).toBe(7);
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('keeps the value when everyone leaves, so the next page reads nothing again', () => {
    const s = source();
    const q = createSharedQuery(s.start);
    const off = q.subscribe('u1', () => {});
    s.emits.get('u1')!(3);
    off();
    q.subscribe('u1', () => {});
    expect(s.start).toHaveBeenCalledTimes(1);
    expect(s.stops).toEqual([]);
    expect(q.get('u1')).toBe(3);
  });

  it('stops an idle key when another key starts (a different user in this tab)', () => {
    const s = source();
    const q = createSharedQuery(s.start);
    const off = q.subscribe('anon', () => {});
    s.emits.get('anon')!(1);
    off();
    q.subscribe('u1', () => {});
    expect(s.stops).toEqual(['anon']);
    expect(q.get('anon')).toBeUndefined();
  });

  it('never stops a key that still has listeners', () => {
    const s = source();
    const q = createSharedQuery(s.start);
    q.subscribe('anon', () => {});
    q.subscribe('u1', () => {});
    expect(s.stops).toEqual([]);
  });

  it('read() waits for the first value, then answers from the cache', async () => {
    const s = source();
    const q = createSharedQuery(s.start);
    const p = q.read('u1');
    s.emits.get('u1')!(5);
    await expect(p).resolves.toBe(5);
    await expect(q.read('u1')).resolves.toBe(5);
    expect(s.start).toHaveBeenCalledTimes(1);
  });
});
