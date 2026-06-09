import { viewPaths } from "@workspace/ui/index"
import { ensureSession } from "@workspace/ui/index"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"

import { Settings } from "@workspace/ui/components/auth/settings/settings"

import { getQueryClient } from "@/lib/query-client"
import { auth } from "@workspace/auth/server"

export default async function SettingsPage({
  params
}: {
  params: Promise<{
    path: string
  }>
}) {
  const { path } = await params

  if (!Object.values(viewPaths.settings).includes(path)) {
    notFound()
  }

  const requestHeaders = await headers()
  const queryClient = getQueryClient()

  const session = await ensureSession(queryClient, auth, {
    headers: requestHeaders
  })

  if (!session) {
    redirect(
      `/auth/sign-in?redirectTo=${encodeURIComponent(`/settings/${path}`)}`
    )
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
        <Settings path={path} />
      </div>
    </HydrationBoundary>
  )
}