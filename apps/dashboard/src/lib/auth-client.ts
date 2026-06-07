import { createClient } from "@workspace/auth/client";

export const authClient = createClient(
  process.env.NEXT_PUBLIC_APP_URL ?? ""
);