import { betterAuth } from "better-auth"
import { organization } from "better-auth/plugins"
import { apiKey } from "@better-auth/api-key"
import { Pool } from "pg"

export type WorkerEnv = {
  BETTER_AUTH_SECRET: string
  DATABASE_URL: string
  WEB_URL?: string
}

export function createWorkerAuth(env: WorkerEnv) {
  return betterAuth({
    secret: env.BETTER_AUTH_SECRET!,
    trustedOrigins: [
      "http://localhost:3000",
      env.WEB_URL || "",
    ],
    database: new Pool({
      connectionString: env.DATABASE_URL!,
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
      apiKey({
        references: "organization",
      }),
    ],
  })
}
