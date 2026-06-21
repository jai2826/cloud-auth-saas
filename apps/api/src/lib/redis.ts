// apps/api/lib/redis.ts
//
// Upstash Redis client + API key validation cache.
//
// Upstash is used (not a raw TCP redis client) because Cloudflare Workers
// don't support raw TCP connections — Upstash's REST-based client works
// over fetch(), which Workers support natively.

import { Redis } from "@upstash/redis"

export type CachedApiKey = {
  organizationId: string
  apiKeyId: string
}

const CACHE_PREFIX = "apikey:"

// Cache validated keys for 5 minutes. Short enough that a revoked key
// doesn't stay usable for long, long enough to meaningfully cut DB load
// for high-frequency SDK callers.
const CACHE_TTL_SECONDS = 5 * 60

function getRedis(env: { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string }) {
  return new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN
  })
}

/**
 * Hash the raw API key before using it as a cache key. We never want the
 * plaintext key sitting in Redis — same reasoning as why better-auth
 * stores a hash, not the raw key, in Postgres.
 */
async function hashKey(rawKey: string): Promise<string> {
  const data = new TextEncoder().encode(rawKey)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * Look up a previously-validated API key in Redis.
 * Returns null on cache miss — caller should fall back to validateApiKey()
 * (the Postgres path) and then call cacheApiKey() to populate this.
 */
export async function getCachedApiKey(
  env: { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string },
  rawKey: string
): Promise<CachedApiKey | null> {
  const redis = getRedis(env)
  const hashed = await hashKey(rawKey)

  const cached = await redis.get<CachedApiKey>(`${CACHE_PREFIX}${hashed}`)
  return cached ?? null
}

/**
 * Store a validated API key in Redis after a successful DB lookup.
 */
export async function cacheApiKey(
  env: { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string },
  rawKey: string,
  value: CachedApiKey
): Promise<void> {
  const redis = getRedis(env)
  const hashed = await hashKey(rawKey)

  await redis.set(`${CACHE_PREFIX}${hashed}`, value, {
    ex: CACHE_TTL_SECONDS
  })
}

/**
 * Remove a key from the cache immediately. MUST be called whenever an
 * API key is revoked in the dashboard — otherwise a revoked key keeps
 * working until the TTL naturally expires (up to 5 minutes), which is
 * a real security gap for an auth product.
 */
export async function invalidateApiKey(
  env: { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string },
  rawKey: string
): Promise<void> {
  const redis = getRedis(env)
  const hashed = await hashKey(rawKey)

  await redis.del(`${CACHE_PREFIX}${hashed}`)
}