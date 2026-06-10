import { cn } from "@workspace/ui/lib/utils"
import { ReactNode } from "react"

interface BrandCanvasProps {
  children: ReactNode
  className?: string
}

export function BrandCanvas({ children, className }: BrandCanvasProps) {
  return (
    <div
      className={cn(
        "relative flex w-full h-full min-h-screen flex-1 flex-col overflow-x-hidden bg-background",
        className
      )}
    >
      {/* Layer 1: Indigo glow — top-left origin, secondary top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: [
            "radial-gradient(circle at 10% 6%, rgba(99,102,241,0.10), transparent 32%)",
            "radial-gradient(circle at 90% 18%, rgba(139,92,246,0.06), transparent 38%)",
            "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 100%)",
          ].join(","),
        }}
      />

      {/* Layer 2: Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(99,102,241,0.18) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Layer 3: Content */}
      <main className="relative z-10 flex flex-1 flex-col">
        {children}
      </main>
    </div>
  )
}