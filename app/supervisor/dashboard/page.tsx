"use client";

import LogoutButton from "@/components/LogoutButton";

export default function SupervisorDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Supervisor Dashboard</h1>
      <LogoutButton userType="supervisor" />
    </div>
  );
}
