import { Hono } from "hono"
import { cors } from "hono/cors"
import { Pool } from "pg"
import authRouter from "./routes/auth"
import fgaRouter from "./routes/fga"

type Bindings = { FGA_DB: { connectionString: string }; WEB_URL?: string }
type Variables = { pool: Pool }

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
  })
)



// DISABLED: Better Auth API routes are handled by the dashboard proxy middleware of Nextjs
// app.route("/",authRouter)



// 3. Centralized API Routing
const api = new Hono<{ Bindings: Bindings; Variables: Variables }>()
// Mount sub-routers and specific routes under the /api prefix
api.route("/fga", fgaRouter)

app.route("/api", api)

export default app
