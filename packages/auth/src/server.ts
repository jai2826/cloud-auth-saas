// packages/auth/src/server.ts
import { apiKey } from "@better-auth/api-key"
import { betterAuth } from "better-auth"
import { multiSession, organization } from "better-auth/plugins"
import { Pool } from "pg"

export const auth = betterAuth({
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!, "http://localhost:3000"],
  secret: process.env.BETTER_AUTH_SECRET!,
  database: new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
    }),
    apiKey({ configId: "organization", references: "organization" }),
    multiSession(),
  ],
  user: {
    deleteUser: {
      enabled: true, // Required to allow authClient.deleteUser calls
    },
  },
})

export type Auth = typeof auth
export type Session = Auth["$Infer"]["Session"]
export type User = Auth["$Infer"]["Session"]["user"]
export type Project = Auth["$Infer"]["Organization"]
