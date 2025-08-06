"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const handleChoice = (role: "agent" | "venue") => {
    router.push(`/auth/signup?role=${role}`);
  };

  return (
    <div>
      <h1>Welcome to Tour Manager</h1>
      <p>Are you an...</p>
      <button onClick={() => handleChoice("agent")}>Agent</button>
      <button onClick={() => handleChoice("venue")}>Venue Owner</button>
    </div>
  );
}
