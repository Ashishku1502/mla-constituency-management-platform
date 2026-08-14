import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = nextUrl.pathname === "/forgot-password";
      
      const isPublicPage = nextUrl.pathname === "/" || isAuthPage;

      // If it's a dashboard route or other restricted operational sub-path
      const isRestricted = !isPublicPage && !nextUrl.pathname.startsWith("/api");

      if (isRestricted) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
      }
      return session;
    },
  },
  providers: [], // Configured inside src/auth.ts
} satisfies NextAuthConfig;
