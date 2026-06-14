// packages/auth/src/client.ts
import { createAuthClient as createBetterAuthClient } from "better-auth/react"
import {
  customSessionClient,
  multiSessionClient,
  organizationClient,
} from "better-auth/client/plugins"
import { apiKeyClient } from "@better-auth/api-key/client"
import type { auth } from "./server"

export const createAuthClient = createBetterAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    organizationClient(),
    apiKeyClient(),
    multiSessionClient(),
    customSessionClient<typeof auth>(
      
    ),
  ],
  fetchOptions: {
    credentials: "include",
  },
})

export type SignIn = typeof createAuthClient.signIn
export type SignOut = typeof createAuthClient.signOut
