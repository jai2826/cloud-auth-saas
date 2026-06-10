
import ProjectNavbar from "@/app/project/_components/project-navbar"
import { PageShell } from "@/components/PageShell"
import type { ReactNode } from "react"

type ProjectsLayoutProps = {
  children: ReactNode
}

export default function ProjectsLayout({ children }: ProjectsLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <ProjectNavbar />
      <PageShell className="py-6 sm:py-8">{children}</PageShell>
    </div>
  )
}