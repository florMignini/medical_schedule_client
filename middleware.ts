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
console.log("🔑 Token:", token);
console.log("👤 Is Demo:", isDemo);
  // Verificamos si el usuario está autenticado
  const isAuthenticated = Boolean(token) || Boolean(isDemo);
  const isPublicRoute = publicRoutes.includes(pathname);
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  console.log("🌐 Path:", pathname);
  console.log("🔐 Authenticated:", isAuthenticated);

  // Si está autenticado y entra a una ruta pública, redirigimos al dashboard
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(
      new URL("/professional/dashboard", request.url)
    );
  }

  // Si NO está autenticado y entra a una ruta privada, redirigimos a introducing
  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(
      new URL("/introducing-medical-schedule", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/introducing-medical-schedule", "/professional/:path*"],
};
