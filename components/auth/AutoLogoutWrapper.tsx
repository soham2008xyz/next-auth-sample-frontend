"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function AutoLogoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshTokenExpired") {
      // Send user to their own role's login page
      const role = session.user?.role || "scholar";
      signOut({ callbackUrl: `/${role}/login` });
    }
  }, [session]);

  return <>{children}</>;
}
