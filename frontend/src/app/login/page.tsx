"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_API}/api/users/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for cookie-based auth
        body: JSON.stringify({ email, password }),
      }
    );

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data?.message || "Login failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
