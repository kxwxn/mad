import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        return credentials?.email === "admin@example.com" && credentials.password === "adminpass" 
          ? { id: "1", email: credentials.email, role: "admin" } 
          : null;
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: { signIn: '/admin' }
};