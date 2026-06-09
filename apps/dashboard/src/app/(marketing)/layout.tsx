import MarketingNavbar from "@/app/(marketing)/_components/MarketingNavbar"
import { PageShell } from "@/components/PageShell"
import type { ReactNode } from "react"

type MarketingLayoutProps = {
  children: ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background">
      <MarketingNavbar />
      <PageShell className="py-6 sm:py-8">{children}</PageShell>
    </div>
  )
}
