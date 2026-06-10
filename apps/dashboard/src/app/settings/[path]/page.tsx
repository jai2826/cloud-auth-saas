import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ensureSession, viewPaths } from "@workspace/ui/index"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"

import { organizationPluginConfig } from "@/lib/configs/organization-plugin-config"
import { getQueryClient } from "@/lib/query-client"
import { auth } from "@workspace/auth/server"
import { Settings } from "@workspace/ui/components/auth/settings/settings"

const validSettingsPaths = [
  ...Object.values(viewPaths.settings),
  ...Object.values(
    organizationPluginConfig().viewPaths.settings
  ),
]

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ path: string }>
}) {
  const { path } = await params

  if (!validSettingsPaths.includes(path)) {
    notFound()
  }

  const queryClient = getQueryClient()

  const session = await ensureSession(queryClient, auth, {
    headers: await headers(),
  })

  if (!session) {
    redirect(
      `/auth/sign-in?redirectTo=${encodeURIComponent(`/settings/${path}`)}`
    )
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
        <Settings path={path} />
      </div>
    </HydrationBoundary>
  )
}
