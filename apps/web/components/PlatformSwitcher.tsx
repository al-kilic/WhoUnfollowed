'use client';

import { T } from '@/components/landing/tokens';
import { PLATFORM_NAME, type Platform } from '@/lib/platform';
import { PlatformIcon } from '@/components/PlatformIcon';

type Option = Platform | 'all';

interface Props<V extends Option> {
  options: readonly V[];
  active: V;
  onChange: (value: V) => void;
  ariaLabel: string;
  // Label for the 'all' option, when it's one of the options.
  allLabel?: string;
  // Platforms with no saved snapshot: still clickable, shown muted.
  empty?: readonly Platform[];
}

// Segmented Instagram / Threads control (optionally with "All").
export function PlatformSwitcher<V extends Option>({ options, active, onChange, ariaLabel, allLabel, empty = [] }: Props<V>) {
  return (
    <div role="group" aria-label={ariaLabel} style={{ display: 'inline-flex', padding: 3, borderRadius: 22, border: '1px solid var(--t-border2)', background: 'var(--t-surface1)', gap: 2 }}>
      {options.map(value => {
        const isActive = value === active;
        const isEmpty = value !== 'all' && empty.includes(value);
        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            onClick={() => { if (!isActive) onChange(value); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 18, cursor: isActive ? 'default' : 'pointer',
              fontSize: 12.5, fontFamily: T.sans, fontWeight: 600, border: 'none',
              background: isActive ? 'var(--t-bgCard)' : 'transparent',
              boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
              color: isActive ? T.ink : T.inkDim,
              opacity: isEmpty && !isActive ? 0.55 : 1,
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {value === 'all' ? allLabel : <><PlatformIcon platform={value as Platform} size={14} />{PLATFORM_NAME[value as Platform]}</>}
          </button>
        );
      })}
    </div>
  );
}
