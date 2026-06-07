
import { Button } from "@workspace/ui/components/button"
import { Shield } from "lucide-react"
import Link from "next/link"

const MarketingNavbar = () => {
 
  return (
    <header
      id="marketing_header"
      className="border-zinc-850 sticky top-0 z-50 border-b border-zinc-800 bg-[#09090b]/85 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-sky-400/20 bg-sky-400/10 p-2 text-sky-300">
            <Shield className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-[0.24em] text-white">
              PUREJOY // FGA
            </div>
            <div className="text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
              Authorization at edge speed
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
          nativeButton={false}
          render={
            <Link
            href="/auth/signin"
            className="font-mono text-xs text-zinc-400 hover:text-white"
            >
                Sign In
              </Link>
            }
            />
          <Button
            nativeButton={false}
            render={
              <Link
                href="/dashboard"
                className="font-mono text-xs text-zinc-400 hover:text-white"
              >
                Launch Console
              </Link>
            }
          />
        </div>
      </div>
    </header>
  )
}

export default MarketingNavbar
