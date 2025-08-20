"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

/**
 * Schedules a silent refresh ~1 minute before access token expiry
 */
export function useSilentRefresh() {
  const { data: session, update } = useSession();

  useEffect(() => {
    const exp = (session as any)?.accessTokenExpires as number | undefined;
    if (!exp) return;

    const msUntilRefresh = exp - Date.now() - 60_000; // refresh 1 minute early
    if (msUntilRefresh <= 0) {
      // already expired or close; try update immediately
      update().catch(() => {});
      return;
    }

    const t = setTimeout(() => {
      update().catch(() => {});
    }, msUntilRefresh);

    return () => clearTimeout(t);
  }, [session, update]);
}
