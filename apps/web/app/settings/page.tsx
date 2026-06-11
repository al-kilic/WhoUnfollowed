import { validateRequest } from '@/lib/auth/session';
import { db } from '@/lib/db/index';
import { profiles, syncSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { isPaidFeaturesEnabled } from '@/lib/flags';
import { DeleteAccountButton } from './DeleteAccountButton';
import { SyncSetup } from './SyncSetup';

export default async function SettingsPage() {
  const { user } = await validateRequest();
  if (!user) redirect('/login');

  const [profile, syncRow] = await Promise.all([
    db.query.profiles.findFirst({ where: eq(profiles.userId, user.id) }),
    db.query.syncSettings.findFirst({ where: eq(syncSettings.userId, user.id) }),
  ]);

  const plan = profile?.plan ?? 'free';
  const paymentsEnabled = isPaidFeaturesEnabled();
  const hasSyncSetup = !!syncRow;

  return (
    <main className="max-w-xl mx-auto px-4 py-12 flex flex-col gap-10">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Account</h2>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="text-sm font-medium">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Plan:{' '}
              <span className="capitalize font-medium">
                {paymentsEnabled ? plan : `${plan} (Free during beta)`}
              </span>
            </p>
          </div>
          {!paymentsEnabled && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
              Beta
            </span>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Cloud Sync</h2>
        <SyncSetup hasSyncSetup={hasSyncSetup} passphraseSetAt={syncRow?.passphraseSetAt ?? null} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Danger Zone</h2>
        <div className="rounded-lg border border-destructive/30 p-4 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Deleting your account removes all your data permanently, including cloud snapshots.
            This cannot be undone.
          </p>
          <DeleteAccountButton />
        </div>
      </section>
    </main>
  );
}
