import { beforeEach, describe, expect, it } from 'vitest';
import { isSampleOn, useSampleStore } from './sampleMode';

describe('sample mode store', () => {
  beforeEach(() => { useSampleStore.getState().exit(); sessionStorage.clear(); });

  it('turns on for this tab only and keeps marks in memory', () => {
    useSampleStore.getState().enter('home');
    expect(isSampleOn()).toBe(true);
    expect(sessionStorage.getItem('wu:sample')).toBe('1');
    useSampleStore.getState().mark('lena..frames', 'not_a_fan');
    useSampleStore.getState().visit('lena..frames');
    expect(useSampleStore.getState().marks.get('lena..frames')).toBe('not_a_fan');
    // Nothing about the sample account goes to localStorage.
    expect(Object.keys(localStorage).some((k) => localStorage.getItem(k)?.includes('lena..frames'))).toBe(false);
  });

  it('exit clears the flag, the marks and the visited rows', () => {
    const s = useSampleStore.getState();
    s.enter('empty'); s.mark('a..b', 'done'); s.visit('a..b');
    s.exit();
    const after = useSampleStore.getState();
    expect(after.on).toBe(false);
    expect(after.marks.size).toBe(0);
    expect(after.visited.size).toBe(0);
    expect(sessionStorage.getItem('wu:sample')).toBeNull();
  });

  it('picks the flag back up after a reload, and starts off without it', () => {
    useSampleStore.getState().resume();
    expect(isSampleOn()).toBe(false);
    sessionStorage.setItem('wu:sample', '1');
    useSampleStore.getState().resume();
    expect(isSampleOn()).toBe(true);
  });
});
