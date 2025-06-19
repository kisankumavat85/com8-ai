import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/account"];
const publicRoutes = ["/", "/login"];

export const middleware = async (request: NextRequest) => {
  const sessionId = cookies().get("session-id")?.value;
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isProtectedRoute && !sessionId) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isPublicRoute && sessionId && !pathname.startsWith("/account")) {
    return NextResponse.redirect(new URL("/account", request.nextUrl));
  }

  return NextResponse.next();
};

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
