import { Pool } from "pg"

// Reuse a single dedicated Postgres pool instance
export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})
