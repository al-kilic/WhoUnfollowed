import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Liquid-glass button: frosted, translucent, with a soft top highlight and a
// blurred drop shadow beneath. The `.glass-button*` classes live in
// globals.css (this component only wires structure + variants).
//
// Polymorphic: pass `href` to render an <a> instead of a <button>. Both share
// the exact same markup + classes so a primary button and a secondary link
// render pixel-identical dimensions side by side.
const glassButtonVariants = cva(
  'glass-button relative isolate inline-block cursor-pointer rounded-full transition-all',
  {
    variants: {
      variant: {
        primary: 'glass-button-primary',
        secondary: 'glass-button-secondary',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

const glassButtonTextVariants = cva(
  'glass-button-text block select-none',
  {
    variants: {
      size: {
        sm: 'px-4 py-1.5 text-[13px] font-semibold',
        default: 'px-5 py-2.5 text-sm font-semibold',
        lg: 'px-7 py-3.5 text-base font-semibold',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
);

export interface GlassButtonProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof glassButtonVariants>,
    VariantProps<typeof glassButtonTextVariants> {
  /** When set, renders an <a href> instead of a <button>. */
  href?: string;
  /** Only used when rendering as a <button>. */
  type?: 'button' | 'submit' | 'reset';
  contentClassName?: string;
}

function GlassButton({
  className,
  children,
  variant,
  size,
  href,
  type,
  contentClassName,
  ...props
}: GlassButtonProps) {
  const glassClass = cn(glassButtonVariants({ variant }));
  const inner = (
    <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>{children}</span>
  );

  return (
    <div className={cn('glass-button-wrap', className)}>
      {href !== undefined ? (
        <a href={href} className={glassClass} {...props}>
          {inner}
        </a>
      ) : (
        <button type={type ?? 'button'} className={glassClass} {...props}>
          {inner}
        </button>
      )}
      <div className="glass-button-shadow" />
    </div>
  );
}

export { GlassButton, glassButtonVariants };
