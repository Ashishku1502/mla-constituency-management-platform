import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;
  
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isPublicRoute = pathname === '/' || pathname.startsWith('/api/auth');
  
  if (isAuthPage) {
    if (isLoggedIn) {
      return Response.redirect(new URL('/dashboard', req.nextUrl));
    }
    return null;
  }
  
  if (!isLoggedIn && !isPublicRoute && !pathname.startsWith('/api')) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }
  
  return null;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.png|favicon.ico).*)"],
};
