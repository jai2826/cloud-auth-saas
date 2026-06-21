// packages/auth/src/worker.ts
//
// A lightweight betterAuth() instance for use inside the FGA Worker
// (apps/api). Only configures what the Worker actually needs — verifying
// API keys issued by the main app — not the full sign-up/sign-in surface
// that packages/auth/src/server.ts provides for the Next.js dashboard.
//
// Must be created fresh per-request (not module-level) using the
// Hyperdrive connection string from c.env.FGA_DB — Workers don't support
// raw TCP, so this can NOT point at a direct DATABASE_URL like server.ts
// does. Hyperdrive is what makes the underlying TCP connection possible.
//
// See: https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/node-postgres/

import { apiKey } from "@better-auth/api-key"
import { betterAuth } from "better-auth"
import { organization } from "better-auth/plugins"
import { Pool } from "pg"

export type WorkerAuthEnv = {
  BETTER_AUTH_SECRET: string
  // The Hyperdrive-proxied connection string — NOT a raw DATABASE_URL.
  // In Hono this comes from c.env.FGA_DB.connectionString.
  HYPERDRIVE_CONNECTION_STRING: string
  WEB_URL?: string
}

/**
 * Creates a betterAuth() instance scoped to the Worker's needs.
 *
 * Call this once per request (e.g. in middleware) and reuse the same
 * instance for the lifetime of that request — don't create it at module
 * scope, since the Hyperdrive connection string is only available once
 * the request's env bindings are accessible.
 */
export function createWorkerAuth(env: WorkerAuthEnv) {
  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseUrl: env.WEB_URL || "http://localhost:3000",
    trustedOrigins: [
      "http://localhost:3000",
      env.WEB_URL || ""
    ],
    database: new Pool({
      connectionString: env.HYPERDRIVE_CONNECTION_STRING,
      // Workers limit concurrent external connections — keep this low.
      max: 5
    }),
    // No emailAndPassword, no social providers — this Worker never
    // handles sign-up/sign-in, only API key verification.
    plugins: [
      // organization plugin must be present so apiKey's
      // references: "organization" config resolves correctly against
      // the same schema the Next.js app writes to.
      organization({
        allowUserToCreateOrganization: true
      }),
      apiKey({ configId: "organization", references: "organization" })
    ]
  })
}

export type WorkerAuth = ReturnType<typeof createWorkerAuth>