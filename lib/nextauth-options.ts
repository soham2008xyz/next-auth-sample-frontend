import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/lib/api";

type Role = "scholar" | "admin" | "supervisor";

async function refreshAccessToken(token: any) {
  try {
    const res = await api.post(`/${token.role}/refresh`, {
      refresh_token: token.refreshToken,
    });

    const { access_token, expires_in } = res.data;

    return {
      ...token,
      accessToken: access_token,
      accessTokenExpires: Date.now() + expires_in * 1000,
      // keep the same refresh token (backend issues only a new access token)
      error: undefined,
    };
  } catch (err) {
    console.error("Refresh failed", err);
    return {
      ...token,
      accessToken: undefined,
      accessTokenExpires: 0,
      error: "RefreshTokenExpired",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }, // "scholar" | "admin" | "supervisor"
        remember: { label: "Remember Me", type: "checkbox" },
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          !credentials?.role
        ) {
          return null;
        }
        const role = credentials.role as Role;

        const res = await api.post(`/${role}/login`, {
          email: credentials.email,
          password: credentials.password,
          remember_me: credentials.remember === "on",
        });

        const data = res.data;
        if (!data?.access_token || !data?.refresh_token || !data?.user)
          return null;

        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          accessTokenExpires: Date.now() + (data.expires_in ?? 3600) * 1000,
        } as any;
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in
      if (user) {
        token.id = (user as any).id;
        token.name = (user as any).name;
        token.email = (user as any).email;
        token.role = (user as any).role as Role;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.accessTokenExpires = (user as any).accessTokenExpires as number;
        token.error = undefined;
        return token;
      }

      // If we have a valid access token, return it
      if (
        token.accessToken &&
        Date.now() < (token.accessTokenExpires as number)
      ) {
        return token;
      }

      // Otherwise, try to refresh
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as Role,
      };
      (session as any).accessToken = token.accessToken;
      (session as any).refreshToken = token.refreshToken;
      (session as any).accessTokenExpires = token.accessTokenExpires;
      (session as any).error = token.error;
      return session;
    },
  },

  events: {
    // Ensure logout is scoped to the user's role on the backend
    async signOut({ token }) {
      try {
        if (token?.role && token?.refreshToken && token?.accessToken) {
          await api.post(
            `/${token.role}/logout`,
            { refresh_token: token.refreshToken },
            { headers: { Authorization: `Bearer ${token.accessToken}` } }
          );
        }
      } catch (e) {
        console.error("Backend logout failed (ignored):", e);
      }
    },
  },

  pages: {
    signIn: "/scholar/login", // default if middleware can't infer role
  },

  secret: process.env.NEXTAUTH_SECRET,
};
