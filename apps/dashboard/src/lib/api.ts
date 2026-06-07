import { APIConfig, Policy,  SimulationResult } from "./types"

const DEFAULT_POLICIES: Policy[] = [
  {
    id: "pol_1",
    role: "admin",
    resource: "billing/*",
    action: "write",
    conditions: { max_clearance_level: 5, mfa_required: true },
    description:
      "Allow administrative roles with level 5 clearance to change billing settings with MFA verified.",
    created_at: new Date(Date.now() - 36000000).toISOString(),
  },
  {
    id: "pol_2",
    role: "developer",
    resource: "deployments/*",
    action: "create",
    conditions: { max_clearance_level: 3 },
    description:
      "Allow system developers to trigger branch deployments if clearance is 3 or higher.",
    created_at: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: "pol_3",
    role: "user",
    resource: "reports/internal",
    action: "read",
    conditions: { max_clearance_level: 1, department: "engineering" },
    description:
      "Allow general users in the engineering department to read internal dashboard reports.",
    created_at: new Date().toISOString(),
  },
]

function getStoredPolicies(): Policy[] {
  const data = localStorage.getItem("fga_console_policies")
  if (!data) {
    localStorage.setItem(
      "fga_console_policies",
      JSON.stringify(DEFAULT_POLICIES)
    )
    return DEFAULT_POLICIES
  }
  try {
    return JSON.parse(data)
  } catch (e) {
    return DEFAULT_POLICIES
  }
}

interface CacheEntry {
  inputKey: string
  result: SimulationResult
  expiresAt: number
}

const simulationCache = new Map<string, CacheEntry>()

export function clearEdgeCache(): void {
  simulationCache.clear()
}

// apps/web/app/lib/api.ts

// 1. Fetch All Policies
export async function fetchPolicies(config: APIConfig): Promise<Policy[]> {
  const response = await fetch(`${config.workerUrl}/api/fga/policies`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // CRITICAL: Forces the browser to attach the Better-Auth HttpOnly cookie
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch policies: ${response.statusText}`)
  }

  return response.json()
}

// 2. Save a New Policy
export async function savePolicy(
  policyData: Omit<Policy, "id" | "tenantId">,
  config: APIConfig
): Promise<Policy> {
  const response = await fetch(`${config.workerUrl}/api/fga/policies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(policyData),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `Failed to save policy: ${response.statusText}`
    )
  }

  const data = await response.json()
  return data.policy
}

// 3. Delete a Policy
export async function deletePolicy(
  id: string,
  config: APIConfig
): Promise<void> {
  const response = await fetch(`${config.workerUrl}/api/fga/policies/${id}`, {
    method: "DELETE",
    credentials: "include",
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `Failed to delete policy: ${response.statusText}`
    )
  }
}

// 4. Run the Authorization Simulator
export async function simulateCheck(
  params: {
    tenantId: string
    userId: string
    resource: string
    action: string
    context: string
  },
  config: APIConfig
) {
  const response = await fetch(`${config.workerUrl}/api/fga/simulate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || "Simulation engine failed")
  }

  return response.json()
}
