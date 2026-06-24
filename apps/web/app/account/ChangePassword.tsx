'use client';

import { useState, useTransition, type CSSProperties } from 'react';
import { deriveKey, encrypt, decrypt, base64ToBuffer, bufferToBase64 } from '@/lib/crypto';
import { deriveAndStoreSyncKey, loadSyncSalt } from '@/lib/syncKey';
import { listCloudSnapshots, downloadSnapshot, getUserSyncSalt } from '@/app/api/sync/actions';
import { changePassword } from './actions';
import { T } from '@/components/landing/tokens';

export function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  function submit() {
    setError(null);
    setDone(false);

    if (next.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (next !== confirm) { setError('New passwords do not match.'); return; }

    start(async () => {
      try {
        // Re-encrypt any cloud snapshots under the new key (same salt). The key
        // is derived from the password, so changing it changes the key.
        const salt = loadSyncSalt() ?? (await getUserSyncSalt());
        const reEncrypted: { id: string; ciphertextB64: string; ivB64: string }[] = [];

        if (salt) {
          const saltBytes = base64ToBuffer(salt);
          const oldKey = await deriveKey(current, saltBytes);
          const newKey = await deriveKey(next, saltBytes);
          const metas = await listCloudSnapshots();
          for (const m of metas) {
            const payload = await downloadSnapshot(m.id);
            if (!payload) continue;
            let data: unknown;
            try {
              data = await decrypt(
                base64ToBuffer(payload.ciphertextB64).buffer as ArrayBuffer,
                base64ToBuffer(payload.ivB64),
                oldKey,
              );
            } catch {
              setError('Could not re-encrypt your cloud snapshots. Check your current password.');
              return;
            }
            const { ciphertext, iv } = await encrypt(data, newKey);
            reEncrypted.push({ id: m.id, ciphertextB64: bufferToBase64(ciphertext), ivB64: bufferToBase64(iv) });
          }
        }

        const res = await changePassword({ currentPassword: current, newPassword: next, reEncrypted });
        if (!res.ok) { setError(res.error ?? 'Could not change your password.'); return; }

        // Refresh the cached sync key so this session stays unlocked.
        if (salt) await deriveAndStoreSyncKey(next, salt);

        setDone(true);
        setCurrent(''); setNext(''); setConfirm('');
      } catch {
        setError('Something went wrong. Please try again.');
      }
    });
  }

  const input: CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 14,
    fontFamily: T.sans, color: T.ink, background: T.surface1,
    border: `1px solid ${T.border2}`, outline: 'none',
  };
  const label: CSSProperties = { fontSize: 13, fontWeight: 500, color: T.ink, marginBottom: 6, display: 'block' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 360 }}>
      <div>
        <label style={label} htmlFor="cp-current">Current password</label>
        <input id="cp-current" type="password" autoComplete="current-password" style={input}
          value={current} onChange={(e) => setCurrent(e.target.value)} />
      </div>
      <div>
        <label style={label} htmlFor="cp-new">New password</label>
        <input id="cp-new" type="password" autoComplete="new-password" minLength={8} style={input}
          value={next} onChange={(e) => setNext(e.target.value)} />
      </div>
      <div>
        <label style={label} htmlFor="cp-confirm">Confirm new password</label>
        <input id="cp-confirm" type="password" autoComplete="new-password" minLength={8} style={input}
          value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>

      {error && <p style={{ fontSize: 13, color: T.terra, margin: 0 }}>{error}</p>}
      {done && <p style={{ fontSize: 13, color: T.tealMid, margin: 0 }}>Password updated.</p>}

      <button
        type="button"
        onClick={submit}
        disabled={pending || !current || !next || !confirm}
        style={{
          alignSelf: 'flex-start', padding: '10px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600,
          color: T.cream, background: T.teal, border: '1px solid rgba(2,136,143,0.5)',
          cursor: pending ? 'default' : 'pointer', opacity: pending || !current || !next || !confirm ? 0.6 : 1,
        }}
      >
        {pending ? 'Updating...' : 'Change password'}
      </button>
    </div>
  );
}
