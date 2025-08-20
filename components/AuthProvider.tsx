"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import AutoLogoutWrapper from "@/components/auth/AutoLogoutWrapper";
import { useSilentRefresh } from "@/components/auth/useSilentRefresh";

function AuthEffects() {
  useSilentRefresh();
  return null;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthEffects />
      <AutoLogoutWrapper>{children}</AutoLogoutWrapper>
    </SessionProvider>
  );
}
