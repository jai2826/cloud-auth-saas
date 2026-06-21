// apps/api/src/middleware/fga.ts
import { createMiddleware } from 'hono/factory';
import { checkPermission } from '../services/fga';

/**
 * Reusable authorization middleware enforcing relationship-based access control.
 * @param action The relation type (e.g., 'writer', 'reader', 'owner')
 * @param objectType The category of resource (e.g., 'project', 'organization', 'document')
 * @param paramKey The dynamic route parameter holding the unique resource identifier (e.g., 'id' or 'slug')
 */
export const requirePermission = (action: string, objectType: string, paramKey: string) => {
  return createMiddleware(async (c, next) => {
    // 1. Better-Auth session validation injection
    // Assumes your dashboard proxy or custom edge auth middleware sets c.set("session", ...)
    const session = c.get("session") as any; 
    if (!session?.user?.id) {
      return c.json({ error: "Unauthorized access: Session missing or invalid." }, 401);
    }

    // 2. Resolve target Object ID from the URL parameters dynamically
    const objectId = c.req.param(paramKey);
    if (!objectId) {
      return c.json({ error: `Bad Request: Target reference parameter '${paramKey}' not detected.` }, 400);
    }

    // 3. Query OpenFGA authorization engine
    const isAllowed = await checkPermission(c.env, {
      userId: session.user.id,
      action: action,
      objectType: objectType,
      objectId: objectId
    });

    if (!isAllowed) {
      return c.json({ error: "Forbidden: Elevated permissions are required to execute this operation." }, 403);
    }

    await next();
  });
};