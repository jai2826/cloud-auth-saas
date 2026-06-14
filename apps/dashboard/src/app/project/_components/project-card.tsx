"use client"

import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useSetActiveOrganization
} from "@workspace/ui/index"
import type { Organization } from "better-auth/client"
import { MoreVertical, Settings as SettingsIcon, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@workspace/ui/components/dropdown-menu"
import { Spinner } from "@workspace/ui/components/spinner"
import { DeleteOrganizationDialog } from "@workspace/ui/components/auth/organization/delete-organization-dialog"
import { OrganizationView } from "@workspace/ui/components/auth/organization/organization-view"
import { organizationPlugin } from "@workspace/ui/lib/auth/organization-plugin"

export type ProjectCardProps = {
  organization: Organization
}

/**
 * A single project card. Clicking the card (or "Open") sets this
 * organization as active and navigates to its dashboard. The 3-dot
 * menu offers Open / Manage (settings) / Delete.
 */
export function ProjectCard({ organization }: ProjectCardProps) {
  const router = useRouter()
  const { authClient } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const [deleteOpen, setDeleteOpen] = useState(false)

  const { mutate: setActiveOrganization, isPending: isOpening } =
    useSetActiveOrganization(authClient as OrganizationAuthClient, {
      onSuccess: () => {
        router.push(`/project/${organization.slug}/dashboard`)
      }
    })

  function handleOpen() {
    setActiveOrganization({ organizationId: organization.id })
  }

  function handleManage() {
    router.push(`/project/${organization.slug}/settings`)
  }

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleOpen()
        }}
        className="cursor-pointer transition-colors hover:bg-accent/50"
      >
        <CardContent className="flex items-center gap-3 p-4">
          <div className="min-w-0 flex-1">
            <OrganizationView organization={organization} hideRole />
          </div>

          {isOpening ? (
            <Spinner className="shrink-0" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  />
                }
              >
                <MoreVertical className="size-4" />
                <span className="sr-only">{organizationLocalization!.manage as string}</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuItem onClick={handleOpen}>
                  {organizationLocalization!.organization as string}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleManage}>
                  <SettingsIcon className="text-muted-foreground" />
                  {organizationLocalization!.manage as string}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 />
                  {organizationLocalization!.deleteOrganization as string}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardContent>
      </Card>

      <DeleteOrganizationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        organization={organization}
      />
    </>
  )
}