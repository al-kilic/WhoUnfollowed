'use client';

import Link from 'next/link';
import type { ReactNode, InputHTMLAttributes } from 'react';
import { T } from '@/components/landing/tokens';

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
  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.bg,
        color: T.ink,
        fontFamily: T.sans,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* subtle teal radial glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 640,
          height: 640,
          background: `radial-gradient(circle, ${T.tealGlow} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', width: '100%', maxWidth: 400 }}>
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 26 }}
        >
          <img
            src="/logo.png"
            alt="WhoUnfollowed"
            width={30}
            height={30}
            style={{ borderRadius: 8, boxShadow: `0 4px 14px ${T.tealGlow}`, objectFit: 'contain' }}
          />
          <span style={{ fontFamily: T.serif, fontSize: 19, letterSpacing: '-0.01em', color: T.ink }}>
            WhoUnfollowed
          </span>
        </Link>

        <div
          style={{
            background: T.overlay,
            border: `1px solid ${T.border2}`,
            borderRadius: 18,
            padding: '32px 28px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.10)',
          }}
        >
          <h1
            style={{
              fontFamily: T.serif,
              fontSize: 28,
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: T.ink,
              marginBottom: subtitle ? 8 : 22,
              lineHeight: 1.12,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.55, marginBottom: 24 }}>{subtitle}</p>
          )}
          {children}
        </div>

        {footer && (
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: T.inkDim }}>{footer}</div>
        )}
      </div>
    </div>
  );
}

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  hint?: string;
}

export function AuthField({ label, id, hint, ...props }: AuthFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>
        {label}
      </label>
      <input
        id={id}
        {...props}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 10,
          fontSize: 14,
          fontFamily: T.sans,
          color: T.ink,
          background: T.surface1,
          border: `1px solid ${T.border2}`,
          outline: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = T.tealMid;
          e.currentTarget.style.boxShadow = `0 0 0 3px ${T.tealGlow}`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = T.border2;
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      {hint && <p style={{ fontSize: 12, color: T.inkMute }}>{hint}</p>}
    </div>
  );
}

export function AuthError({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontSize: 13, color: T.terra, lineHeight: 1.4 }}>{children}</p>
  );
}

export function AuthButton({ pending, children }: { pending?: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: '100%',
        padding: '11px 16px',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        fontFamily: T.sans,
        color: T.cream,
        background: T.teal,
        border: `1px solid rgba(2,136,143,0.5)`,
        cursor: pending ? 'default' : 'pointer',
        opacity: pending ? 0.6 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      {children}
    </button>
  );
}
