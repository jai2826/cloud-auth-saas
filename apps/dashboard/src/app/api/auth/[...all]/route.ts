// apps/dashboard/src/app/api/auth/[...all]/route.ts
import { auth } from "@workspace/auth/server";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth.handler);