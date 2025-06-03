import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow API routes for auth and health check to pass through
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/health")) {
    return NextResponse.next()
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    // raw: true, // Use raw: true if you want to see the raw JWT
  })

  const isAuthPage = pathname === "/" // Assuming '/' is your login page

  if (isAuthPage) {
    if (token) {
      // If user is authenticated and tries to access login page, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    // Allow unauthenticated users to access login page
    return NextResponse.next()
  }

  // For all other protected routes
  if (!token) {
    // If user is not authenticated, redirect to login page
    const loginUrl = new URL("/", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname) // Optionally add callbackUrl
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated, allow access
  return NextResponse.next()
}

export const config = {
  // Match all routes except static files, _next, and specific public paths
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth|api/health).*)"],
}
