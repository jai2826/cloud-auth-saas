// apps/api/src/middleware/fga.ts
import { createMiddleware } from 'hono/factory';
import { evaluateAccess } from '../services/fga';

export const requirePermission = (action: string, resourceTemplate: string) => {
  return createMiddleware(async (c, next) => {
    // 1. Get user from better-auth
    const session = await c.get("session"); 
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    // 2. Evaluate
    const allowed = await evaluateAccess(
      c.env.POOL, // Your pg Pool instance
      session.user.id,
      action,
      resourceTemplate
    );

    if (!allowed) return c.json({ error: "Forbidden" }, 403);
    await next();
  });
};