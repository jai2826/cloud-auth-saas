// apps/api/src/middleware/api-key-auth.ts
//
// Authenticates every FGA route. Extracts the API key from the
// x-api-key header (better-auth's default header name for the apiKey
// plugin), resolves it (Redis-cached, in-Worker betterAuth() fallback),
// and attaches the resolved organizationId to context for downstream
// route handlers to use.

import { createMiddleware } from "hono/factory"
import { createWorkerAuth } from "@workspace/auth/worker"
import { resolveApiKey } from "../lib/resolve-api-key"
import { ApiKeyValidationError } from "../lib/validate-api-key"

export const apiKeyAuth = createMiddleware(async (c, next) => {
  // better-auth's apiKey plugin defaults to the x-api-key header
  // (not Authorization: Bearer) unless customAPIKeyGetter is configured.
  const rawKey = c.req.header("x-api-key")

  // Built fresh per-request — the Hyperdrive connection string is only
  // available once env bindings are accessible at request time.
  const auth = createWorkerAuth({
    BETTER_AUTH_SECRET: c.env.BETTER_AUTH_SECRET,
    HYPERDRIVE_CONNECTION_STRING: c.env.FGA_DB.connectionString,
    WEB_URL: c.env.WEB_URL
  })

  try {
    const { organizationId, apiKeyId } = await resolveApiKey(
      auth,
      c.env,
      rawKey
    )

    c.set("organizationId", organizationId)
    c.set("apiKeyId", apiKeyId)
  } catch (error) {
    if (error instanceof ApiKeyValidationError) {
      // Don't leak which specific reason (missing/invalid/wrong_owner)
      // to the client — all map to a generic 401.
      return c.json({ error: "Unauthorized" }, 401)
    }
    throw error
  }

  await next()
})