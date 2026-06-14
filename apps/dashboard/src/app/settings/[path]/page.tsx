import { viewPaths } from "@workspace/ui/index"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"

import { organizationPluginConfig } from "@/lib/configs/organization-plugin-config"
import { auth, type Session } from "@workspace/auth/server"
import { Settings } from "@workspace/ui/components/auth/settings/settings"

const validSettingsPaths = [
  ...Object.values(viewPaths.settings),
  ...Object.values(organizationPluginConfig().viewPaths?.settings ?? {}),
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

  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session | null

  if (!session) {
    redirect(
      `/auth/sign-in?redirectTo=${encodeURIComponent(`/settings/${path}`)}`
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
      <Settings path={path} />
    </div>
  )
}