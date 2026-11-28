// One live query per key, shared by every component that asks for it. The
// first subscriber starts the source; later ones read the cached value. The
// source keeps running after the last subscriber leaves, so moving between
// pages does not read everything again; it stops only when a different key
// (another user in the same tab) starts. Kept free of Dexie so it can be
// tested without IndexedDB.
export type Start<T> = (key: string, emit: (value: T) => void) => () => void;

interface Entry<T> {
  value: T | undefined;
  listeners: Set<() => void>;
  stop: (() => void) | null;
}

export function createSharedQuery<T>(start: Start<T>) {
  const entries = new Map<string, Entry<T>>();

  function entryFor(key: string): Entry<T> {
    let e = entries.get(key);
    if (!e) { e = { value: undefined, listeners: new Set(), stop: null }; entries.set(key, e); }
    return e;
  }

  // Stops (and forgets) every other key nobody is listening to.
  function dropIdleExcept(key: string) {
    for (const [k, e] of entries) {
      if (k === key || e.listeners.size > 0) continue;
      e.stop?.();
      entries.delete(k);
    }
  }

  function ensureStarted(key: string): Entry<T> {
    const e = entryFor(key);
    if (!e.stop) {
      dropIdleExcept(key);
      e.stop = start(key, (value) => {
        e.value = value;
        for (const l of [...e.listeners]) l();
      });
    }
    return e;
  }

  return {
    subscribe(key: string, listener: () => void): () => void {
      const e = ensureStarted(key);
      e.listeners.add(listener);
      return () => { e.listeners.delete(listener); };
    },
    get(key: string): T | undefined {
      return entries.get(key)?.value;
    },
    // The current value, waiting for the first one if it is not there yet.
    async read(key: string): Promise<T> {
      const e = ensureStarted(key);
      if (e.value !== undefined) return e.value;
      return new Promise<T>((resolve) => {
        const done = () => { e.listeners.delete(done); resolve(e.value as T); };
        e.listeners.add(done);
      });
    },
    // Tests only.
    reset() {
      for (const e of entries.values()) e.stop?.();
      entries.clear();
    },
  };
}
