"use client"

import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useListOrganizations
} from "@workspace/ui/index"
import { useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { CreateOrganizationDialog } from "@workspace/ui/components/auth/organization/create-organization-dialog"
import { OrganizationViewSkeleton } from "@workspace/ui/components/auth/organization/organization-view-skeleton"
import { OrganizationsEmpty } from "@workspace/ui/components/auth/organization/organizations-empty"
import { organizationPlugin } from "@workspace/ui/lib/auth/organization-plugin"
import { Card, CardContent } from "@workspace/ui/components/card"
import { ProjectCard } from "./project-card"

/**
 * Grid of all projects (organizations) the user belongs to, with a
 * "Create project" action. Each project is rendered via `ProjectCard`.
 */
export function ProjectsList() {
  const { authClient } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const [createOpen, setCreateOpen] = useState(false)

  const { data: organizations, isPending } = useListOrganizations(
    authClient as OrganizationAuthClient
  )

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex items-end justify-between gap-3">
          <h1 className="text-lg font-semibold">
            {organizationLocalization!.organizations as string}
          </h1>

          <Button
            size="sm"
            disabled={isPending}
            onClick={() => setCreateOpen(true)}
          >
            {organizationLocalization!.createOrganization as string}
          </Button>
        </div>

        {isPending ? (
          <Card>
            <CardContent className="p-4">
              <OrganizationViewSkeleton />
            </CardContent>
          </Card>
        ) : !organizations?.length ? (
          <Card className="p-0">
            <CardContent className="p-0">
              <OrganizationsEmpty onCreatePress={() => setCreateOpen(true)} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {organizations.map((organization) => (
              <ProjectCard key={organization.id} organization={organization} />
            ))}
          </div>
        )}
      </div>

      <CreateOrganizationDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}