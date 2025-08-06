"use client";
import { useAuth } from "@/app/_providers/Auth";
import VenueDashboard from "@/app/components/VenueDashboard";

export default function VenuePage() {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;
  if (user.role !== "venue") return <p>Access denied.</p>;

  return <VenueDashboard />;
}
