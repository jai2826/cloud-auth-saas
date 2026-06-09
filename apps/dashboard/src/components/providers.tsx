"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { deleteUserPlugin } from "@workspace/ui/lib/auth/delete-user-plugin"
import { multiSessionPlugin } from "@workspace/ui/lib/auth/multi-session-plugin"
import { apiKeyPlugin } from "@workspace/ui/lib/auth/api-key-plugin"
import { organizationPlugin } from "@workspace/ui/lib/auth/organization-plugin"
import { authClient } from "@/lib/auth-client"
import { getQueryClient } from "@/lib/query-client"
import { AuthProvider } from "@workspace/ui/components/auth/auth-provider"
import { Toaster } from "@workspace/ui/components/sonner"

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = getQueryClient()

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
          apiKeyPlugin({
            organization: true,
          }),
          multiSessionPlugin(),
          organizationPlugin() 
        ]}
        Link={Link}
      >
        {children}

        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}
