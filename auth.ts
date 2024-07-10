// ./auth.ts
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
// import credentials from "next-auth/providers/credentials";
import google from "next-auth/providers/google";
import db from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [google],
  adapter: DrizzleAdapter(db),
  pages: {
    signIn: "/login",
  },
});
