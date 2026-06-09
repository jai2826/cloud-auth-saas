// packages/auth/src/client.ts
import { createAuthClient as createBetterAuthClient } from "better-auth/react"
import { multiSessionClient, organizationClient } from "better-auth/client/plugins"
import { apiKeyClient } from "@better-auth/api-key/client"

export const createAuthClient = createBetterAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [organizationClient(), apiKeyClient(), multiSessionClient()],
  fetchOptions: {
    credentials: "include",
  },
})

export type SignIn = typeof createAuthClient.signIn
export type SignOut = typeof createAuthClient.signOut
