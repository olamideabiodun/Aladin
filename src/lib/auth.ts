import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          return null;
        }

        const isMatch = await bcrypt.compare(credentials.password as string, user.password);

        if (isMatch) {
          return { id: user.id, name: user.email, email: user.email, role: user.role };
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user && 'role' in user) {
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      // Ensure session.user exists and is an object
      if (session.user) {
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
});