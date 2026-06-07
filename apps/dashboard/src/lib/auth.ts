import { createAuth } from "@workspace/auth/server"

export const auth = createAuth(
  process.env.DATABASE_URL!,
  process.env.BETTER_AUTH_SECRET!
)
