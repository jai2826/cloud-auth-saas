"use client"

import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useDeleteOrganization,
} from "@better-auth-ui/react"
import type { Organization } from "better-auth/client"
import { TriangleAlert } from "lucide-react"
import type { SyntheticEvent } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Spinner } from "@workspace/ui/components/spinner"
import { organizationPlugin } from "@workspace/ui/lib/auth/organization-plugin"
import { OrganizationView } from "./organization-view"

export type DeleteOrganizationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  organization: Organization
}

export function DeleteOrganizationDialog({
  open,
  onOpenChange,
  organization,
}: DeleteOrganizationDialogProps) {
  const { authClient, localization, navigate } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const { mutate: deleteOrganization, isPending } = useDeleteOrganization(
    authClient as OrganizationAuthClient,
    {
      onSuccess: () => {
        onOpenChange(false)
        toast.success(organizationLocalization!.organizationDeleted as string)

        navigate({
          to: "/project",
          replace: true,
        })
      },
    }
  )

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    deleteOrganization({ organizationId: organization.id })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <TriangleAlert />
            </AlertDialogMedia>

            <AlertDialogTitle>
              {organizationLocalization!.deleteOrganization as string}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {
                organizationLocalization!
                  .deleteOrganizationDescription as string
              }
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Card>
            <CardContent>
              <OrganizationView organization={organization} hideRole />
            </CardContent>
          </Card>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              {localization.settings.cancel}
            </AlertDialogCancel>

            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending && <Spinner />}

              {organizationLocalization!.deleteOrganization as string}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
