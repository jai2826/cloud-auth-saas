import { Separator } from "@workspace/ui/components/separator"
import { cn } from "@workspace/ui/lib/utils"
import { Shield } from "lucide-react"
import Link from "next/link"

const LogoConsole = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
        <Shield className="h-3.5 w-3.5 text-white" />
      </div>
      <span className="text-xl font-semibold tracking-tight text-zinc-900">
        CloudAuth
      </span>
    </div>
  )
}

export default LogoConsole
