'use client';

import { LogOut } from 'lucide-react';
import { clearSyncKey } from '@/lib/syncKey';

// Posts to /logout like the site header menu, and drops the cached sync key first.
export function SignOutButton({ label }: { label: string }) {
  return (
    <form action="/logout" method="POST" onSubmit={() => clearSyncKey()}>
      <button type="submit" className="s-btn ghost"><LogOut size={14} />{label}</button>
    </form>
  );
}
