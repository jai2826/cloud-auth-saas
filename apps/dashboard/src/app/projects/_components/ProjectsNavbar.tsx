"use client"

import {
  Bell,
  Check,
  ChevronDown,
  ChevronsUpDown,
  LayoutDashboard,
  Loader2,
  LogOut,
  Plus,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"


import Logo from "@/components/Logo"
import { authClient } from "@/lib/auth-client"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@workspace/ui/components/navigation-menu"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"
import { Project } from "@workspace/auth/server"

const NAV_LINKS = [
  { label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
  { label: "Settings", href: "settings", icon: Settings },
]

export function ProjectsNavbar() {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const slug = params?.slug as string | undefined

  const session = authClient.useSession()
  const user = session.data?.user
  const [isSwitching, setIsSwitching] = useState(false)

  const { data: projects } = authClient.useListOrganizations()
  const { data: activeProject } = authClient.useActiveOrganization()
  const [optimisticProject, setOptimisticProject] = useState<{
    name: string
    slug: string
  } | null>(null)

  const setActiveProjectChange = async (
    id: string,
    slug: string,
    name: string
  ) => {
    setIsSwitching(true)
    setOptimisticProject({ name, slug })

    const { error } = await authClient.organization.setActive({
      organizationId: id,
    })

    if (error) {
      setOptimisticProject(null)
      setIsSwitching(false)
      return
    }

    router.push(`/projects/${slug}/dashboard`)
    setIsSwitching(false)
  }

  const displayProject = optimisticProject ?? activeProject
  const isLoading = isSwitching

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/auth/sign-in")
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Logo />

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors duration-150 outline-none hover:bg-muted disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
                    ) : (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10">
                        <span className="text-[10px] font-bold text-primary">
                          {displayProject?.name?.[0] ?? "P"}
                        </span>
                      </div>
                    )}
                    <span className="max-w-28 truncate sm:max-w-36">
                      {isLoading
                        ? isSwitching
                          ? "Switching..."
                          : "Loading..."
                        : (displayProject?.name ?? "Select project")}
                    </span>
                    <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  </button>
                }
              />
              <DropdownMenuContent
                align="start"
                className="w-60 border-border shadow-md"
              >
                <DropdownMenuRadioGroup>
                  <DropdownMenuLabel className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                    Projects
                  </DropdownMenuLabel>
                  {projects?.map((project: Project) => (
                    <DropdownMenuItem
                      key={project.id}
                      onClick={() =>
                        setActiveProjectChange(
                          project.id,
                          project.slug,
                          project.name
                        )
                      }
                      className="flex cursor-pointer items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10">
                          <span className="text-[10px] font-bold text-primary">
                            {project.name[0]}
                          </span>
                        </div>
                        <span className="truncate">{project.name}</span>
                      </div>
                      {project.slug === slug && (
                        <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/projects/new")}
                  className="flex cursor-pointer items-center gap-2 text-sm text-primary"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors duration-150 outline-none hover:bg-muted">
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={user?.image ?? ""}
                        alt={user?.name ?? "User"}
                      />
                      <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-32 truncate text-sm font-medium text-foreground sm:block">
                      {user?.name ?? "Account"}
                    </span>
                    <ChevronDown className="hidden h-3 w-3 text-muted-foreground sm:block" />
                  </button>
                }
              />
              <DropdownMenuContent
                align="end"
                className="w-56 border-border shadow-md"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="pb-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user?.name ?? "User"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email ?? ""}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                    Account settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/settings/billing")}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Badge
                      variant="secondary"
                      className="h-4 px-1 text-[10px] font-semibold"
                    >
                      PRO
                    </Badge>
                    Billing & plan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex cursor-pointer items-center gap-2 text-sm text-red-600 focus:bg-red-50 focus:text-red-600"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <NavigationMenu className="hidden lg:flex lg:max-w-none lg:justify-start">
          <NavigationMenuList className="flex-wrap justify-start gap-1">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const fullHref = slug ? `/projects/${slug}/${href}` : "#"
              const isActive = pathname?.endsWith(`/${href}`)
              return (
                <NavigationMenuItem key={href}>
                  <Link
                    href={fullHref}
                    className={cn(
                      "inline-flex h-9 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <NavigationMenu className="lg:hidden lg:max-w-none">
          <NavigationMenuList className="flex-wrap justify-start gap-1">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const fullHref = slug ? `/projects/${slug}/${href}` : "#"
              const isActive = pathname?.endsWith(`/${href}`)
              return (
                <NavigationMenuItem key={href}>
                  <Link
                    href={fullHref}
                    className={cn(
                      "inline-flex h-9 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
