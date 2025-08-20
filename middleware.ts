import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Role-aware protection for /scholar/*, /admin/*, /supervisor/*
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Extract top-level segment as "role"
  const [, segment] = pathname.split("/");
  const roleSegment = segment as "scholar" | "admin" | "supervisor" | undefined;

  const protectedRoles = new Set(["scholar", "admin", "supervisor"]);
  if (!roleSegment || !protectedRoles.has(roleSegment)) {
    return NextResponse.next();
  }

  // Allow login pages for each role without session
  if (pathname === `/${roleSegment}/login`) {
    return NextResponse.next();
  }

  // Check session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no session, redirect to that role's login
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = `/${roleSegment}/login`;
    url.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(url);
  }

  // If logged in but role mismatch, send them to *their* dashboard
  if (token.role !== roleSegment) {
    const url = req.nextUrl.clone();
    url.pathname = `/${token.role}/dashboard`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Authorized
  return NextResponse.next();
}

export const config = {
  matcher: ["/scholar/:path*", "/admin/:path*", "/supervisor/:path*"],
};
