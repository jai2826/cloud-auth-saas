"use client"

import { authClient } from "@/lib/auth-client"
import { organizationPluginConfig } from "@/lib/configs/organization-plugin-config"
import { getQueryClient } from "@/lib/query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@workspace/ui/components/auth/auth-provider"
import { Toaster } from "@workspace/ui/components/sonner"
import { apiKeyPlugin } from "@workspace/ui/lib/auth/api-key-plugin"
import { deleteUserPlugin } from "@workspace/ui/lib/auth/delete-user-plugin"
import { multiSessionPlugin } from "@workspace/ui/lib/auth/multi-session-plugin"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = getQueryClient()
  const params = useParams<{ slug?: string | string[] }>()
  const slug = typeof params?.slug === "string" ? params.slug : null

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        authClient={authClient}
        redirectTo="/projects"
        navigate={({ to, replace }) =>
          replace ? router.replace(to) : router.push(to)
        }
        plugins={[
          deleteUserPlugin(),
          apiKeyPlugin({ organization: true }),
          multiSessionPlugin(),
          organizationPluginConfig({ slug }),
        ]}
        Link={Link}
      >
        {children}

        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}
