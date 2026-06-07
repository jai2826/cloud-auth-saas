import { Hono } from "hono";
import { cors } from "hono/cors";
import { Pool } from "pg";
import fgaRouter from "./routes/fga";
import { requirePermission } from "./middleware/fga";

type Bindings = { FGA_DB: { connectionString: string } };
type Variables = { pool: Pool };

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// 1. Global Security & CORS
app.use("*", cors({
  origin: "http://localhost:3000",
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "Cookie"],
}));

// 2. Global Database Pool Middleware
app.use("*", async (c, next) => {
  c.set("pool", new Pool({
    connectionString: c.env.FGA_DB.connectionString,
    max: 1,
  }));
  await next();
});

// 3. Centralized API Routing
const api = new Hono<{ Bindings: Bindings; Variables: Variables }>();
// Mount sub-routers and specific routes under the /api prefix
api.route("/fga", fgaRouter);

// api.get("/docs/:id", requirePermission("read", "document:view"), (c) => 
//   c.json({ data: "Secret Document Content" })
// );

// api.get("/health", async (c) => {
//   const client = await c.get("pool").connect();
//   try {
//     const result = await client.query("SELECT 1 as ok");
//     return c.json({ status: "ok", db: result.rows[0] });
//   } finally {
//     client.release();
//   }
// });

// Final mount point
app.route("/api", api);

export default app;