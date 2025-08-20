"use client";

import { useSession, signOut } from "next-auth/react";

export default function ScholarDashboard() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Scholar Dashboard</h1>
      <p>Welcome {session?.user?.email}</p>
      <button onClick={() => signOut({ callbackUrl: "/scholar/login" })}>
        Logout
      </button>
    </div>
  );
}
