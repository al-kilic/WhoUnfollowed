'use client';

import { createContext, useContext, type ReactNode } from 'react';

export interface AuthState {
  userEmail: string | null;
  isPro: boolean;
}

const AuthContext = createContext<AuthState>({ userEmail: null, isPro: false });

// Provides the current login state to client components (notably SiteNav) so any
// page can render the correct logged-in / logged-out nav without fetching auth.
export function AuthProvider({ value, children }: { value: AuthState; children: ReactNode }) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
