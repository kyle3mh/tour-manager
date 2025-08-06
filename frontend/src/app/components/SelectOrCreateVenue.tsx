"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_providers/Auth";

interface Venue {
  id: string;
  name: string;
  city: string;
}

export default function SelectOrCreateVenue() {
  const { user, refetchUser } = useAuth(); 
  const router = useRouter();

  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [newVenue, setNewVenue] = useState({
    name: "",
    city: "",
    capacity: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingVenues, setFetchingVenues] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const fetchVenues = async () => {
    setFetchingVenues(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/venues`);
      const data = await res.json();
      setVenues(data?.docs || []);
    } catch {
      setError("Failed to fetch venues.");
    } finally {
      setFetchingVenues(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const linkVenueToUser = async (venueId: string) => {
    const res = await fetch(`${SERVER_URL}/api/users/${user?.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkedVenue: venueId }),
    });

    if (!res.ok) throw new Error("Failed to link venue");
  };

  const handleSelect = async () => {
    if (!selectedVenueId || !user?.id) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await linkVenueToUser(selectedVenueId);
      await refetchUser(); // ✅ update user context
      router.push("/dashboard/venue");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    const { name, city, capacity, address } = newVenue;
    if (!name || !city || !capacity || !address) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const venueRes = await fetch(`${SERVER_URL}/api/venues`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVenue),
      });

      if (!venueRes.ok) throw new Error("Venue creation failed");

      const createdVenue = await venueRes.json();
      const venueId = createdVenue.id || createdVenue.doc?.id;

      if (!venueId) throw new Error("Failed to get new venue ID");

      await linkVenueToUser(venueId);
      await refetchUser(); // ✅ update user context

      setNewVenue({ name: "", city: "", capacity: "", address: "" });
      router.push("/dashboard/venue");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "venue") return <p>Access denied.</p>;

  return (
    <div className="p-8">
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      {/* Select Existing Venue */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">Select Existing Venue</h2>

        <select
          value={selectedVenueId}
          onChange={(e) => setSelectedVenueId(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
          disabled={loading || fetchingVenues}
        >
          <option value="">-- Choose a venue --</option>
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name} — {venue.city}
            </option>
          ))}
        </select>

        <button
          onClick={handleSelect}
          disabled={!selectedVenueId || loading}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          {loading ? "Linking..." : "Link Venue"}
        </button>
      </section>

      <hr className="my-6" />

      {/* Create New Venue */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">Or Create New Venue</h2>

        <div className="space-y-2 max-w-md">
          <input
            placeholder="Name"
            value={newVenue.name}
            onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
            className="border p-2 w-full rounded"
            disabled={loading}
          />
          <input
            placeholder="City"
            value={newVenue.city}
            onChange={(e) => setNewVenue({ ...newVenue, city: e.target.value })}
            className="border p-2 w-full rounded"
            disabled={loading}
          />
          <input
            placeholder="Capacity"
            type="number"
            value={newVenue.capacity}
            onChange={(e) =>
              setNewVenue({ ...newVenue, capacity: e.target.value })
            }
            className="border p-2 w-full rounded"
            disabled={loading}
          />
          <input
            placeholder="Address"
            value={newVenue.address}
            onChange={(e) =>
              setNewVenue({ ...newVenue, address: e.target.value })
            }
            className="border p-2 w-full rounded"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded mt-3"
        >
          {loading ? "Creating..." : "Create & Link Venue"}
        </button>
      </section>
    </div>
  );
}
