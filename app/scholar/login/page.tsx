"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function ScholarLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      role: "scholar",
      remember,
      callbackUrl: "/scholar/dashboard",
      redirect: true,
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow"
      >
        <h1 className="text-xl font-semibold mb-4">Scholar Login</h1>
        <input
          className="w-full border rounded p-2 mb-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded p-2 mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Remember me
        </label>
        <button className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700">
          Login
        </button>
      </form>
    </main>
  );
}
