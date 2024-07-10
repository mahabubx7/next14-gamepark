import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req: any) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET!,
    salt: process.env.AUTH_SECRET!,
  });

  const { pathname } = req.nextUrl;

  // Allow the requests if the following is true...
  // 1) It's a request for next-auth session & provider fetching
  // 2) the token exists

  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  // Redirect to login if they don't have token AND are requesting a protected route
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
