
import { auth } from "@workspace/auth/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProjectDashboardPage({ params }: Props) {
  const { slug } = await params

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect("/auth/sign-in")

  const project = await auth.api.getFullOrganization({
    headers: await headers(),
    query: { organizationSlug: slug },
  })

  if (!project) redirect("/projects")

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-[15px] font-semibold text-zinc-900">{project.name}</h1>
        <p className="text-[13px] text-zinc-500 mt-0.5">
          Overview of your project&apos;s auth and FGA activity
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Policies", value: "0" },
          { label: "Active Members", value: String(project.members?.length ?? 0) },
          { label: "API Requests", value: "0" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-zinc-200 rounded-xl p-4"
          >
            <p className="text-[12px] text-zinc-500">{stat.label}</p>
            <p className="text-[22px] font-semibold text-zinc-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="bg-white border border-zinc-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
          <span className="text-lg">🔐</span>
        </div>
        <p className="text-[13px] font-medium text-zinc-900">No policies yet</p>
        <p className="text-[12px] text-zinc-500 mt-1">
          Create your first FGA policy to get started
        </p>
      </div>
    </div>
  )
}