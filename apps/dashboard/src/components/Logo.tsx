import { Separator } from "@workspace/ui/components/separator"
import { Shield } from "lucide-react"
import Link from "next/link"

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Link href="/" className="flex shrink-0 items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
          <Shield className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-[13px] font-semibold tracking-tight text-zinc-900">
          CloudAuth
        </span>
      </Link>
      <Separator orientation="vertical" />
    </div>
  )
}

export default Logo
