"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_providers/Auth";

export default function DashboardIndex() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const roleRouteMap: Record<string, string> = {
      agent: "/dashboard/agent",
      venue: "/dashboard/venue",
    };
    const route = roleRouteMap[user.role];
    if (route) router.push(route);
  }, [user, router]);

  return <p>Redirecting...</p>;
}
