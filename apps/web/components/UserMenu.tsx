import Link from 'next/link';
import { validateRequest } from '@/lib/auth/session';

export async function UserMenu() {
  const { user } = await validateRequest();

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="text-sm bg-primary text-primary-foreground rounded-md px-3 py-1.5 hover:bg-primary/90 transition-colors"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground hidden sm:block">
        {user.email}
      </span>
      <form action="/logout" method="POST">
        <button
          type="submit"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
