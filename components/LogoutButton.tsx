"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton({
  userType,
}: {
  userType: "scholar" | "admin" | "supervisor";
}) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: `/${userType}/login` })}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
    >
      Logout
    </button>
  );
}
