// Simple in-memory rate limiter. State is per-process and resets on container
// restart/deploy — adequate for slowing brute force, not a hard cross-restart
// guarantee. Replace with Redis/Upstash (or a DB-backed limiter) when scaling.
const attempts = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 10;

// Extract a single client IP from an X-Forwarded-For header. XFF can be a
// comma-separated list ("client, proxy1, ..."); the left-most entry is the
// originating client (Caddy sets this for us). Falls back to a shared 'unknown'
// bucket when the header is absent, so requests are still bounded.
export function clientIpFromXff(xff: string | null | undefined): string {
  const first = xff?.split(',')[0]?.trim();
  return first && first.length > 0 ? first : 'unknown';
}

export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();

  // Opportunistically evict expired entries so the map can't grow unbounded
  // under many distinct IPs. Cheap: only sweeps once the map gets sizeable.
  if (attempts.size > 500) {
    for (const [k, v] of attempts) {
      if (now > v.resetAt) attempts.delete(k);
    }
  }

  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count };
}
