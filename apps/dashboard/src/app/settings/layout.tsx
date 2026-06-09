import DashboardNavbar from "@/app/dashboard/_components/DashboardNavbar"
import { PageShell } from "@/components/PageShell"
import type { ReactNode } from "react"

type SettingsLayoutProps = {
  children: ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <DashboardNavbar />
      <PageShell className="py-6 sm:py-8">{children}</PageShell>
    </div>
  )
}