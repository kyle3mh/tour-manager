"use client";

import { useState, useEffect } from "react";
import {
  useMeAndVenueQuery,
  useUpdateVenueMutation,
} from "@/graphql/generated/graphql";

export default function DashboardPage() {
  const { data, loading, error } = useMeAndVenueQuery();
  const [updateVenue] = useUpdateVenueMutation();
  const [dates, setDates] = useState<string[]>([]);
  const [newDate, setNewDate] = useState("");

  const venue = data?.meUser?.user?.linkedVenue;

  // sync GraphQL data to local state
  useEffect(() => {
    if (venue?.bookedDates) {
      setDates(venue.bookedDates.map((d) => d?.date ?? "").filter(Boolean));
    }
  }, [venue]);

  if (loading) return <p>Loading...</p>;
  if (error || !venue) return <p>Error loading venue.</p>;

  const handleAddDate = () => {
    if (newDate && !dates.includes(newDate)) {
      setDates([...dates, newDate]);
      setNewDate("");
    }
  };

  const handleRemoveDate = (dateToRemove: string) => {
    setDates(dates.filter((d) => d !== dateToRemove));
  };

  const handleSave = async () => {
    await updateVenue({
      variables: {
        id: venue.id,
        data: {
          bookedDates: dates.map((date) => ({ date })),
        },
      },
    });
    alert("Saved!");
  };

  return (
    <div>
      <h2>{venue.name} — Booked Dates</h2>

      <ul>
        {dates.map((date) => (
          <li key={date}>
            {date}{" "}
            <button onClick={() => handleRemoveDate(date)}>Remove</button>
          </li>
        ))}
      </ul>

      <input
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
      />
      <button onClick={handleAddDate}>Add Date</button>

      <br />
      <br />
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
}
