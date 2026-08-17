import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. If trying to access protected routes without a token, redirect to /auth/login
  if (!token && pathname.startsWith("/my-list")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 2. Optional: If user is ALREADY logged in and visits login/register, send them to /my-list
  if (token && (pathname === "/auth/login" || pathname === "/auth/register")) {
    return NextResponse.redirect(new URL("/my-list", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/my-list", "/my-list/:path*", "/auth/login", "/auth/register"],
};
