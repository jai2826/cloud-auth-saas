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
      <PageShell className="py-4 sm:py-6">{children}</PageShell>
    </div>
  )
}
