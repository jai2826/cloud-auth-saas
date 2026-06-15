import type { Organization } from "./organization"
import type { User } from "./user"

/**
 * Base session row shape from better-auth.
 */
export type SessionData = {
  id: string
  token: string
  userId: string
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
  ipAddress?: string | null
  userAgent?: string | null
}

/**
 * Fields added to the session row by the organization plugin +
 * databaseHooks. Not in better-auth's base types so defined here
 * for use in casts across packages/auth and packages/ui.
 */
export type ExtendedSessionFields = {
  activeOrganizationId?: string | null
  activeOrganizationSlug?: string | null
}

/**
 * The session row with extended fields included.
 */
export type ExtendedSessionData = SessionData & ExtendedSessionFields

/**
 * Full session shape — what getSession() returns at runtime.
 * Mirrors better-auth's base Session shape plus customSession additions.
 */
export type Session = {
  session: ExtendedSessionData
  user: User
}

/**
 * Full session shape with organizations list attached via customSession.
 */
export type ExtendedSession = Session & {
  organizations: Organization[]
}

/**
 * Cast any better-auth session-shaped object to include extended fields.
 * Zero runtime cost — purely a type assertion.
 *
 * @example
 * const extended = asExtendedSession(deviceSession)
 * extended.session.activeOrganizationSlug
 */

export function asExtendedSession<T extends { session: object }>(
  data: T
): T & {
  session: T["session"] & ExtendedSessionFields
  organizations?: Organization[]
} {
  return data as T & {
    session: T["session"] & ExtendedSessionFields
    organizations?: Organization[]
  }
}
