// apps/api/lib/resolve-api-key.ts
//
// The single entry point FGA routes call to authenticate an SDK request.
// Cache-first: checks Redis, falls back to the in-Worker betterAuth()
// instance on miss, then populates the cache for next time.

import type { WorkerAuth } from "@workspace/auth/worker"
import { ApiKeyValidationError, validateApiKey } from "./validate-api-key"
import { cacheApiKey, getCachedApiKey } from "./redis"

export type ResolvedApiKey = {
  organizationId: string
  apiKeyId: string
}

type RedisEnv = {
  UPSTASH_REDIS_REST_URL: string
  UPSTASH_REDIS_REST_TOKEN: string
}

/**
 * Resolve an SDK request's API key to its owning project (organization).
 *
 * Order of operations:
 *   1. Check Redis — if hit, return immediately (no DB round-trip).
 *   2. On miss, validate via the in-Worker betterAuth() instance.
 *   3. Cache the result for next time.
 *
 * Throws ApiKeyValidationError if the key is missing/invalid — callers
 * should catch this and respond 401.
 */
export async function resolveApiKey(
  auth: WorkerAuth,
  redisEnv: RedisEnv,
  rawKey: string | undefined
): Promise<ResolvedApiKey> {
  if (!rawKey) {
    throw new ApiKeyValidationError("missing")
  }

  const cached = await getCachedApiKey(redisEnv, rawKey)
  if (cached) {
    return cached
  }

  // Cache miss — fall back to the authoritative in-Worker check.
  const validated = await validateApiKey(auth, rawKey)

  // Populate the cache so the next request for this key is fast.
  await cacheApiKey(redisEnv, rawKey, validated)

  return validated
}