'use client';

import type { ReactNode } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { useStudio } from './StudioContext';

// A Studio-styled dialog (same frame as the upgrade sheet).
export function StudioDialog({ open, onClose, title, children, wide = false }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean;
}) {
  const { portal, c } = useStudio();
  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Dialog.Portal container={portal}>
        <Dialog.Backdrop className="s-scrim" />
        <Dialog.Popup className="s-sheet" style={wide ? { width: 'min(560px, calc(100vw - 32px))' } : undefined}>
          <div className="s-b">
            <div className="s-row" style={{ justifyContent: 'space-between' }}>
              <Dialog.Title style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-.02em', margin: 0 }}>{title}</Dialog.Title>
              <Dialog.Close aria-label={c.closeMenu} className="s-btn sec xs"><X size={14} /></Dialog.Close>
            </div>
            {children}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
