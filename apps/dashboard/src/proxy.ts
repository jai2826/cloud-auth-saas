import { auth } from "@workspace/auth/server"
import { NextRequest, NextResponse } from "next/server"

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

  const session = await auth.api.getSession({
    headers: request.headers,
  })

  console.log("SESSION", session)
  console.log("PATH", pathname)
  console.log(request.cookies.getAll())
  console.log(request.cookies.get("better-auth.session_token"))

  // Authenticated users should not access auth routes
  if (session && authRoutes.some((route) => pathname === route)) {
    // if (session.session.activeOrganizationId)
    //   return NextResponse.redirect(
    //     new URL(
    //       `/projects/${session.session.activeOrganizationId}/dashboard`,
    //       request.url
    //     )
    //   )
    return NextResponse.redirect(new URL("/projects", request.url))
  }

  // Unauthenticated users can only access public and auth routes
  if (
    !session &&
    !publicRoutes.includes(pathname) &&
    !authRoutes.includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
