"use client";

import { useSession } from "next-auth/react";
import LogoutButton from "@/components/LogoutButton";

export default function ScholarDashboard() {
  const { data: session } = useSession();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Scholar Dashboard</h1>
      <p>
        Welcome, {session?.user?.name} ({session?.user?.email})
      </p>
      <LogoutButton />
    </div>
  );
}
