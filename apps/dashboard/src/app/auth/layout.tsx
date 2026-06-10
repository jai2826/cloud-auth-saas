import { BrandCanvas } from "@workspace/ui/components/layout/background-canvas"


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <BrandCanvas>{children}</BrandCanvas>
}
