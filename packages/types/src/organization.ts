/**
 * Base organization shape returned by better-auth's organization plugin.
 * Defined manually here rather than imported from better-auth to avoid
 * pulling server-side code into client bundles.
 */
export type Organization = {
  id: string
  name: string
  slug: string
  logo?: string | null
  createdAt: Date
  metadata?: string | null
}