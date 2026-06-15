import { auth } from "@workspace/auth/server"
import { NextRequest, NextResponse } from "next/server"
import type { Session } from "@workspace/auth/server"

const publicRoutes = ["/"]
const authRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/sign-out",
  "/auth/forgot-password",
  "/auth/reset-password",
]

export default async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Allow Better Auth API routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const hostname = request.headers.get("host") || ""
  console.log(hostname)

  const session = (await auth.api.getSession({
    headers: request.headers,
  })) as Session | null

  // Allow authenticated users to reach auth routes when adding a new account
  const isAddingAccount = searchParams.get("addAccount") === "true"

  // Authenticated users should not access auth routes — unless adding an account
  if (
    session &&
    !isAddingAccount &&
    authRoutes.some((route) => pathname === route)
  ) {
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

  // Authenticated users with NO organizations must complete onboarding
  if (
    session &&
    !session.session.activeOrganizationSlug &&
    session.organizations.length === 0 &&
    pathname !== "/onboarding" &&
    !authRoutes.includes(pathname) &&
    !publicRoutes.includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url))
  }

  // Authenticated users WITH organizations but no active one — fall back to first org
  if (
    session &&
    !session.session.activeOrganizationSlug &&
    session.organizations.length > 0 &&
    pathname !== "/project" &&
    !pathname.startsWith("/project/") &&
    pathname !== "/onboarding" &&
    !authRoutes.includes(pathname) &&
    !publicRoutes.includes(pathname)
  ) {
    return NextResponse.redirect(
      new URL(`/project/${session.organizations[0].slug}/settings`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
