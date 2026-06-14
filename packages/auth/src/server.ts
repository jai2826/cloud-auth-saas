// packages/auth/src/server.ts
import { apiKey } from "@better-auth/api-key"
import { betterAuth } from "better-auth"
import { customSession, multiSession, organization } from "better-auth/plugins"
import { pgPool } from "./lib/db"

export const auth = betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
    // Persisted alongside activeOrganizationId, kept in sync via
    // databaseHooks.session.update.before below.
    additionalFields: {
      activeOrganizationSlug: {
        type: "string",
        required: false,
      },
    },
  },
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!, "http://localhost:3000"],
  secret: process.env.BETTER_AUTH_SECRET!,
  database: pgPool, // Assign the shared pool directly here
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    session: {
      update: {
        before: async (sessionData) => {
          const data = sessionData as typeof sessionData & {
            activeOrganizationId?: string | null
          }

          if (!("activeOrganizationId" in data)) {
            return { data: sessionData }
          }

          if (!data.activeOrganizationId) {
            return {
              data: { ...data, activeOrganizationSlug: null },
            }
          }

          const { rows } = await pgPool.query(
            `SELECT slug FROM "organization" WHERE id = $1`,
            [data.activeOrganizationId]
          )

          return {
            data: {
              ...data,
              activeOrganizationSlug: rows[0]?.slug ?? null,
            },
          }
        },
      },
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      try {
        // Query the cross-reference member matrix
        const query = `
          SELECT o.id, o.slug, o.name
          FROM "member" m
          JOIN "organization" o ON m."organizationId" = o.id
          WHERE m."userId" = $1
        `
        const { rows: organizations } = await pgPool.query(query, [user.id])

        return {
          user,
          organizations,
          session,
        }
      } catch (error) {
        console.error(
          "Failed to append organization attributes to token session:",
          error
        )
        return {
          user,
          organizations: [],
          session,
        }
      }
    }),
    organization({
      allowUserToCreateOrganization: true,
    }),
    apiKey({ configId: "organization", references: "organization" }),
    multiSession(),
  ],
  user: {
    deleteUser: {
      enabled: true,
    },
  },
})

export type Auth = typeof auth

// Create a clean, exported type for your application to use elsewhere
export type Session = Auth["$Infer"]["Session"] & {
  session: {
    activeOrganizationId?: string | null
    activeOrganizationSlug?: string | null
  }
  organizations: Auth["$Infer"]["Organization"][]
}

export type User = Auth["$Infer"]["Session"]["user"]
export type Project = Auth["$Infer"]["Organization"]