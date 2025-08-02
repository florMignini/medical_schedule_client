import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/introducing-medical-schedule"];
const privateRoutes = [
  "/professional/dashboard",
  "/professional/patients",
  "/professional/institutions",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("session-token")?.value;
  const isDemo = request.cookies.get("isDemo")?.value;

  console.log("🌐 Middleware :: Path:", pathname);
  console.log("🔑 Middleware :: Token presente?", Boolean(token));
  if (token) console.log("🧪 Token:", token);

  // demo mode
  if (isDemo || token ) {
    if (pathname === "/introducing-medical-schedule") {
      return NextResponse.redirect(new URL("/professional/dashboard", request.url));
    }
    return NextResponse.next();
  }
  // Evitar redireccionar si ya estamos en /dashboard
  if (
    publicRoutes.includes(pathname) &&
    token &&
    pathname !== "/professional/dashboard"
  ) {
    return NextResponse.redirect(
      new URL("/professional/dashboard", request.url)
    );
  }

  // Evitar redireccionar si ya estamos en /introducing...
  if (
    privateRoutes.includes(pathname) &&
    !token &&
    pathname !== "/introducing-medical-schedule"
  ) {
    return NextResponse.redirect(
      new URL("/introducing-medical-schedule", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/introducing-medical-schedule", "/professional/:path*"],
};
