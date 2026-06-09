"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useStore } from "@nanostores/react"
import { createClient } from "@workspace/auth/client"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { toast } from "@workspace/ui/components/sonner"
import {
  Plus,
  RefreshCw,
  Sparkles,
  Trash2
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  deletePolicy,
  fetchPolicies,
  savePolicy,
  simulateCheck,
} from "../../../lib/api"
import type { APIConfig, Policy, SimulationResult } from "../../../lib/types"

export const authClient = createClient(process.env.NEXT_PUBLIC_APP_URL!)

type Tab = "policies" | "simulator"

const policySchema = z.object({
  role: z.string().min(1, "Role is required"),
  resource: z.string().min(1, "Resource is required"),
  action: z.string().min(1, "Action is required"),
  description: z.string().optional(),
  conditionKey: z.string().optional(),
  conditionValue: z.string().optional(),
})

type PolicyFormValues = z.infer<typeof policySchema>

const defaultConfig: APIConfig = {
  workerUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787",
  authToken: "",
  cacheEnabled: true,
  cacheTtl: 30,
  simulateLatency: true,
}

export default function DashboardPage() {
  const { data: session } = useStore(authClient.useSession)
  const [tab, setTab] = useState<Tab>("policies")
  const [apiConfig] = useState<APIConfig>(defaultConfig)
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [createOpen, setCreateOpen] = useState(false)
  const [simTenant, setSimTenant] = useState("tenant_purejoy_99")
  const [simUserId, setSimUserId] = useState("dev_sarah")
  const [simResource, setSimResource] = useState("deployments/production")
  const [simAction, setSimAction] = useState("create")
  const [simContextJson, setSimContextJson] = useState(
    '{\n  "max_clearance_level": 3,\n  "mfa_required": true\n}'
  )
  const [evaluating, setEvaluating] = useState(false)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [trace, setTrace] = useState<string[]>([])

  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      role: "developer",
      resource: "deployments/*",
      action: "create",
      conditionKey: "max_clearance_level",
      conditionValue: "3",
    },
  })

  const reloadPolicies = async () => {
    setLoading(true)
    try {
      setPolicies(await fetchPolicies(apiConfig))
      toast(
        <div className="flex gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Policies loaded</span>
        </div>
      )
    } catch {
      toast(
        <div className="flex gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Could not load policies</span>
        </div>
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reloadPolicies()
  }, [apiConfig])

  const filteredPolicies = useMemo(() => {
    return policies.filter((policy) => {
      const roleMatches =
        roleFilter === "all" || policy.role.toLowerCase() === roleFilter
      const needle = query.toLowerCase()
      return (
        roleMatches &&
        (policy.role.toLowerCase().includes(needle) ||
          policy.resource.toLowerCase().includes(needle))
      )
    })
  }, [policies, roleFilter, query])

  const handleCreatePolicy = async (values: PolicyFormValues) => {
    try {
      const conditions: Record<string, string | number> = {}
      if (values.conditionKey && values.conditionValue) {
        conditions[values.conditionKey] = Number.isNaN(
          Number(values.conditionValue)
        )
          ? values.conditionValue
          : Number(values.conditionValue)
      }
      await savePolicy({ ...values, conditions }, apiConfig)
      setCreateOpen(false)
      form.reset()
      toast("Policy saved")
      await reloadPolicies()
    } catch {
      toast("Failed to save policy")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this policy?")) return
    await deletePolicy(id, apiConfig)
    toast("Policy deleted")
    await reloadPolicies()
  }

  const handleSimulate = async () => {
    setEvaluating(true)
    setResult(null)
    setTrace(["Initiating simulator node..."])
    try {
      const output = await simulateCheck(
        {
          tenantId: simTenant,
          userId: simUserId,
          resource: simResource,
          action: simAction,
          context: simContextJson,
        },
        apiConfig
      )
      setResult(output.result)
      setTrace(output.trace)
    } catch (error: any) {
      setTrace((current) => [
        ...current,
        `❌ ${error.message || "Unknown error"}`,
      ])
      toast("Simulation failed")
    } finally {
      setEvaluating(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full max-w-8xl bg-background text-foreground">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between border-b border-border pb-5">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Authorization Workspace
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage policies and test access decisions.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={reloadPolicies}
              disabled={loading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />{" "}
              Sync
            </Button>
            {tab === "policies" && (
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create
              </Button>
            )}
          </div>
        </div>

        {/* --- Content Area --- */}
        {tab === "policies" ? (
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 text-left">Role</th>
                    <th className="px-6 py-3 text-left">Resource</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPolicies.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4">{p.role}</td>
                      <td className="px-6 py-4">{p.resource}</td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Simulator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={simTenant}
                  onChange={(e) => setSimTenant(e.target.value)}
                />
                <Button onClick={handleSimulate} className="w-full">
                  Evaluate
                </Button>
              </CardContent>
            </Card>
            {/* Trace/Results content here... */}
          </div>
        )}
      </main>
    </div>
  )
}
