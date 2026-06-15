'use server';

import { db } from '@/lib/db/index';
import { cloudSnapshots, syncSettings } from '@/lib/db/schema';
import { validateRequest } from '@/lib/auth/session';
import { isProUser } from '@/lib/flags';
import { and, eq } from 'drizzle-orm';

export interface CloudSnapshotMeta {
  id: string;
  label: string;
  exportedAt: number;
  createdAt: Date;
}

export async function uploadSnapshot(payload: {
  label: string;
  exportedAt: number;
  ciphertextB64: string;
  ivB64: string;
  saltB64: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const { user } = await validateRequest();
  if (!user) return { ok: false, error: 'Not authenticated.' };

  const pro = await isProUser();
  if (!pro) return { ok: false, error: 'Pro plan required.' };

  const ciphertext = Buffer.from(payload.ciphertextB64, 'base64');
  const iv = Buffer.from(payload.ivB64, 'base64');
  const salt = Buffer.from(payload.saltB64, 'base64');

  // Ensure sync_settings salt is saved
  await db
    .insert(syncSettings)
    .values({ userId: user.id, passphraseSalt: payload.saltB64 })
    .onConflictDoNothing();

  const [row] = await db
    .insert(cloudSnapshots)
    .values({
      userId: user.id,
      label: payload.label,
      exportedAt: new Date(payload.exportedAt),
      encryptedBlob: ciphertext,
      iv,
      salt,
    })
    .returning({ id: cloudSnapshots.id });

  if (!row) return { ok: false, error: 'Failed to save snapshot.' };

  return { ok: true, id: row.id };
}

export async function listCloudSnapshots(): Promise<CloudSnapshotMeta[]> {
  const { user } = await validateRequest();
  if (!user) return [];

  const rows = await db.query.cloudSnapshots.findMany({
    where: eq(cloudSnapshots.userId, user.id),
    columns: { id: true, label: true, exportedAt: true, createdAt: true },
    orderBy: (t, { desc }) => [desc(t.exportedAt)],
  });

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    exportedAt: r.exportedAt.getTime(),
    createdAt: r.createdAt,
  }));
}

export async function downloadSnapshot(id: string): Promise<{
  ciphertextB64: string;
  ivB64: string;
  saltB64: string;
} | null> {
  const { user } = await validateRequest();
  if (!user) return null;

  const row = await db.query.cloudSnapshots.findFirst({
    where: (t, { and, eq: e }) => and(e(t.id, id), e(t.userId, user.id)),
  });

  if (!row) return null;

  return {
    ciphertextB64: Buffer.from(row.encryptedBlob).toString('base64'),
    ivB64: Buffer.from(row.iv).toString('base64'),
    saltB64: Buffer.from(row.salt).toString('base64'),
  };
}

export async function deleteCloudSnapshot(
  id: string,
): Promise<{ ok: boolean }> {
  const { user } = await validateRequest();
  if (!user) return { ok: false };

  await db
    .delete(cloudSnapshots)
    .where(
      and(eq(cloudSnapshots.id, id), eq(cloudSnapshots.userId, user.id)),
    );

  return { ok: true };
}

export async function getUserSyncSalt(): Promise<string | null> {
  const { user } = await validateRequest();
  if (!user) return null;

  const row = await db.query.syncSettings.findFirst({
    where: eq(syncSettings.userId, user.id),
  });

  return row?.passphraseSalt ?? null;
}
