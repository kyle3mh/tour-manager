"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [venue, setVenue] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserAndVenue = async () => {
      try {
        const resUser = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_API}/api/users/me`,
          {
            credentials: "include",
          }
        );

        if (!resUser.ok) throw new Error("Not logged in");

        const userData = await resUser.json();
        setUser(userData);

        if (userData?.role === "venue" && userData?.linkedVenue) {
          const resVenue = await fetch(
            `${process.env.NEXT_PUBLIC_PAYLOAD_API}/api/venues/${userData.linkedVenue}`,
            { credentials: "include" }
          );

          if (!resVenue.ok) throw new Error("Could not load venue");

          const venueData = await resVenue.json();
          setVenue(venueData);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchUserAndVenue();
  }, []);

  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;
  if (!user) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}</h1>

      {user.role === "venue" && venue ? (
        <div>
          <h2 className="text-xl font-semibold">Your Venue</h2>
          <p>Name: {venue.name}</p>
          <p>City: {venue.city}</p>
          <p>Capacity: {venue.capacity}</p>

          <h3 className="mt-4 font-semibold">Available Dates:</h3>
          <ul className="list-disc ml-5">
            {venue.availableDates?.map((d: any) => (
              <li key={d.date}>{new Date(d.date).toDateString()}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-600">You’re not linked to a venue yet.</p>
      )}
    </div>
  );
}
