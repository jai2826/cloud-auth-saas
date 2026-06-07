import { Hono } from "hono"
import { Pool } from "pg"

const fgaRouter = new Hono<{
  Bindings: { FGA_DB: { connectionString: string } }
  Variables: { pool: Pool }
}>()

// POST: Create a new policy
fgaRouter.post("/save_policies", async (c) => {
  const pool = c.get("pool")
  const { tenant_id, role, resource, action, conditions } = await c.req.json()

  const query = `
    INSERT INTO fga_policies (tenant_id, role, resource, action, conditions)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `

  const result = await pool.query(query, [
    tenant_id,
    role,
    resource,
    action,
    JSON.stringify(conditions),
  ])
  return c.json({ id: result.rows[0].id }, 201)
})

// GET: Retrieve policies (supports optional filtering)
fgaRouter.get("/policies", async (c) => {
  const pool = c.get("pool")
  const tenantId = c.req.query("tenant_id")

  const query = tenantId
    ? "SELECT * FROM fga_policies WHERE tenant_id = $1"
    : "SELECT * FROM fga_policies"

  const params = tenantId ? [tenantId] : []
  const result = await pool.query(query, params)

  return c.json(result.rows)
})

// DELETE: Remove a policy by ID
fgaRouter.delete("/delete_policy/:id", async (c) => {
  const pool = c.get("pool")
  const id = c.req.param("id")

  const result = await pool.query("DELETE FROM fga_policies WHERE id = $1", [
    id,
  ])

  if (result.rowCount === 0) {
    return c.json({ error: "Policy not found" }, 404)
  }

  // FIX: Return empty body for 204
  return c.body(null, 204)
})

export default fgaRouter
