"use client";

import { useAuth } from "@/app/_providers/Auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SelectOrCreateVenue from "./SelectOrCreateVenue";

export default function VenueDashboard() {
   
    const { user, refetchUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUnlink = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ linkedVenue: null }),
        }
      );

        if (!res.ok) throw new Error("Failed to unlink venue");
        await refetchUser();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
  };

  if (!user || user.role !== "venue") return <p>Access denied.</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Venue Dashboard</h1>
      <p>Welcome, {user.email}</p>

      {user.linkedVenue ? (
        <>
          <div className="my-6">
            <p>
              <strong>Linked Venue:</strong> {user.linkedVenue.name}
            </p>
          </div>

          {error && <p className="text-red-600 mb-2">{error}</p>}

          <div className="space-x-4">
            <button
              onClick={handleUnlink}
              disabled={loading}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              {loading ? "Unlinking..." : "Unlink Venue"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <SelectOrCreateVenue />
      )}
    </div>
  );
}
