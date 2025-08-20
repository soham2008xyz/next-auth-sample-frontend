"use client";

import LogoutButton from "@/components/LogoutButton";

export default function ScholarDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Scholar Dashboard</h1>
      <LogoutButton userType="scholar" />
    </div>
  );
}
