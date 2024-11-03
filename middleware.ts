import withAuth, { NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const url = req.nextUrl.clone();
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", url.pathname);

    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token?.role !== "Admin"
    ) {
      return NextResponse.rewrite(new URL("/unauthorized", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/user") &&
      req.nextauth.token?.role !== "User"
    ) {
      return NextResponse.rewrite(new URL("/unauthorized", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/client") &&
      req.nextauth.token?.role !== "Client"
    ) {
      return NextResponse.rewrite(new URL("/unauthorized", req.url));
    }

    if (!req.nextauth.token) {
      return NextResponse.redirect(loginUrl);
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
