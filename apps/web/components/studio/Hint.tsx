'use client';

import { useRef, useState, type ReactElement } from 'react';
import { Tooltip } from '@base-ui/react/tooltip';
import { useStudio } from './StudioContext';

// A short description that appears next to a control: after a hover pause
// (~600ms), at once on keyboard focus, and on a long press on touch screens
// (the press then does not also follow the link). One look everywhere.
export function Hint({ text, children, side = 'bottom' }: { text: string; children: ReactElement; side?: 'top' | 'bottom' | 'left' | 'right' }) {
  const { portal } = useStudio();
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const longPress = useRef(false);
  const clear = () => { if (timer.current) window.clearTimeout(timer.current); timer.current = undefined; };
  return (
    <Tooltip.Root open={open} onOpenChange={setOpen}>
      <Tooltip.Trigger
        render={children}
        delay={600}
        closeDelay={60}
        onFocus={(e) => { if (e.currentTarget.matches(':focus-visible')) setOpen(true); }}
        onBlur={() => setOpen(false)}
        onPointerDown={(e) => {
          if (e.pointerType !== 'touch') return;
          clear();
          timer.current = window.setTimeout(() => { longPress.current = true; setOpen(true); }, 450);
        }}
        onPointerUp={clear}
        onPointerCancel={clear}
        onContextMenu={(e) => { if (longPress.current) e.preventDefault(); }}
        onClickCapture={(e) => {
          if (!longPress.current) return;
          longPress.current = false;
          e.preventDefault();
          e.stopPropagation();
        }}
      />
      <Tooltip.Portal container={portal}>
        <Tooltip.Positioner side={side} sideOffset={8} collisionPadding={10} className="s-hint-pos">
          <Tooltip.Popup className="s-hint" data-testid="hint">{text}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
