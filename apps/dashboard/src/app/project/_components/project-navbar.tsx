"use client"
import LogoConsole from "@/components/Logo"
import { useAuth, useAuthPlugin } from "@workspace/ui/index"
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
import { organizationPlugin } from "@workspace/ui/lib/auth/organization-plugin"

import { PlusCircle, MenuIcon, BookOpenIcon, Settings2Icon } from "lucide-react"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useState } from "react"


const ProjectNavbar = () => {
  const router = useRouter()
  const {slug} = useParams()
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
      title: "Settings",
      href: `/project/${slug}/settings`,
      icon: Settings2Icon,
    },
  ]
   
  const pathname = usePathname()
  // const { localization } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const [createOpen, setCreateOpen] = useState(false)

  const handleSetActive = (org: { slug: string } | null) => {
    if (org) {
      router.push(`/project/${org.slug}/settings`)
    } else {
      router.push("/project")
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background/20 backdrop-blur-3xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-5 sm:px-6">
        <div className="flex flex-1 items-center gap-8 font-medium text-muted-foreground md:justify-between lg:gap-16">
          <div className="flex items-center gap-6">
            <Link href="/project">
              <LogoConsole className="gap-3 text-foreground" />
            </Link>

            {pathname !== "/project" && (
              <OrganizationSwitcher
                className="hidden md:flex"
                hidePersonal
                setActive={handleSetActive}
              />
            )}
          </div>
          <div className="flex items-center gap-6">
            {navigationData.map((item, index) => {
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center hover:text-primary max-md:hidden"
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.title}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="icon">
                  <MenuIcon />
                  <span className="sr-only">Menu</span>
                </Button>
              }
              className="md:hidden"
            ></DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <OrganizationSwitcher
                  className="w-full justify-between"
                  hidePersonal
                  hideCreate
                  setActive={handleSetActive}
                />

                <DropdownMenuItem onClick={() => setCreateOpen(true)}>
                  <PlusCircle className="text-muted-foreground" />
                  {organizationLocalization?.createOrganization as string}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {navigationData.map((item, index) => (
                  <DropdownMenuItem key={index}>
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
