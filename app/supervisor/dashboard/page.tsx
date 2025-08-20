"use client";

import { useSession, signOut } from "next-auth/react";

export default function SupervisorDashboard() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Supervisor Dashboard</h1>
      <p>Welcome {session?.user?.email}</p>
      <button onClick={() => signOut({ callbackUrl: "/supervisor/login" })}>
        Logout
      </button>
    </div>
  );
}
