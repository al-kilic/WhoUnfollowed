'use client';

import { useState } from 'react';
import { deleteAccountAction } from './actions';

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await deleteAccountAction();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-sm text-destructive font-medium">Are you sure?</p>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-sm bg-destructive text-destructive-foreground rounded-md px-3 py-1.5 hover:bg-destructive/90 disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Yes, delete everything'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm text-destructive hover:text-destructive/80 font-medium w-fit"
    >
      Delete account and all data
    </button>
  );
}
