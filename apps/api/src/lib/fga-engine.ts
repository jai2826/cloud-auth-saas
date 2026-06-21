// apps/api/lib/fga-engine.ts
//
// Core ReBAC check logic. v1 keeps inheritance fixed in code rather than
// configurable per-project: owner > editor > viewer, meaning a tuple
// granting a higher relation automatically satisfies checks for any
// relation below it in the same chain.

import type { Pool } from "pg"

const RELATION_HIERARCHY = ["owner", "editor", "viewer"] as const
export type Relation = (typeof RELATION_HIERARCHY)[number]

function satisfyingRelations(relation: string): string[] {
  const index = RELATION_HIERARCHY.indexOf(relation as Relation)
  if (index === -1) {
    return [relation]
  }
  return RELATION_HIERARCHY.slice(0, index + 1)
}

export type CheckRequest = {
  objectType: string
  objectId: string
  relation: string
  subjectType: string
  subjectId: string
}

export type CheckResult = {
  allowed: boolean
}

export async function check(
  pool: Pool,
  organizationId: string,
  request: CheckRequest
): Promise<CheckResult> {
  const relations = satisfyingRelations(request.relation)

  const { rows } = await pool.query(
    `
      SELECT 1
      FROM fga_relation_tuples
      WHERE organization_id = $1
        AND object_type = $2
        AND object_id = $3
        AND subject_type = $4
        AND subject_id = $5
        AND relation = ANY($6)
      LIMIT 1
    `,
    [
      organizationId,
      request.objectType,
      request.objectId,
      request.subjectType,
      request.subjectId,
      relations
    ]
  )

  return { allowed: rows.length > 0 }
}

export async function batchCheck(
  pool: Pool,
  organizationId: string,
  requests: CheckRequest[]
): Promise<CheckResult[]> {
  return Promise.all(
    requests.map((request) => check(pool, organizationId, request))
  )
}

export type GrantRequest = {
  objectType: string
  objectId: string
  relation: string
  subjectType: string
  subjectId: string
}

export async function grant(
  pool: Pool,
  organizationId: string,
  request: GrantRequest
): Promise<void> {
  await pool.query(
    `
      INSERT INTO fga_relation_tuples
        (organization_id, object_type, object_id, relation, subject_type, subject_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (organization_id, object_type, object_id, relation, subject_type, subject_id)
      DO NOTHING
    `,
    [
      organizationId,
      request.objectType,
      request.objectId,
      request.relation,
      request.subjectType,
      request.subjectId
    ]
  )
}

export type RevokeRequest = GrantRequest

export async function revoke(
  pool: Pool,
  organizationId: string,
  request: RevokeRequest
): Promise<void> {
  await pool.query(
    `
      DELETE FROM fga_relation_tuples
      WHERE organization_id = $1
        AND object_type = $2
        AND object_id = $3
        AND relation = $4
        AND subject_type = $5
        AND subject_id = $6
    `,
    [
      organizationId,
      request.objectType,
      request.objectId,
      request.relation,
      request.subjectType,
      request.subjectId
    ]
  )
}