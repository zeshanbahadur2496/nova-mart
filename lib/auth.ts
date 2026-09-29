import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";

import { isDatabaseError, withAuthDb } from "@/lib/auth-db";
import { isLocalAuthEnabled, verifyLocalUser } from "@/lib/local-auth-store";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google-client-secret",
      allowDangerousEmailAccountLinking: true
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "github-client-id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "github-client-secret",
      allowDangerousEmailAccountLinking: true
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const parsed = credentialsSchema.safeParse(credentials);

          if (!parsed.success) {
            return null;
          }

          try {
            const user = await withAuthDb(() =>
              prisma.user.findUnique({
                where: { email: parsed.data.email }
              })
            );

            if (user?.password) {
              const isValid = await bcrypt.compare(parsed.data.password, user.password);
              if (isValid) {
                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  image: user.image,
                  role: user.role,
                  isPrime: user.isPrime && (!user.primeExpiresAt || user.primeExpiresAt > new Date())
                };
              }
            }
          } catch (error) {
            if (!isLocalAuthEnabled() || !isDatabaseError(error)) {
              throw error;
            }
          }

          if (isLocalAuthEnabled()) {
            const localUser = await verifyLocalUser(parsed.data.email, parsed.data.password);
            if (localUser) {
              return {
                id: localUser.id,
                name: localUser.name,
                email: localUser.email,
                image: null,
                role: localUser.role,
                isPrime: localUser.isPrime
              };
            }
          }

          return null;
        } catch (error) {
          console.error("CREDENTIALS_AUTH_ERROR", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "USER";
        token.isPrime = Boolean((user as { isPrime?: boolean }).isPrime);
      }

      if (token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { id: true, role: true, isPrime: true, primeExpiresAt: true }
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role ?? "USER";
            token.isPrime =
              dbUser.isPrime && (!dbUser.primeExpiresAt || dbUser.primeExpiresAt > new Date());
          }
        } catch (error) {
          console.error("JWT_USER_LOOKUP_ERROR", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.role = String(token.role ?? "USER");
        session.user.isPrime = Boolean(token.isPrime);
      }

      return session;
    }
  }
};
