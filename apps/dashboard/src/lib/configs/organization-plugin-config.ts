// lib/auth/organization-plugin-config.ts
import { organizationPlugin } from "@workspace/ui/lib/auth/organization-plugin"
import type { OrganizationPluginOptions } from "@workspace/ui/index"

export const organizationPluginConfig = (options?: OrganizationPluginOptions) =>
  organizationPlugin({
    
    slug: options?.slug || null,
    ...options,
    viewPaths: {
      settings: {
        organizations: "projects",
      },
      organization: {
        settings: "settings",
        people: "people",
      },
    },
    localization: {
      organization: "Project",
      organizations: "Projects",
      createOrganization: "Create project",
      deleteOrganization: "Delete project",
      deleteOrganizationDescription:
        "Permanently delete this project and all of its data. All members will lose access and this cannot be undone.",
      organizationDeleted: "Project deleted",
      organizationProfile: "Project profile",
      organizationUpdatedSuccess: "Project updated successfully",
      organizationsDescription:
        "Create a project to collaborate with others and manage shared access.",
      organizationInvitationsEmptyDescription:
        "Invite a teammate to collaborate in this project.",
      noOrganizations: "No projects",
      namePlaceholder: "Enter the project name",
      slugPlaceholder: "project-slug",
      inviteMemberDescription:
        "We'll email them a link to join this project. Choose the role they'll have once they accept.",
      leaveOrganization: "Leave project",
      leaveOrganizationDescription:
        "Leave this project and lose access to its data and resources. You'll need a new invitation to rejoin.",
      removeMemberWarning:
        "Are you sure you want to remove this member from the project? They will lose access immediately.",
      leftOrganization: "You left the project",
      userInvitationsEmptyDescription:
        "Invitations to join a project will show up here.",
    },
  })
