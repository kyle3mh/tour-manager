"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const params = useSearchParams();
  const role = params.get("role") || "agent";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");

    try {
      // 1. Create the user
      const signupRes = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!signupRes.ok) {
        const { message } = await signupRes.json();
        setError(message || "Signup failed.");
        return;
      }

      // 2. Login the user
      const loginRes = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        const { message } = await loginRes.json();
        setError(message || "Login failed after signup.");
        return;
      }

      router.push(role === "venue" ? "/dashboard/venue" : "/dashboard/agent");
    } catch (err) {
      setError("Unexpected error. Please try again.");
    }
  };

  return (
    <div>
      <h2>Sign up as {role}</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />
      <input
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <button onClick={handleSignup}>Sign Up</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
