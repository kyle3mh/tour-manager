"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../_providers/Auth";

export default function AgentDashboard() {
    const { logout } = useAuth();
  const { user: contextUser } = useAuth();
  const [user, setUser] = useState<any>(contextUser);
  const [venues, setVenues] = useState<any[]>([]);
const [loadingVenues, setLoadingVenues] = useState(true);
    
// const handleLogout = async () => {
//   await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
//     method: "POST",
//     credentials: "include", 
//   });

//   // optional: clear local state or storage
//   localStorage.removeItem("token");

//   // redirect to login or home
//   window.location.href = "/login";
// };

  useEffect(() => {
    const fetchUser = async () => {
      if (!contextUser) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
          {
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      }
    };

    fetchUser();
  }, [contextUser]);

  // Fetch venues
  useEffect(() => {
    const fetchVenues = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/venues`
      );
      const data = await res.json();
      setVenues(data.docs || []);
      setLoadingVenues(false);
    };

    fetchVenues();
  }, []);

  if (!user) return <p>Loading user...</p>;

  console.log("User data:", user);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Agent Dashboard</h1>
      <p>Logged in as: {user.email}</p>
      <button onClick={logout}>Logout</button>
      <h2>Venues</h2>
      {loadingVenues ? (
        <p>Loading venues...</p>
      ) : (
        <ul>
          {venues.map((venue) => (
            <li key={venue.id}>
              <strong>{venue.name}</strong> — {venue.city}
              <br />
              Booked Dates:{" "}
              {venue.bookedDates
                ?.map((d: { date?: string }) => d.date?.substring(0, 10))
                .join(", ") || "None"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


