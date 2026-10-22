'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export interface AuthState {
  userId: string | null;
  userEmail: string | null;
  isPro: boolean;
  isInsider: boolean;
  // False until the login state is known. Lets UI that differs by login state
  // (the nav's account area) wait instead of flashing the logged-out version.
  ready: boolean;
}

export type ServerAuthState = Omit<AuthState, 'ready'>;

const LOGGED_OUT: ServerAuthState = { userId: null, userEmail: null, isPro: false, isInsider: false };

const AuthContext = createContext<AuthState>({ ...LOGGED_OUT, ready: false });

// Provides the current login state to client components (notably SiteNav).
//
// The root layout renders this without a value: reading the session cookie
// there would make every page, marketing and blog included, render per
// request, so the state is fetched once on the client instead. Pages that are
// per-visitor anyway (results, diff) pass a server-rendered `value`, which
// skips the fetch and avoids a flash of the free-plan UI for Pro users.
export function AuthProvider({ value, children }: { value?: ServerAuthState; children: ReactNode }) {
  const pathname = usePathname();
  const [fetched, setFetched] = useState<ServerAuthState | null>(null);

  // A plain effect rather than a query library (none is installed). Refetched
  // on navigation because the root layout stays mounted across login/logout.
  useEffect(() => {
    if (value) return;
    let alive = true;
    fetch('/api/auth/state', { cache: 'no-store', credentials: 'same-origin' })
      .then(res => (res.ok ? (res.json() as Promise<ServerAuthState>) : LOGGED_OUT))
      .catch(() => LOGGED_OUT)
      .then(state => { if (alive) setFetched(state); });
    return () => { alive = false; };
  }, [value, pathname]);

  const state: AuthState = value
    ? { ...value, ready: true }
    : fetched ? { ...fetched, ready: true } : { ...LOGGED_OUT, ready: false };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
