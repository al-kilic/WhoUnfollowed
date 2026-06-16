import { lucia } from './lucia';
import { cookies } from 'next/headers';
import type { Session, User } from 'lucia';

export async function validateRequest(): Promise<
  { user: User; session: Session } | { user: null; session: null }
> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return { user: null, session: null };
  }

  const result = await lucia.validateSession(sessionId);

  // Next.js disallows mutating cookies while rendering a Server Component.
  // validateRequest() is called from RSC pages as well as actions/route
  // handlers, so swallow the refresh write when it isn't permitted — the
  // session is still valid and gets refreshed on the next action/route hit.
  try {
    if (result.session?.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }

    if (!result.session) {
      const blankCookie = lucia.createBlankSessionCookie();
      cookieStore.set(
        blankCookie.name,
        blankCookie.value,
        blankCookie.attributes,
      );
    }
  } catch {
    // Called during a Server Component render — cookie refresh not allowed here.
  }

  return result;
}

export async function createSession(userId: string): Promise<void> {
  const cookieStore = await cookies();
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export async function invalidateSession(sessionId: string): Promise<void> {
  const cookieStore = await cookies();
  await lucia.invalidateSession(sessionId);
  const blankCookie = lucia.createBlankSessionCookie();
  cookieStore.set(
    blankCookie.name,
    blankCookie.value,
    blankCookie.attributes,
  );
}
