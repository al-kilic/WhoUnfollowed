'use client';

import type { ReactNode, InputHTMLAttributes } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { StudioFrame } from '@/components/studio/StudioFrame';
import { SiteHeader } from '@/components/site/SiteHeader';
import type { AppLocale } from '@/i18n/routing';
import { AuthPanel } from './AuthPanel';
import { variantFromPath } from './authPanel.content';
import '@/styles/auth.css';

// Sign-in, sign-up, password, verify, welcome and unsubscribe screens share
// this shell. It uses the new look (StudioFrame: Geist, neutral greys, teal
// accent); the old T tokens used inside the forms are mapped onto the studio
// colours by the .studio scope, so they follow light and dark mode too.
// Desktop: the form on the left, a story panel on the right (AuthPanel),
// with copy for the screen it is on. Phones: a slim band of the art, then
// the form.

const PRIVACY: Record<AppLocale, string> = {
  en: 'We never ask for your Instagram password.',
  es: 'Nunca te pedimos tu contraseña de Instagram.',
  pt: 'Nunca pedimos a sua senha do Instagram.',
};

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const locale = useLocale() as AppLocale;
  const variant = variantFromPath(usePathname());
  return (
    <StudioFrame>
      <SiteHeader />
      <main className="a-wrap">
        <AuthPanel locale={locale} variant={variant} />
        <div className="a-col">
          <section className="s-card a-card" aria-labelledby="auth-title">
            <h1 id="auth-title" className="a-title">{title}</h1>
            {subtitle && <p className="a-sub">{subtitle}</p>}
            {children}
          </section>
          {footer && <div className="a-foot">{footer}</div>}
          <p className="a-privacy"><ShieldCheck size={14} aria-hidden />{PRIVACY[locale] ?? PRIVACY.en}</p>
        </div>
      </main>
    </StudioFrame>
  );
}

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  hint?: string;
}

export function AuthField({ label, id, hint, ...props }: AuthFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className="a-field">
      <label htmlFor={id} className="a-label">{label}</label>
      <input id={id} className="s-input a-input" aria-describedby={hintId} {...props} />
      {hint && <p id={hintId} className="a-hint">{hint}</p>}
    </div>
  );
}

export function AuthError({ children }: { children: ReactNode }) {
  return <p role="alert" className="a-error">{children}</p>;
}

export function AuthButton({ pending, children }: { pending?: boolean; children: ReactNode }) {
  return (
    <button type="submit" disabled={pending} aria-busy={pending || undefined} className="s-btn a-btn">
      {children}
    </button>
  );
}
