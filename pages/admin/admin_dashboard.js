// pages/admin/admin_dashboard.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Import new components
import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";

function Spinner() {
  return (
    <span className="animate-spin inline-block w-4 h-4 border-2 border-current rounded-full" />
  );
}

/* ---------- REAL API ---------- */
async function fetchAppointments({ date, slot }) {
  try {
    const response = await fetch(`/api/admin/appointments`);
    if (!response.ok) {
      throw new Error("Failed to fetch appointments");
    }
    const data = await response.json();

    // Transform appointments to match expected format
    const appointments = (data.appointments || []).map((apt, i) => ({
      id: apt._id || `A-${i + 1}`,
      fullName: apt.fullName,
      formId: apt._id ? apt._id.toString() : `FORM-${1000 + i}`,
      slot: apt.appointmentSlot || "N/A",
      timeInterval: apt.appointmentSlot || "N/A",
      status: apt.status || "pending",
      createdAt: apt.createdAt || new Date().toISOString(),
      email: apt.email,
      phone: apt.phone,
      aadhaarNumber: apt.aadhaarNumber,
    }));

    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

async function patchAppointmentStatus(id, status) {
  try {
    const response = await fetch(`/api/admin/appointments`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
}
/* ---------- end REAL API ---------- */

export default function AdminDashboard() {
  const [date, setDate] = useState("");
  const [slotFilter, setSlotFilter] = useState("");
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("time");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchErr, setFetchErr] = useState("");
  const perPage = 8;
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const fetchRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setFetchErr("");
    if (fetchRef.current) clearTimeout(fetchRef.current);

    fetchRef.current = setTimeout(async () => {
      try {
        const data = await fetchAppointments({ date, slot: slotFilter });
        if (!active) return;
        setItems(data);
      } catch (err) {
        setFetchErr(String(err));
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      active = false;
      if (fetchRef.current) clearTimeout(fetchRef.current);
    };
  }, [date, slotFilter]);

  const filtered = useMemo(() => {
    let arr = items.slice();
    if (q.trim()) {
      const x = q.trim().toLowerCase();
      arr = arr.filter(
        (a) =>
          (a.fullName || "").toLowerCase().includes(x) ||
          (a.formId || "").toLowerCase().includes(x) ||
          (a.slot || "").toLowerCase().includes(x)
      );
    }
    if (sortBy === "name")
      arr.sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
    if (sortBy === "status")
      arr.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
    return arr;
  }, [items, q, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  async function markDone(id) {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "done" } : p))
    );
    try {
      await patchAppointmentStatus(id, "done");
    } catch (err) {
      console.warn(err);
    }
  }

  async function cancelAppointment(id) {
    if (!confirm("Cancel this appointment?")) return;
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "cancelled" } : p))
    );
    try {
      await patchAppointmentStatus(id, "cancelled");
    } catch (err) {
      console.warn(err);
    }
  }

  function exportCSV() {
    const rows = [
      ["Form ID", "Name", "Slot", "Time", "Status", "Created At"],
      ...filtered.map((r) => [
        r.formId,
        r.fullName,
        r.slot,
        r.timeInterval,
        r.status,
        r.createdAt,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((c) => `"${String(c ?? "")}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments_${date || "all"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    // Added flex-col and min-h-screen so footer sits at bottom
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 1. New Header Component */}
      <AdminHeader onExport={exportCSV} />

      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <section className="bg-white p-4 rounded shadow mb-4 border-t-4 border-blue-600">
            <div className="flex flex-col md:flex-row md:items-end gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">
                  Slot
                </label>
                <select
                  value={slotFilter}
                  onChange={(e) => setSlotFilter(e.target.value)}
                  className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase">
                  Search
                </label>
                <input
                  placeholder="Search name, ID..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">
                  Sort
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="time">Time</option>
                  <option value="name">Name</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </section>

          {/* Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
              <div className="text-sm text-gray-500">Total Appointments</div>
              <div className="text-2xl font-bold text-gray-800">
                {filtered.length}
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
              <div className="text-sm text-gray-500">Completed</div>
              <div className="text-2xl font-bold text-gray-800">
                {filtered.filter((x) => x.status === "done").length}
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow border-l-4 border-red-500">
              <div className="text-sm text-gray-500">Cancelled</div>
              <div className="text-2xl font-bold text-gray-800">
                {filtered.filter((x) => x.status === "cancelled").length}
              </div>
            </div>
          </section>

          {/* List */}
          <section className="bg-white rounded shadow overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <div className="font-semibold text-gray-700">
                Appointment List
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {loading ? (
                  <>
                    <Spinner /> Syncing...
                  </>
                ) : (
                  `Showing ${visible.length} of ${filtered.length}`
                )}
              </div>
            </div>

            {fetchErr && (
              <div className="p-4 bg-red-50 text-red-600 border-b">
                {fetchErr}
              </div>
            )}

            <div className="p-4">
              {visible.length === 0 && !loading && (
                <div className="text-center text-gray-400 py-12 italic">
                  No appointments found matching your filters.
                </div>
              )}

              <ul className="space-y-3">
                {visible.map((it) => (
                  <li
                    key={it.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between bg-white border border-gray-200 p-4 rounded hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-gray-800">
                          {it.fullName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                            it.status === "done"
                              ? "bg-green-100 text-green-700"
                              : it.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {it.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="font-mono text-gray-400">
                          {it.formId}
                        </span>{" "}
                        • {it.slot} •{" "}
                        <span className="text-blue-600 font-medium">
                          {it.timeInterval}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center gap-2">
                      <button
                        onClick={() => setViewing(it)}
                        className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                      >
                        View
                      </button>

                      <Link
                        href={`/admin/update-form?formId=${it.formId}`}
                        className="px-3 py-1.5 rounded bg-yellow-500 text-white text-sm hover:bg-yellow-600"
                      >
                        Edit
                      </Link>

                      {it.status !== "done" && (
                        <button
                          onClick={() => markDone(it.id)}
                          className="px-3 py-1.5 rounded bg-green-600 text-white text-sm hover:bg-green-700"
                        >
                          Done
                        </button>
                      )}

                      {it.status !== "cancelled" && (
                        <button
                          onClick={() => cancelAppointment(it.id)}
                          className="px-3 py-1.5 rounded bg-red-100 text-red-600 text-sm hover:bg-red-200"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pagination */}
            <div className="p-3 border-t bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Page {page} of {pageCount}
              </div>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  disabled={page === pageCount}
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 2. New Footer Component */}
      <AdminFooter />

      {/* Modal (unchanged logic, just cleaned up UI slightly) */}
      {viewing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setViewing(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-800">
                {viewing.fullName}
              </h3>
              <button
                onClick={() => setViewing(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 uppercase">
                    Form ID
                  </label>
                  <p className="font-mono">{viewing.formId}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase">
                    Status
                  </label>
                  <p className="capitalize font-semibold">{viewing.status}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase">
                    Slot
                  </label>
                  <p>{viewing.slot}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase">
                    Time
                  </label>
                  <p>{viewing.timeInterval}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setViewing(null)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
              <Link
                href={`/admin/update-form?formId=${viewing.formId}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Full Edit
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
