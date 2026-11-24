'use client';

import { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { useLocale } from 'next-intl';
import type { AppLocale } from '@/i18n/routing';
import { getAuthShellContent } from './authShell.content';

// Form controls shared by the account pages. Styling lives in globals.css
// (.wu-auth-*) so focus rings and hover states need no JS handlers.

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  hint?: string;
}

export function AuthField({ label, id, hint, type, ...props }: AuthFieldProps) {
  const c = getAuthShellContent(useLocale() as AppLocale);
  const [shown, setShown] = useState(false);
  const isPassword = type === 'password';
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className="wu-auth-field">
      <label htmlFor={id} className="wu-auth-label">{label}</label>
      <div className="wu-auth-input-wrap">
        <input
          id={id}
          type={isPassword && shown ? 'text' : type}
          aria-describedby={hintId}
          className={`wu-auth-input${isPassword ? ' wu-auth-input--with-toggle' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="wu-auth-eye"
            aria-label={shown ? c.hidePassword : c.showPassword}
            aria-pressed={shown}
            onClick={() => setShown((s) => !s)}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
              {shown && <path d="M3 3l18 18" />}
            </svg>
          </button>
        )}
      </div>
      {hint && <p id={hintId} className="wu-auth-hint">{hint}</p>}
    </div>
  );
}

export function AuthError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="wu-auth-error">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16.5v.01" />
      </svg>
      <span>{children}</span>
    </p>
  );
}

export function AuthButton({ pending, children }: { pending?: boolean; children: ReactNode }) {
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className="wu-auth-button">
      {pending && <span className="wu-auth-spinner" aria-hidden />}
      {children}
    </button>
  );
}
