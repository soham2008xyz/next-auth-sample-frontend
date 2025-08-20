"use client";

import { useSession, signOut } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome {session?.user?.email}</p>
      <button onClick={() => signOut({ callbackUrl: "/admin/login" })}>
        Logout
      </button>
    </div>
  );
}
