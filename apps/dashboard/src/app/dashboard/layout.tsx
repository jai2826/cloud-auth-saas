import DashboardNavbar from "@/app/dashboard/_components/DashboardNavbar"
import { PageShell } from "@/components/PageShell"
import type { ReactNode } from "react"

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      <DashboardNavbar />
      <PageShell className="py-4 sm:py-6">{children}</PageShell>
    </div>
  )
}
