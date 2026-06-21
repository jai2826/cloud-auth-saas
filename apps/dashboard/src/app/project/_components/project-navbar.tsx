"use client"
import LogoConsole from "@/components/Logo"
import { CreateOrganizationDialog } from "@workspace/ui/components/auth/organization/create-organization-dialog"
import { OrganizationSwitcher } from "@workspace/ui/components/auth/organization/organization-switcher"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { useAuthPlugin } from "@workspace/ui/index"
import { organizationPlugin } from "@workspace/ui/lib/auth/organization-plugin"

import { UserButton } from "@workspace/ui/components/auth/user/user-button"
import {
  BookOpenIcon,
  LayoutDashboardIcon,
  MenuIcon,
  PlusCircle,
  Settings2Icon,
} from "lucide-react"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

const ProjectNavbar = () => {
  const router = useRouter()
  const { slug } = useParams()
  const navigationData = [
    {
      title: "Docs",
      href: "/documentation",
      icon: BookOpenIcon,
    },
    {
      title: "Settings",
      href: `/project/${slug}/settings`,
      icon: Settings2Icon,
    },
    {
      title: "Dashboard",
      href: `/project/${slug}/dashboard`,
      icon: LayoutDashboardIcon,
    },
  ]

  const pathname = usePathname()
  // const { localization } = useAuth()
  // const { localization: organizationLocalization } =
  //   useAuthPlugin(organizationPlugin)

  const [createOpen, setCreateOpen] = useState(false)

  const handleSetActive = (org: { slug: string } | null) => {

    const currentRoute = pathname.split("/").at(-1)

    if (org) {
      router.push(`/project/${org.slug}/${currentRoute}`)
    } else {
      router.push("/project")
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background/20 backdrop-blur-3xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex flex-1 items-center gap-8 font-medium text-muted-foreground md:justify-between lg:gap-16">
          <div className="flex items-center gap-6">
            <Link href="/project">
              <LogoConsole className="gap-3 text-foreground" />
            </Link>

            {pathname !== "/project" && (
              <OrganizationSwitcher
                className="flex"
                hidePersonal
                setActive={handleSetActive}
              />
            )}
          </div>
          <div className="flex items-center gap-6 max-lg:hidden">
            {navigationData.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center hover:text-primary ",
                    isActive && "text-primary"
                  )}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.title}
                </Link>
              )
            })}
            <UserButton />
          </div>
        </div>

        <div className="flex items-center gap-6 md:gap-0 lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="icon">
                  <MenuIcon />
                  <span className="sr-only">Menu</span>
                </Button>
              }
              
            ></DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              {/* As of right now this is disabled */}
              <DropdownMenuGroup >
                <UserButton className="w-full"/>
                {/* <OrganizationSwitcher
                  className="w-full justify-between "
                  hidePersonal
                  hideCreate
                  setActive={handleSetActive}
                />

                <DropdownMenuItem onClick={() => setCreateOpen(true)}>
                  <PlusCircle className="mr-1 h-4 w-4 text-muted-foreground" />
                  {organizationLocalization?.createOrganization as string}
                </DropdownMenuItem> */}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {navigationData.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    {item.icon && <item.icon className="mr-1 h-4 w-4" />}
                    <a href={item.href}>{item.title}</a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CreateOrganizationDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={(org) => router.push(`/project/${org.slug}/settings`)}
      />
    </header>
  )
}

export default ProjectNavbar
