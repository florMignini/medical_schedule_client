import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/"];
const privateRoutes = ["/professional", "/professional/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get("session-cookie")?.value;

if (publicRoutes.includes(pathname) && token) {
  return NextResponse.redirect(new URL("/professional", request.url));
}

if (privateRoutes.includes(pathname) && !token) {
  return NextResponse.redirect(new URL("/", request.url));
}

  
  return NextResponse.next();
}

export const config = {
  matcher: ["/professional", "/professional/dashboard", "/"],
};
