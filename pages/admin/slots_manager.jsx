// pages/admin/offline_dashboard.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

/**
 * Slots Manager - Structure only
 * - Date / city / center controls
 * - Grid of timeslots with book/unbook flow
 * - Replace fetchBookings/bookSlots with your API
 */

const SAMPLE_CITIES = ["Banaskatha", "Ahmedabad", "Surat"];
const SAMPLE_CENTERS = ["Center A", "Center B"];
const TIME_SLOTS = [
  "09:00 - 09:30","09:30 - 10:00","10:00 - 10:30","10:30 - 11:00",
  "11:00 - 11:30","11:30 - 12:00","12:00 - 12:30","12:30 - 13:00",
];

async function fetchBookings({ date, city, center }) {
  // Replace: GET /api/admin/getAppointments?...
  await new Promise((r) => setTimeout(r, 250));
  // sample few booked slots
  return [
    { time: TIME_SLOTS[1], slot: "Slot 1", fullName: "Test A" },
    { time: TIME_SLOTS[3], slot: "Slot 2", fullName: "Test B" },
  ];
}
async function postBookSlots(payload) {
  // Replace: POST /api/admin/bookSlot
  await new Promise((r) => setTimeout(r, 300));
  return { ok: true };
}

export default function SlotsManager() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [city, setCity] = useState("");
  const [center, setCenter] = useState("");
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState([]); // {time, slot}
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const abortRef = useRef(null);

  const load = useCallback(async () => {
    if (!city || !center || !date) {
      setBookings([]);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchBookings({ date, city, center });
      setBookings(data || []);
    } catch (err) {
      console.error(err);
      setToast("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [date, city, center]);

  useEffect(() => {
    load();
    return () => {
      if (abortRef.current) abortRef.current.abort?.();
    };
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const bookedMap = useMemo(() => {
    const m = new Map();
    (bookings || []).forEach((b) => m.set(`${b.time}__${b.slot}`, b));
    return m;
  }, [bookings]);

  function toggle(time, slot) {
    const key = `${time}__${slot}`;
    if (bookedMap.has(key)) return;
    setSelected((prev) => {
      const exists = prev.find((p) => p.time === time && p.slot === slot);
      if (exists) return prev.filter((p) => !(p.time === time && p.slot === slot));
      return [...prev, { time, slot }];
    });
  }

  async function confirmBooking() {
    if (!city || !center) {
      setToast("Choose city and center");
      return;
    }
    if (!selected.length) {
      setToast("Select at least one slot");
      return;
    }
    // optimistic add
    const optimistic = selected.map((s) => ({ ...s, fullName: "Booked (you)" }));
    setBookings((b) => [...b, ...optimistic]);
    setSelected([]);
    setToast("Booking...");

    try {
      await postBookSlots({ date, city, center, slots: optimistic });
      setToast("Booked successfully");
      await load(); // refresh canonical data
    } catch (err) {
      setToast("Booking failed");
      setBookings((b) => b.filter((x) => !x.fullName?.includes("(you)")));
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Slots Manager</h1>
            <p className="text-sm text-gray-600">Book and manage offline slots</p>
          </div>
          <Link href="/admin/admin_dashboard"><a className="text-sm text-blue-600">Back to Dashboard</a></Link>
        </header>

        <section className="bg-white p-4 rounded shadow mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm text-gray-600">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 p-2 border rounded w-full" />
            </div>

            <div>
              <label className="block text-sm text-gray-600">City</label>
              <select value={city} onChange={(e) => { setCity(e.target.value); setCenter(""); }} className="mt-1 p-2 border rounded w-full">
                <option value="">Choose city</option>
                {SAMPLE_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600">Center</label>
              <select value={center} onChange={(e) => setCenter(e.target.value)} className="mt-1 p-2 border rounded w-full" disabled={!city}>
                <option value="">Choose center</option>
                {SAMPLE_CENTERS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button onClick={load} disabled={loading} className="px-3 py-2 bg-blue-600 text-white rounded">Refresh</button>
              <button onClick={() => { setSelected([]); setBookings([]); }} className="px-3 py-2 bg-gray-200 rounded">Reset</button>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Available Slots</h2>
            <div className="text-sm text-gray-500">
              {loading ? "Loading..." : `${bookings.length} booked • ${selected.length} selected`}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIME_SLOTS.map((time) => (
              <div key={time} className="bg-white p-4 rounded shadow">
                <div className="font-medium">{time}</div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {["Slot 1", "Slot 2"].map((slot) => {
                    const key = `${time}__${slot}`;
                    const booked = bookedMap.has(key);
                    const sel = selected.find((s) => s.time === time && s.slot === slot);
                    const base = "px-3 py-2 rounded text-sm focus:outline-none";
                    return (
                      <button
                        key={slot}
                        onClick={() => toggle(time, slot)}
                        disabled={booked}
                        className={`${base} ${booked ? "bg-red-500 text-white cursor-not-allowed" : sel ? "bg-blue-600 text-white" : "bg-green-600 text-white hover:bg-green-500"}`}
                        aria-pressed={!!sel}
                        aria-disabled={booked}
                      >
                        {slot}{booked ? " (Booked)" : sel ? " (Selected)" : ""}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 text-xs text-gray-500">{time} — {["Slot 1", "Slot 2"].filter(s => bookedMap.has(`${time}__${s}`)).length}/2 booked</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={confirmBooking}>Confirm Booking</button>
            <button onClick={() => setSelected([])} className="px-4 py-2 bg-gray-200 rounded">Clear Selection</button>
          </div>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Booked Preview</h3>
          {bookings.length === 0 ? (
            <div className="text-sm text-gray-500">No bookings found</div>
          ) : (
            <ul className="divide-y">
              {bookings.map((b, i) => (
                <li key={i} className="py-2 flex justify-between">
                  <div>
                    <div className="font-medium">{b.fullName ?? "—"}</div>
                    <div className="text-xs text-gray-500">{b.time} • {b.slot}</div>
                  </div>
                  <div className="text-xs text-gray-400">{b.createdAt ? new Date(b.createdAt).toLocaleString() : ""}</div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {toast && <div className="fixed right-6 bottom-6 bg-gray-900 text-white px-4 py-2 rounded">{toast}</div>}
      </div>
    </div>
  );
}
