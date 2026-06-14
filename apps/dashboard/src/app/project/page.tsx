import { auth, type Session } from "@workspace/auth/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { ProjectsList } from "./_components/project-list"
export default async function ProjectsPage() {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as Session | null

  if (!session) {
    redirect(`/auth/sign-in?redirectTo=${encodeURIComponent("/project")}`)
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <ProjectsList />
    </div>
  )
}