import { timingSafeEqual } from 'crypto';

// Constant-time comparison for a bearer-style secret sent in a request
// header, so a network attacker who can measure response timing can't infer
// the secret character-by-character via a plain `!==` comparison. Mirrors
// the pattern already used in app/api/internal/migrate/route.ts.
export function isAuthorizedBySecretHeader(request: Request, headerName: string, envVarValue: string | undefined): boolean {
  if (!envVarValue) return false;
  const provided = request.headers.get(headerName) ?? '';
  const a = Buffer.from(provided);
  const b = Buffer.from(envVarValue);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
