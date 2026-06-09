"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { ArrowRight, RefreshCw } from "lucide-react"
import { useState } from "react"

interface MarketingPageProps {
  onNavigate?: (page: "auth" | "dashboard") => void
  onSignIn?: () => void
  onOpenConsole?: () => void
}

export default function MarketingPage({
  onSignIn,
  onOpenConsole,
  onNavigate,
}: MarketingPageProps) {
  const [promoUserId, setPromoUserId] = useState("dev_sarah")
  const [promoResource, setPromoResource] = useState("deployments/production")
  const [promoAction, setPromoAction] = useState("create")
  const [promoStatus, setPromoStatus] = useState("idle")
  const [promoTrace, setPromoTrace] = useState<string[]>([])

  const handleQuickTest = () => {
    setPromoStatus("testing")
    setPromoTrace(["[System] Initializing edge query..."])

    window.setTimeout(() => {
      if (promoUserId.startsWith("dev") && promoAction === "create") {
        setPromoStatus("allowed")
        setPromoTrace([
          '[Resolved] Identity verified as "developer"',
          "Match found: [pol_2] (Resource: deployments/*, Action: create)",
          "Access granted in 12ms via simulated edge node.",
        ])
      } else {
        setPromoStatus("denied")
        setPromoTrace([
          `[Resolved] Subject: "${promoUserId}"`,
          `No matching policy for resource "${promoResource}"`,
          "Access denied in 4ms after fast cache evaluation.",
        ])
      }
    }, 850)
  }

  return (
    <main className="min-h-screen w-full max-w-7xl!">
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4">v1.0.0 launch preview</Badge>
          <h1 className="mx-auto mb-6 max-w-4xl font-sans text-4xl leading-[1.1] font-bold tracking-tight text-white sm:text-6xl">
            Fine-Grained Authorization.
            <br />
            <span className="to-emerald-305 bg-linear-to-r from-indigo-300 via-sky-200 bg-clip-text text-transparent">
              Resolved at Global Edge Speed.
            </span>
          </h1>
          <p className="mt-4 text-sm text-zinc-400">
            Define policies, test conditional access, and review decision traces
            in a polished shadcn-powered Next.js 16 experience.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <button
              id="btn_hero_explore"
              onClick={() => onNavigate?.("dashboard")}
              className="w-full cursor-pointer rounded border border-indigo-400/20 bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-500 sm:w-auto"
            >
              Open Free Console
            </button>
            <a
              href="#live-playground"
              className="w-full cursor-pointer rounded border border-zinc-800 bg-zinc-900 px-8 py-3 text-center text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800 sm:w-auto"
            >
              Try Instant Simulator
            </a>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <Card>
            <CardHeader>
              <CardTitle>Live access playground</CardTitle>
              <CardDescription>
                Try a quick authorization check before opening the console.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label>Subject</Label>
                  <Select
                    value={promoUserId}
                    onValueChange={(v: any) => setPromoUserId(v ?? "dev_sarah")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dev_sarah">dev_sarah</SelectItem>
                      <SelectItem value="user_charlie">user_charlie</SelectItem>
                      <SelectItem value="admin_alex">admin_alex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Resource path</Label>
                  <Input
                    value={promoResource}
                    onChange={(e: any) => setPromoResource(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Action</Label>
                  <div className="flex gap-2">
                    {["create", "read", "update", "delete"].map((a) => (
                      <Button
                        key={a}
                        variant={promoAction === a ? "default" : "outline"}
                        onClick={() => setPromoAction(a)}
                      >
                        {a}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full bg-sky-500 text-slate-950"
                  onClick={handleQuickTest}
                  disabled={promoStatus === "testing"}
                >
                  {promoStatus === "testing" ? (
                    <>
                      <RefreshCw className="mr-2 animate-spin" />
                      Querying...
                    </>
                  ) : (
                    <>
                      Execute access check <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              <div>
                <div className="mb-2 text-xs text-zinc-500 uppercase">
                  Edge resolution trace
                </div>
                <div className="space-y-2">
                  {promoTrace.length === 0 ? (
                    <div className="text-sm text-zinc-500">
                      Run a check to see the trace.
                    </div>
                  ) : (
                    promoTrace.map((line) => (
                      <div
                        key={line}
                        className="rounded bg-white/5 p-2 text-sm"
                      >
                        {line}
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-xs text-zinc-500">Resolver decision</div>
                  <div>
                    {promoStatus === "idle" && <Badge>Awaiting</Badge>}
                    {promoStatus === "testing" && <Badge>Evaluating</Badge>}
                    {promoStatus === "allowed" && <Badge>Granted</Badge>}
                    {promoStatus === "denied" && <Badge>Denied</Badge>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
