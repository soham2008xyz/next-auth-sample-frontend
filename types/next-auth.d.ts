import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string | number;
      name: string | null;
      email: string | null;
      role: "scholar" | "admin" | "supervisor";
    } & DefaultSession["user"];
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }

  interface User {
    role: "scholar" | "admin" | "supervisor";
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string | number;
    role?: "scholar" | "admin" | "supervisor";
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
