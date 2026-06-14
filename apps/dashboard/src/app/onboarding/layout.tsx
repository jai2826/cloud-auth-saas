import { PageShell } from "@/components/PageShell"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageShell>{children}</PageShell>
}
