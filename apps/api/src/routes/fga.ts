// apps/api/src/routes/fga.ts
import { Hono } from "hono"
import type { Pool } from "pg"
import {
  batchCheck,
  check,
  grant,
  revoke,
  type CheckRequest,
  type GrantRequest,
  type RevokeRequest
} from "../lib/fga-engine"

const fgaRouter = new Hono<{
  Bindings: { FGA_DB: { connectionString: string } }
  Variables: { pool: Pool; organizationId: string; apiKeyId: string }
}>()

function isValidCheckRequest(body: unknown): body is CheckRequest {
  if (!body || typeof body !== "object") return false
  const b = body as Record<string, unknown>
  return (
    typeof b.objectType === "string" &&
    typeof b.objectId === "string" &&
    typeof b.relation === "string" &&
    typeof b.subjectType === "string" &&
    typeof b.subjectId === "string"
  )
}

fgaRouter.post("/check", async (c) => {
  const pool = c.get("pool")
  const organizationId = c.get("organizationId")
  const body = await c.req.json().catch(() => null)

  if (!isValidCheckRequest(body)) {
    return c.json({ error: "Invalid request body" }, 400)
  }

  const result = await check(pool, organizationId, body)
  return c.json(result)
})

fgaRouter.post("/batch-check", async (c) => {
  const pool = c.get("pool")
  const organizationId = c.get("organizationId")
  const body = await c.req.json().catch(() => null)

  if (!body || typeof body !== "object" || !Array.isArray((body as any).checks)) {
    return c.json({ error: "Invalid request body — expected { checks: [...] }" }, 400)
  }

  const checks = (body as { checks: unknown[] }).checks

  if (!checks.every(isValidCheckRequest)) {
    return c.json({ error: "One or more checks are invalid" }, 400)
  }

  const results = await batchCheck(pool, organizationId, checks as CheckRequest[])
  return c.json({ results })
})

function isValidGrantRequest(body: unknown): body is GrantRequest {
  return isValidCheckRequest(body)
}

fgaRouter.post("/grant", async (c) => {
  const pool = c.get("pool")
  const organizationId = c.get("organizationId")
  const body = await c.req.json().catch(() => null)

  if (!isValidGrantRequest(body)) {
    return c.json({ error: "Invalid request body" }, 400)
  }

  await grant(pool, organizationId, body)
  return c.json({ success: true }, 201)
})

fgaRouter.post("/revoke", async (c) => {
  const pool = c.get("pool")
  const organizationId = c.get("organizationId")
  const body = await c.req.json().catch(() => null)

  if (!isValidGrantRequest(body as RevokeRequest)) {
    return c.json({ error: "Invalid request body" }, 400)
  }

  await revoke(pool, organizationId, body as RevokeRequest)
  return c.json({ success: true })
})

export default fgaRouter