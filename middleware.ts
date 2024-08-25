import { NextRequest, NextResponse } from "next/server";

// Define las rutas públicas y privadas
const publicRoutes = ["/"];
const privateRoutes = ["/dashboard", "/profile"]; // Añade aquí las rutas privadas

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  
  const token = request.cookies.get("session-cookie")?.value;

  
  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  
  if (privateRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profile", "/"], // Asegúrate de incluir todas las rutas que deseas proteger o manejar
};
