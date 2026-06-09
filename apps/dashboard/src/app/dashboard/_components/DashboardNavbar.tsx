import Logo from "@/components/Logo"
import LogOutButton from "@/components/LogoutButton"
import { Button } from "@workspace/ui/components/button"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@workspace/ui/components/navigation-menu"
import { cn } from "@workspace/ui/lib/utils"
import { LayoutDashboard, Settings } from "lucide-react"
import Link from "next/link"

const NAV_LINKS = [
  { label: "Projects", href: "/projects", icon: LayoutDashboard },
  { label: "Settings", href: "/settings", icon: Settings },
]

const DashboardNavbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <LogOutButton />
        </div>

        <NavigationMenu className="hidden sm:flex sm:max-w-none sm:justify-start">
          <NavigationMenuList className="flex-wrap justify-start gap-1">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => (
              <NavigationMenuItem key={href}>
                <Link
                  href={href}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="grid gap-2 sm:hidden">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => (
            <Button
              key={href}
              nativeButton={false}
              variant="outline"
              className="w-full justify-center"
              render={
                <Link href={href} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              }
            />
          ))}
        </div>
      </div>
    </header>
  )
}

export default DashboardNavbar
