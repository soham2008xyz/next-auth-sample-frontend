"use client";

import { signOut, useSession } from "next-auth/react";
import { api } from "@/lib/api";

export default function LogoutButton() {
    const { data: session } = useSession();
    const role = session?.user?.role ?? "scholar";

    const onLogout = async () => {
        try {
            if (session?.refreshToken && session?.accessToken) {
                await api.post(
                    `/${role}/logout`,
                    { refresh_token: session.refreshToken },
                    {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    }
                );
            }
        } catch (e) {
            console.error("Logout error (ignored):", e);
        } finally {
            await signOut({ callbackUrl: `/${role}/login` });
        }
    };

    return (
        <button
            onClick={onLogout}
            className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
        >
            Logout
        </button>
    );
}
