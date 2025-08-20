"use client";

import LogoutButton from "@/components/LogoutButton";

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <LogoutButton userType="admin" />
    </div>
  );
}
