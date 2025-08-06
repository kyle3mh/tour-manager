"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      setToken(existingToken);
      fetchMe(existingToken);
    }
  }, []);

  const handleLogin = async () => {
    setError(null);
    const res = await fetch("http://localhost:3001/api/users/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Login failed");
      return;
    }

    const data = await res.json();
    const token = data.token;
    if (token) {
      localStorage.setItem("token", token);
      setToken(token);
      fetchMe(token);
    }
  };

const fetchMe = async (jwt: string) => {
  const res = await fetch("http://localhost:3000/api/users/me", {
    headers: {
      Authorization: `JWT ${jwt}`,
    },
  });

  const data = await res.json();
  console.log("me data", data);
  if (res.ok) {
    setUser(data.user);
  } else {
    setUser(null);
    console.error("Error fetching /me", res.status);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  if (token && user) {
    return (
      <div>
        <p>Logged in as: {user.email}</p>
        <button onClick={handleLogout}>Log out</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
