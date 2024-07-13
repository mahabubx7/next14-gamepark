import { comparePassword } from "$helpers/password";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import db, { users } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email Address", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, _req) {
        const { email, password } = credentials as Partial<
          Record<"email" | "password", string>
        >;

        if (!email || !password) throw new Error("Credentials are required!");

        try {
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

          if (!user || user.length === 0) throw new Error("User not found!");

          const verifyPassword = await comparePassword(
            user[0].password!,
            password
          );

          // console.log("verify: ", verifyPassword, user);

          if (!verifyPassword) throw new Error("Invalid credentials!");
          const { password: pwd, ...usr } = user[0]; // removes password from user object
          return usr; // returns => user object
        } catch (err) {
          console.error(err);
          throw err; // internal server error
        }
      },
    }),

    // GOOGLE OAuth 2.0
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      // redirectProxyUrl: process.env.AUTH_GOOGLE_REDIRECT_URL!,
    }),
  ],
  adapter: DrizzleAdapter(db),
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && account.type === "credentials") {
        token.userId = account.providerAccountId; // this is Id that coming from authorize() callback
      }
      // console.log("in_jwt: ", token);
      return token;
    },
    async session({ session, token, user }) {
      session.user.id = token.userId as string; //(3)
      // console.log("in_session: ", session);
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  // jwt: {},
  pages: {
    signIn: "/login",
  },
});
