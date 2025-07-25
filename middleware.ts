import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/","/introducing-medical-schedule"];
const privateRoutes = ["/professional/dashboard", "/professional/patients", "/professional/institutions"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get("session-token")?.value;

if (publicRoutes.includes(pathname) && token) {
  return NextResponse.redirect(new URL("/professional/dashboard", request.url));
}

if (privateRoutes.includes(pathname) && !token) {
  return NextResponse.redirect(new URL("/introducing-medical-schedule", request.url));
}

  
  return NextResponse.next();
}

export const config = {
  matcher: ["/professional/dashboard", "/professional/patients", "/professional/institutions"],
};
