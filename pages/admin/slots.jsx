// pages/admin/slots.jsx
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";

/**
 * Admin Slots Page
 * URL: http://localhost:3000/admin/slots
 */

const cities = ["Delhi", "Mumbai", "Bangalore"];
const centers = ["Center 1", "Center 2", "Center 3"];
const timeSlots = [
  "09:00 AM - 09:30 AM", "09:30 AM - 10:00 AM", "10:00 AM - 10:30 AM", "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM", "11:30 AM - 12:00 PM", "12:00 PM - 12:30 PM", "12:30 PM - 01:00 PM",
  "01:00 PM - 01:30 PM", "01:30 PM - 02:00 PM", "02:00 PM - 02:30 PM", "02:30 PM - 03:00 PM",
  "03:00 PM - 03:30 PM", "03:30 PM - 04:00 PM", "04:00 PM - 04:30 PM", "04:30 PM - 05:00 PM",
  "05:00 PM - 05:30 PM", "05:30 PM - 06:00 PM",
];

function formatDateToISO(d = new Date()) {
  return d.toISOString().split("T")[0];
}

function slotKey(time, slot) {
  return `${time}__${slot}`;
}

export default function SlotsPage() {
  const [currentDate, setCurrentDate] = useState(formatDateToISO());
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [toast, setToast] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Refs for aborting fetches and debouncing
  const controllerRef = useRef(null);
  const debounceRef = useRef(null);

  // Derived state: Map of booked slots for quick lookup
  const bookedMap = useMemo(() => {
    const m = new Map();
    (appointments || []).forEach((a) => {
      const key = slotKey(a.time, a.slot);
      m.set(key, (m.get(key) || 0) + 1);
    });
    return m;
  }, [appointments]);

  // Fetch Logic
  const fetchAppointments = useCallback(
    async (date = currentDate, city = selectedCity, center = selectedCenter) => {
      setFetchError("");
      if (!city || !center || !date) {
        setAppointments([]);
        return;
      }

      // Cleanup previous requests
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (controllerRef.current) controllerRef.current.abort();
      
      controllerRef.current = new AbortController();

      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          // --- REAL API CALL REPLACE HERE ---
          // const url = `/api/admin/getAppointments?date=${date}&city=${city}&center=${center}`;
          // const res = await fetch(url, { signal: controllerRef.current.signal });
          // const json = await res.json();
          // setAppointments(json.appointments);
          
          // --- MOCK DATA (Simulated Delay) ---
          await new Promise(r => setTimeout(r, 600)); 
          // Randomly generate a "booked" slot for demo purposes if nothing is there
          const mockData = [
             { time: "09:00 AM - 09:30 AM", slot: "Slot 1", fullName: "Demo User", createdAt: new Date().toISOString() }
          ];
          setAppointments(mockData);
          // ----------------------------------

        } catch (err) {
          if (err.name === "AbortError") return;
          console.error("Failed fetching:", err);
          setAppointments([]);
          setFetchError("Failed to sync slots.");
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [currentDate, selectedCity, selectedCenter]
  );

  // Initial Fetch & cleanup
  useEffect(() => {
    fetchAppointments(currentDate, selectedCity, selectedCenter);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [currentDate, selectedCity, selectedCenter, fetchAppointments]);

  // Toast Auto-Dismiss
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  // Handlers
  const toggleSlot = (time, slot) => {
    const key = slotKey(time, slot);
    if (bookedMap.has(key)) return;
    setSelectedSlots((prev) => {
      const exists = prev.some((s) => slotKey(s.time, s.slot) === key);
      if (exists) return prev.filter((s) => slotKey(s.time, s.slot) !== key);
      return [...prev, { time, slot }];
    });
  };

  const isSelected = (time, slot) => selectedSlots.some((s) => s.time === time && s.slot === slot);
  const isBooked = (time, slot) => bookedMap.has(slotKey(time, slot));

  const confirmBooking = () => {
    if (!selectedCity || !selectedCenter) return setToast({ type: 'error', msg: "Select city & center first." });
    if (!selectedSlots.length) return setToast({ type: 'error', msg: "Select at least one slot." });
    setShowConfirm(true);
  };

  const doBooking = async () => {
    setShowConfirm(false);
    // Optimistic Update
    const optimisticEntries = selectedSlots.map((s) => ({
      date: currentDate,
      city: selectedCity,
      center: selectedCenter,
      time: s.time,
      slot: s.slot,
      fullName: "Admin Booking", 
      _optimistic: true,
      createdAt: new Date().toISOString(),
    }));

    setAppointments((prev) => [...prev, ...optimisticEntries]);
    setSelectedSlots([]);
    setToast({ type: 'success', msg: "Booking initiated..." });

    try {
      // --- REAL API CALL REPLACE HERE ---
      // await fetch("/api/admin/bookSlot", { method: 'POST', body: JSON.stringify(...) });
      
      await new Promise(r => setTimeout(r, 800)); // Mock delay
      
      setToast({ type: 'success', msg: "Booking confirmed successfully!" });
    } catch (err) {
      setToast({ type: 'error', msg: "Booking failed." });
      setAppointments((prev) => prev.filter((a) => !a._optimistic));
    }
  };

  const exportBookedCsv = () => {
    if (!appointments.length) return setToast({ type: 'error', msg: "No data to export." });
    const rows = [["Date", "City", "Center", "Time", "Slot", "Name", "Created At"]];
    appointments.forEach((a) => rows.push([currentDate, selectedCity, selectedCenter, a.time, a.slot, a.fullName || "", a.createdAt]));
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booked_slots_${currentDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const minDate = formatDateToISO();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* 1. Only Admin Header */}
      <AdminHeader onExport={exportBookedCsv} />

      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Control Bar */}
          <section className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center gap-2 mb-4 text-blue-900">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
               <h2 className="font-bold text-lg">Filter & Configuration</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                <input type="date" value={currentDate} min={minDate} onChange={(e) => setCurrentDate(e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                <select value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setSelectedCenter(""); }} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                  <option value="">Select City</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Center</label>
                <select value={selectedCenter} onChange={(e) => setSelectedCenter(e.target.value)} disabled={!selectedCity} className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100 disabled:text-gray-400">
                  <option value="">Select Center</option>
                  {centers.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={() => fetchAppointments()} disabled={!selectedCity || !selectedCenter} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/> : "Sync"}
                </button>
                <button onClick={() => { setSelectedSlots([]); setAppointments([]); }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded transition">Reset</button>
              </div>
            </div>
            {fetchError && <div className="mt-3 p-2 bg-red-50 text-red-600 text-sm rounded border border-red-200">{fetchError}</div>}
          </section>

          {/* Main Content Area */}
          {!selectedCity || !selectedCenter ? (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <h3 className="text-xl font-medium text-gray-400">Please select a City and Center to view slots</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">Available Time Slots</h3>
                    <div className="flex gap-4 text-xs font-medium">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> Available</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-600"></span> Selected</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></span> Booked</span>
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {timeSlots.map((time) => (
                      <div key={time} className="border border-gray-100 rounded-md p-3 hover:shadow-sm transition bg-white">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{time}</div>
                        <div className="flex gap-2">
                          {["Slot 1", "Slot 2"].map((slot) => {
                            const booked = isBooked(time, slot);
                            const sel = isSelected(time, slot);
                            return (
                              <button
                                key={slot}
                                onClick={() => toggleSlot(time, slot)}
                                disabled={booked}
                                className={`flex-1 py-2 px-3 rounded text-sm font-medium border transition-all relative overflow-hidden
                                  ${booked ? "bg-red-50 border-red-100 text-red-400 cursor-not-allowed" : sel ? "bg-blue-600 border-blue-600 text-white shadow-md ring-2 ring-blue-200" : "bg-white border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"}
                                `}
                              >
                                {slot}
                                {booked && <span className="absolute inset-0 flex items-center justify-center bg-red-50/50 backdrop-blur-[1px] font-bold text-xs text-red-500">BOOKED</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Booking Summary</h3>
                  {selectedSlots.length === 0 ? (
                    <p className="text-sm text-gray-400 italic py-4 text-center">No slots selected yet.</p>
                  ) : (
                    <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto">
                      {selectedSlots.map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm bg-blue-50 p-2 rounded text-blue-800 border border-blue-100">
                          <span>{s.time}</span>
                          <span className="font-bold text-xs bg-white px-2 py-0.5 rounded border border-blue-200">{s.slot}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="pt-2">
                    <button onClick={confirmBooking} disabled={selectedSlots.length === 0} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded shadow-md transition transform active:scale-95">
                      Confirm Booking ({selectedSlots.length})
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-800">Current Bookings</h3>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{appointments.length}</span>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {appointments.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No bookings found for this date.</p>
                    ) : (
                      appointments.map((a, idx) => (
                        <div key={idx} className="text-sm border-l-4 border-green-500 bg-gray-50 pl-3 py-2 rounded-r">
                          <div className="font-bold text-gray-800">{a.fullName || "User"}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{a.time} • {a.slot}</div>
                          {a._optimistic && <div className="text-[10px] text-blue-600 font-bold mt-1 animate-pulse">SYNCING...</div>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 2. Only Admin Footer */}
      <AdminFooter />

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in-up">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Confirm Booking</h4>
            <p className="text-gray-600 text-sm mb-4">You are about to book <strong className="text-blue-600">{selectedSlots.length} slots</strong> for <strong>{currentDate}</strong> at <strong>{selectedCenter}</strong>.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100 border border-transparent">Cancel</button>
              <button onClick={doBooking} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 shadow-md">Confirm & Book</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed right-6 bottom-6 px-6 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 animate-bounce-in ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.type === 'error' ? (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          ) : (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          )}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// Ensure SSR to prevent static warning
export async function getServerSideProps() {
  return {
    props: {},
  };
}