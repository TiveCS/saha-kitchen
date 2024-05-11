import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SignInResponseSchema, SignInSchema } from "@/schemas/auth.schema";
import { signInAction } from "@/actions/auth.action";
import { ORIGIN_URL } from "@/constants";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(data, request) {
        const originUrl = process.env.VERCEL_URL || process.env.AUTH_URL;
        const res = await fetch(`${originUrl}/api/auth/verify`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        });

        const responseData = await res.json();

        const user = SignInResponseSchema.parse(responseData);

        return { user };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: token.user,
      };
    },
  },
  pages: {
    signIn: "/login",
  },
});
