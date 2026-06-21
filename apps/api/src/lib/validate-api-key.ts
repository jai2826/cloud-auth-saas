// apps/api/lib/validate-api-key.ts
//
// Validates an SDK-supplied API key using a real betterAuth() instance
// running inside the Worker itself (via Hyperdrive), instead of calling
// out to the Next.js app. This removes the cross-service hop and its
// failure mode — the Worker is now self-sufficient for key verification.

import type { WorkerAuth } from "@workspace/auth/worker"

export type ValidatedApiKey = {
  organizationId: string
  apiKeyId: string
}

export class ApiKeyValidationError extends Error {
  constructor(public reason: "missing" | "invalid" | "wrong_owner") {
    super(`API key validation failed: ${reason}`)
  }
}

export async function validateApiKey(
  auth: WorkerAuth,
  rawKey: string | undefined
): Promise<ValidatedApiKey> {
  if (!rawKey) {
    throw new ApiKeyValidationError("missing")
  }

  const result = await auth.api.verifyApiKey({
    body: { key: rawKey, configId: "organization" },
  })
  console.log("verifyApiKey result:", JSON.stringify(result, null, 2))

  if (!result.valid || !result.key) {
    throw new ApiKeyValidationError("invalid")
  }

  if (result.key.configId !== "organization" || !result.key.referenceId) {
    throw new ApiKeyValidationError("wrong_owner")
  }

  return {
    organizationId: result.key.referenceId,
    apiKeyId: result.key.id,
  }
}
