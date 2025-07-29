"use client";

import { useGetVenuesQuery } from "@/graphql/generated/graphql";

export default function VenuesPage() {
  const { data, loading, error } = useGetVenuesQuery();

  if (loading) return <p>Loading venues...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Venues</h1>
      <ul className="space-y-4">
        {data?.Venues?.docs?.map((venue) => (
          <li key={venue.id} className="border rounded p-4">
            <h2 className="text-xl">{venue.name}</h2>
            <p>
              {venue.city} — Capacity: {venue.capacity}
            </p>
            <div>
              <strong>Available Dates:</strong>
              <ul>
                {venue.availableDates?.map((date, i) => (
                  <li key={i}>
                    {new Date(date?.date || "").toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
