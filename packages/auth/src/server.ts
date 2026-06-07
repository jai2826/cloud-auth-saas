import { betterAuth } from "better-auth"
import { organization } from "better-auth/plugins"
import { Pool } from "pg"

export const createAuth = (databaseUrl: string, secret: string) => {
  return betterAuth({
    secret,
    database: new Pool({
      connectionString: databaseUrl,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      organization({
        schema: {
          organization: {
            modelName: "project",
          },
          member: {
            fields: {
              organizationId: "projectId",
            },
          },
          invitation: {
            fields: {
              organizationId: "projectId",
            },
          },
          session: {
            fields: {
              activeOrganizationId: "activeProjectId",
            },
          },
        },
        allowUserToCreateOrganization: true,
      }),
    ],
  })
}

export type Auth = ReturnType<typeof createAuth>
export type Session = Auth["$Infer"]["Session"]
export type User = Auth["$Infer"]["Session"]["user"]
