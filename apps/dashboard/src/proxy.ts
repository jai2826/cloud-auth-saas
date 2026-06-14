import { auth } from "@workspace/auth/server"
import { NextRequest, NextResponse } from "next/server"
import type { Session } from "@workspace/auth/server"

const publicRoutes = ["/"]
const authRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/reset-password",
]

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow Better Auth API routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const hostname = request.headers.get("host") || ""
  console.log(hostname)

  const session = (await auth.api.getSession({
    headers: request.headers,
  })) as Session | null

  // Authenticated users should not access auth routes
  if (session && authRoutes.some((route) => pathname === route)) {
    if (session.session.activeOrganizationSlug) {
      return NextResponse.redirect(
        new URL(
          `/project/${session.session.activeOrganizationSlug}/settings`,
          request.url
        )
      )
    } else if (session.organizations.length > 0) {
      return NextResponse.redirect(
        new URL(
          `/project/${session.organizations[0].slug}/settings`,
          request.url
        )
      )
    } else {
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }
  }

  // Authenticated user on /onboarding who already has an active org — skip forward
  if (
    session &&
    pathname === "/onboarding" &&
    session.session.activeOrganizationSlug
  ) {
    return NextResponse.redirect(
      new URL(
        `/project/${session.session.activeOrganizationSlug}/settings`,
        request.url
      )
    )
  }

  // Unauthenticated users can only access public and auth routes
  if (
    !session &&
    !publicRoutes.includes(pathname) &&
    !authRoutes.includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url))
  }

  // Authenticated users without an organization must complete onboarding
  // before reaching any other protected route.
  if (
    session &&
    !session.session.activeOrganizationSlug &&
    pathname !== "/onboarding" &&
    !authRoutes.includes(pathname) &&
    !publicRoutes.includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
