import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (!token) return NextResponse.redirect(new URL("/auth/login", req.url));

    const userType = token.userType as string;

    if (pathname.startsWith("/scholar") && userType !== "scholar") {
      return NextResponse.redirect(new URL(`/${userType}/dashboard`, req.url));
    }
    if (pathname.startsWith("/admin") && userType !== "admin") {
      return NextResponse.redirect(new URL(`/${userType}/dashboard`, req.url));
    }
    if (pathname.startsWith("/supervisor") && userType !== "supervisor") {
      return NextResponse.redirect(new URL(`/${userType}/dashboard`, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/scholar/:path*", "/admin/:path*", "/supervisor/:path*"],
};
