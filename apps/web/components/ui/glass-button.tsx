import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Liquid-glass button: frosted, translucent, with a soft top highlight and a
// blurred drop shadow beneath. The `.glass-button*` classes live in
// globals.css (this component only wires structure + variants).
const glassButtonVariants = cva(
  'relative isolate cursor-pointer rounded-full transition-all',
  {
    variants: {
      variant: {
        primary: 'glass-button-primary',
        secondary: 'glass-button-secondary',
      },
      size: {
        default: 'text-base font-medium',
        sm: 'text-sm font-medium',
        lg: 'text-lg font-medium',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

const glassButtonTextVariants = cva(
  'glass-button-text relative block select-none tracking-tight',
  {
    variants: {
      size: {
        default: 'px-6 py-3.5',
        sm: 'px-4 py-2',
        lg: 'px-8 py-4',
        icon: 'flex h-10 w-10 items-center justify-center',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, variant, size, contentClassName, ...props }, ref) => {
    return (
      <div className={cn('glass-button-wrap cursor-pointer rounded-full', className)}>
        <button
          className={cn('glass-button', glassButtonVariants({ variant, size }))}
          ref={ref}
          {...props}
        >
          <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>
            {children}
          </span>
        </button>
        <div className="glass-button-shadow rounded-full" />
      </div>
    );
  },
);
GlassButton.displayName = 'GlassButton';

export { GlassButton, glassButtonVariants };
