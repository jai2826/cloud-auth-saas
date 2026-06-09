import { createWorkerAuth } from "@workspace/auth/worker"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { Pool } from "pg"

const authRouter = new Hono<{
  Bindings: {
    FGA_DB: { connectionString: string }
    BETTER_AUTH_SECRET: string
    DATABASE_URL: string
    WEB_URL?: string
  }
  Variables: { pool: Pool }
}>()

authRouter.use(
  "/api/auth/*",
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
  })
)

authRouter.on(["POST", "GET"], "/api/auth/*", (c) => {
  const auth = createWorkerAuth(c.env)

  return auth.handler(c.req.raw)
})

export default authRouter
