import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"

import { organizationPluginConfig } from "@/lib/configs/organization-plugin-config"
import { auth, type Session } from "@workspace/auth/server"
import { Organization } from "@workspace/ui/components/auth/organization/organization"

const validOrganizationPaths = Object.values(
  organizationPluginConfig().viewPaths?.organization ?? {}
)

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; path: string }>
}) {
  const { slug, path } = await params

  if (!validOrganizationPaths.includes(path)) {
    notFound()
  }

  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session | null

  if (!session) {
    redirect(
      `/auth/sign-in?redirectTo=${encodeURIComponent(`/project/${slug}/${path}`)}`
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <Organization path={path} />
    </div>
  )
}