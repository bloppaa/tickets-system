import withAuth, { NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/unauthorized", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/user") &&
      req.nextauth.token?.role !== "user"
    ) {
      return NextResponse.rewrite(new URL("/unauthorized", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/client") &&
      req.nextauth.token?.role !== "client"
    ) {
      return NextResponse.rewrite(new URL("/unauthorized", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/", "/admin(.*)", "/user(.*)", "/client(.*)"],
};
