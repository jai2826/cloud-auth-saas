// apps/api/src/services/fga.ts
import { Pool } from "pg";

export async function evaluateAccess(
  pool: Pool,
  tenantId: string,
  action: string,
  resource: string,
  context: Record<string, any> = {}
): Promise<boolean> {
  const client = await pool.connect();
  try {
    // Look for exact resource match OR wildcard match
    const resourceBase = resource.split(':')[0] + ':*';
    
    const query = `
      SELECT conditions FROM fga_policies 
      WHERE tenant_id = $1 
      AND action = $2 
      AND (resource = $3 OR resource = $4)
    `;
    const res = await client.query(query, [tenantId, action, resource, resourceBase]);

    for (const row of res.rows) {
      const conditions = row.conditions || {};
      if (Object.keys(conditions).length === 0) return true; // No constraints = Allow

      // Logic check
      const met = Object.entries(conditions).every(([key, val]) => context[key] === val);
      if (met) return true;
    }
    return false;
  } finally {
    client.release();
  }
}