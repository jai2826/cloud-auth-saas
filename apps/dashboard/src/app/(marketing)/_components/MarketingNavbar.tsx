import Logo from "@/components/Logo"
import { Button } from "@workspace/ui/components/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@workspace/ui/components/navigation-menu"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"

const NAV_LINKS = [
  { label: "Sign In", href: "/auth/sign-in" },
  { label: "Launch Console", href: "/dashboard" },
]

const MarketingNavbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Logo />

          <NavigationMenu className="hidden sm:flex sm:max-w-none sm:justify-end">
            <NavigationMenuList className="flex-wrap justify-end gap-1">
              {NAV_LINKS.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex h-9 items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="grid gap-2 sm:hidden">
          {NAV_LINKS.map((item) => (
            <Button
              key={item.href}
              nativeButton={false}
              variant="outline"
              className="w-full justify-center"
              render={<Link href={item.href}>{item.label}</Link>}
            />
          ))}
        </div>
      </div>
    </header>
  )
}

export default MarketingNavbar
