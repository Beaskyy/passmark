import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token");
  const { pathname } = request.nextUrl;

  // Define paths that should be considered public (accessible without authentication)
  const publicPaths = ["/login", "/sign-up"];

  // Check if the current path is a public path
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // If the user is trying to access a protected path without an access token, redirect to login
  if (!isPublicPath && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If the user is authenticated and trying to access a public path, redirect to home
  if (isPublicPath && accessToken) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Specify the routes that the middleware should apply to.
  // This implicitly excludes static assets, _next/static, _next/image, and api routes.
  matcher: [
    "/", // Root path
    "/my-courses/:path*", // All subpaths under my-courses
    "/new-course/:path*", // All subpaths under new-course
    "/profile/:path*", // All subpaths under profile
    "/my-script/:path*", // All subpaths under my-script
    "/marked-scripts/:path*", // All subpaths under marked-scripts
    "/login", // Login page
    "/sign-up", // Sign-up page
  ],
};
