
import { auth } from "@workspace/auth/server"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function ProjectsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect("/auth/sign-in")

  const projects = await auth.api.listOrganizations({
    headers: await headers(),
  })

  // if (!projects?.length) {
  //   redirect("/projects")
  // }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-sm text-muted-foreground">
            Review and launch the workspaces you already created.
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          New project
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}/dashboard`}
            className="block rounded-xl border border-border bg-card p-4 transition-all duration-150 hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-sm font-bold text-primary">
                  {project.name[0]}
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {project.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {project.slug}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
