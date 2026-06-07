import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import Link from "next/link"

export default async function ProjectsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect("/auth/signin")

  const projects = await auth.api.listOrganizations({
    headers: await headers(),
  })

  return (
    <div>
      <div>
        <h1>Projects</h1>
        <Link href="/projects/new">New Project</Link>
      </div>

      {!projects?.length ? (
        <div>
          <p>No projects yet.</p>
          <Link href="/projects/new">Create your first project</Link>
        </div>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <Link href={`/projects/${project.slug}`}>
                {project.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}