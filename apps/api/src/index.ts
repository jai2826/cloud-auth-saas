import { Hono } from "hono"
import { cors } from "hono/cors"
import { Pool } from "pg"
import fgaRouter from "./routes/fga"
import { apiKeyAuth } from "./middleware/api-key-auth"

type Bindings = {
  FGA_DB: { connectionString: string }
  WEB_URL?: string
  BETTER_AUTH_SECRET: string
  UPSTASH_REDIS_REST_URL: string
  UPSTASH_REDIS_REST_TOKEN: string
}

type Variables = {
  pool: Pool
  organizationId: string
  apiKeyId: string
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization", "x-api-key"],
    allowMethods: ["POST", "GET", "OPTIONS"],
  })
)

// Attach a pg Pool (via Hyperdrive) to context for every request.
// Used by FGA routes for relationship tuple reads/writes.
app.use("*", async (c, next) => {
  const pool = new Pool({ connectionString: c.env.FGA_DB.connectionString })
  c.set("pool", pool)
  await next()
})

// DISABLED: Better Auth API routes are handled by the dashboard proxy middleware of Nextjs
// app.route("/", authRouter)

// Centralized API Routing
const api = new Hono<{ Bindings: Bindings; Variables: Variables }>()
api.use("/fga/*", apiKeyAuth)
api.route("/fga", fgaRouter)

app.route("/api", api)

export default app