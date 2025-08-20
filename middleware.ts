// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/", "/favicon.ico"];

/**
 * Middleware to enforce role-based route access
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static/public files
  if (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Get session token (decoded JWT)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no token and trying to access a protected path → redirect
  if (!token) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if (pathname.startsWith("/supervisor")) {
      return NextResponse.redirect(new URL("/supervisor/login", req.url));
    }
    if (pathname.startsWith("/scholar")) {
      return NextResponse.redirect(new URL("/scholar/login", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  const userType = token.userType as string;

  // Scholars should only access /scholar/*
  if (userType === "scholar" && !pathname.startsWith("/scholar")) {
    return NextResponse.redirect(new URL("/scholar/dashboard", req.url));
  }

  // Admins should only access /admin/*
  if (userType === "admin" && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // Supervisors should only access /supervisor/*
  if (userType === "supervisor" && !pathname.startsWith("/supervisor")) {
    return NextResponse.redirect(new URL("/supervisor/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // protect all routes except static assets
  ],
};
