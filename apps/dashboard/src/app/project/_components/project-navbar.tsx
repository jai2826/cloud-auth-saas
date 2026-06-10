"use client"
import Logo from "@/components/Logo"
import { OrganizationSwitcher } from "@workspace/ui/components/auth/organization/organization-switcher"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

import { MenuIcon } from "lucide-react"
import { useRouter } from "next/navigation"

const navigationData = [
  {
    title: "Home",
    href: "#",
  },
  {
    title: "Products",
    href: "#",
  },
  {
    title: "About Us",
    href: "#",
  },
  {
    title: "Contact Us",
    href: "#",
  },
]

const ProjectNavbar = () => {
  const router = useRouter()
  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-7 sm:px-6">
        <div className="flex flex-1 items-center gap-8 font-medium text-muted-foreground md:justify-center lg:gap-16">
          <OrganizationSwitcher
            hidePersonal
            setActive={(org) => {
              if (org) {
                router.push(`/projects/${org.slug}/settings`)
              } else {
                router.push("/settings/account")
              }
            }}
          />

          <a href="#" className="hover:text-primary max-md:hidden">
            Products
          </a>
          <a href="/">
            <Logo className="gap-3 text-foreground" />
          </a>
          <a
            href="/settings/account"
            className="hover:text-primary max-md:hidden"
          >
            Account
          </a>
          <a href="#" className="hover:text-primary max-md:hidden">
            Contact Us
          </a>
        </div>

        <div className="flex items-center gap-6">
          {/* <Button variant="ghost" size="icon">
            <SearchIcon />
            <span className="sr-only">Search</span>
          </Button> */}
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
    </header>
  )
}

export default ProjectNavbar
