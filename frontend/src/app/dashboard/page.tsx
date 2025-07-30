"use client";

import { useRouter } from "next/navigation";
import { useMeUserQuery } from "@/graphql/generated/graphql";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.push("/login");
    } else {
      setToken(t);
      setHasMounted(true);
    }
  }, []);

  const { data, loading, error } = useMeUserQuery({
    skip: !hasMounted || !token,
  });

  if (!hasMounted) return null;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const user = data?.meUser?.user;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-sm mb-4">Logged in as: {user?.email}</p>

      {user?.role === "venue" && (
        <div>
          <h2 className="text-xl font-semibold">Venue Dashboard</h2>
          <p>Venue: {user.linkedVenue?.name || "No venue linked yet"}</p>
        </div>
      )}

      {user?.role === "agent" && (
        <div>
          <h2 className="text-xl font-semibold">Agent Dashboard</h2>
          <p>Artist tools coming soon...</p>
        </div>
      )}

      <button
        className="mt-4 text-red-500 underline text-sm"
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
      >
        Log out
      </button>
    </div>
  );
}
