import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/users",
  "/modules",
  "/roles",
  "/notifications",
  "/settings",
  "/reports",
  "/inventory",
  "/orders",
  "/payments",
  "/profile",
  "/test-protected",
];

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/401",
  "/404",
  "/500",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route),
  );

  // Get authentication tokens from cookies or headers
  const authToken =
    request.cookies.get("authToken")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  const refreshToken = request.cookies.get("refreshToken")?.value;

  // If accessing a protected route without authentication
  if (isProtectedRoute && !authToken) {
    // Redirect to login page with return URL
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing login/register while already authenticated
  if (
    (pathname === "/" || pathname === "/login" || pathname === "/register") &&
    authToken
  ) {
    // Check if we have a valid redirect URL
    const redirectUrl = request.nextUrl.searchParams.get("redirect");
    if (
      redirectUrl &&
      protectedRoutes.some((route) => redirectUrl.startsWith(route))
    ) {
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    // Default redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If accessing public routes, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For any other routes, check authentication
  if (!authToken) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
