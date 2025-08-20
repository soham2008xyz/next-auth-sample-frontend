import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { BackendUser, UserType } from "@/types/auth";
import { ApiResponse } from "@/types/api";

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${token.userType}/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: token.refreshToken }),
      }
    );

    if (!res.ok) throw new Error("Failed to refresh token");

    const result: ApiResponse<RefreshResponse> = await res.json();
    if (!result.success || !result.data)
      throw new Error("Invalid refresh response");

    return {
      ...token,
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
      expiresAt: result.data.expiresAt,
    };
  } catch (e) {
    console.error("RefreshAccessTokenError", e);
    return { ...token, error: "RefreshAccessTokenError" as const };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    ...(["scholar", "admin", "supervisor"] as UserType[]).map((userType) =>
      CredentialsProvider({
        id: userType,
        name: userType[0].toUpperCase() + userType.slice(1),
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials): Promise<BackendUser | null> {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/${userType}/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            }
          );

          if (!res.ok) return null;

          const result: ApiResponse<BackendUser> = await res.json();
          if (!result.success || !result.data) return null;

          return result.data;
        },
      })
    ),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        const backendUser = user as BackendUser;
        token.id = backendUser.id;
        token.userType = backendUser.userType;
        token.accessToken = backendUser.accessToken;
        token.refreshToken = backendUser.refreshToken;
        token.expiresAt = backendUser.expiresAt;
        return token;
      }

      if (Date.now() < (token.expiresAt as number)) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string | number,
        email: token.email as string,
        userType: token.userType as UserType,
        accessToken: token.accessToken as string,
      };
      session.error = token.error as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // fallback
  },
};
