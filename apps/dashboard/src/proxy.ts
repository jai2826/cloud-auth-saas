import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/"];
const authRoutes = ["/auth/signin", "/auth/signup"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow better-auth API routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Authenticated users should not access auth routes
  if (session && authRoutes.some((route) => pathname === route)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated users can only access public and auth routes
  if (
    !session &&
    !publicRoutes.includes(pathname) &&
    !authRoutes.includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};