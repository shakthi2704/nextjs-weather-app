// src/auth.config.ts
// Edge-safe config — no Prisma, no bcrypt, no Node.js modules
import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtected = nextUrl.pathname.startsWith("/dashboard")
      const isAuthRoute = ["/login", "/register"].some((p) =>
        nextUrl.pathname.startsWith(p),
      )

      if (isProtected && !isLoggedIn) return false
      if (isAuthRoute && isLoggedIn)
        return Response.redirect(new URL("/dashboard", nextUrl))

      return true
    },
  },
  providers: [], // filled in by the full auth.ts
}
