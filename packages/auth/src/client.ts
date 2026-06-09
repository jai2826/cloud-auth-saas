// packages/auth/src/client.ts
import { createAuthClient as createBetterAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"
import { apiKeyClient } from "@better-auth/api-key/client"

export const createAuthClient = createBetterAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8787",
  plugins: [organizationClient(), apiKeyClient()],
})

export type SignIn = typeof createAuthClient.signIn
export type SignOut = typeof createAuthClient.signOut
