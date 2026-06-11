import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Lazily validated at runtime — throwing at module load time breaks `next build`
// when DATABASE_URL is not present in the build environment (CI/Dockerfile).
const connectionString = process.env.DATABASE_URL ?? 'postgres://placeholder';

const client = postgres(connectionString, { max: 10, idle_timeout: 20 });

export const db = drizzle(client, { schema });
