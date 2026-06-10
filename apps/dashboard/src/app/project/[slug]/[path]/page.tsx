import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ensureSession, viewPaths } from "@workspace/ui/index"
import { headers } from "next/headers"
import { organizationPluginConfig } from "@/lib/configs/organization-plugin-config"
import { getQueryClient } from "@/lib/query-client"
import { auth } from "@workspace/auth/server"
import { Organization } from "@workspace/ui/components/auth/organization/organization"
import { notFound, redirect } from "next/navigation"
const validOrganizationPaths = Object.values(
  organizationPluginConfig().viewPaths.organization
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
  const queryClient = getQueryClient()
  const session = await ensureSession(queryClient, auth, {
    headers: await headers(),
  })
  if (!session) {
    redirect(
      `/auth/sign-in?redirectTo=${encodeURIComponent(`/project/${slug}/${path}`)}`
    )
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
        <Organization path={path} />
      </div>
    </HydrationBoundary>
  )
}
