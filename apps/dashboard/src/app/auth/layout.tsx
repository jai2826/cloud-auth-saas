import { PageShell } from "@/components/PageShell"
import { BrandCanvas } from "@workspace/ui/components/layout/background-canvas"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageShell className="py-4 sm:py-6">{children}</PageShell>
}
