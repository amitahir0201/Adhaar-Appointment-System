// pages/admin/offline_dashboard.jsx
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/router";

// --- Import Shared Components ---
import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";

/**
 * Offline Dashboard
 * - Uses shared AdminHeader for navigation
 * - Layout: Header -> Content -> Footer
 */

// --- Constants ---
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

export default function OfflineDashboard() {
  const router = useRouter();

  // -- Data State --
  const [currentDate, setCurrentDate] = useState(formatDateToISO());
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [toast, setToast] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const controllerRef = useRef(null);
  const debounceRef = useRef(null);

  // Derived Maps
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

      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (controllerRef.current) controllerRef.current.abort();
      
      controllerRef.current = new AbortController();

      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
           // MOCK DATA DELAY
           await new Promise(r => setTimeout(r, 400));
           const mockData = [
             { time: "10:00 AM - 10:30 AM", slot: "Slot 1", fullName: "Offline User", createdAt: new Date().toISOString() }
           ];
           setAppointments(mockData);
        } catch (err) {
          if (err.name === "AbortError") return;
          setAppointments([]);
          setFetchError("Connection error.");
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [currentDate, selectedCity, selectedCenter]
  );

  useEffect(() => {
    fetchAppointments(currentDate, selectedCity, selectedCenter);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [currentDate, selectedCity, selectedCenter, fetchAppointments]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  // Actions
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
    if (!selectedCity || !selectedCenter) return setToast({ type: 'error', msg: "Select city & center." });
    if (!selectedSlots.length) return setToast({ type: 'error', msg: "Select slots." });
    setShowConfirm(true);
  };

  const doBooking = async () => {
    setShowConfirm(false);
    const newBookings = selectedSlots.map((s) => ({
      date: currentDate,
      city: selectedCity,
      center: selectedCenter,
      time: s.time,
      slot: s.slot,
      fullName: "Offline Booking",
      _optimistic: true,
      createdAt: new Date().toISOString(),
    }));

    setAppointments((prev) => [...prev, ...newBookings]);
    setSelectedSlots([]);
    setToast({ type: 'success', msg: "Processing..." });

    try {
      await new Promise(r => setTimeout(r, 800)); // Mock delay
      setToast({ type: 'success', msg: "Slots Booked Successfully!" });
    } catch (err) {
      setToast({ type: 'error', msg: "Booking failed." });
      setAppointments((prev) => prev.filter((a) => !a._optimistic));
    }
  };

  const exportBookedCsv = () => {
    if (!appointments.length) return setToast({ type: 'error', msg: "No data." });
    alert("Exporting CSV...");
  };

  const minDate = formatDateToISO();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* 1. Shared Admin Header (Passed export function) */}
      <AdminHeader onExport={exportBookedCsv} />

      {/* 2. Main Content */}
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section for Page Title */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Offline Booking Mode
            </h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200">Admin Access Only</span>
          </div>

          {/* Controls Section */}
          <section className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="w-full">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                <input type="date" value={currentDate} min={minDate} onChange={(e) => setCurrentDate(e.target.value)} className="w-full p-2 bg-gray-50 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="w-full">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                <select value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setSelectedCenter(""); }} className="w-full p-2 bg-gray-50 border rounded focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select City</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="w-full">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Center</label>
                <select value={selectedCenter} onChange={(e) => setSelectedCenter(e.target.value)} disabled={!selectedCity} className="w-full p-2 bg-gray-50 border rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100">
                  <option value="">Select Center</option>
                  {centers.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex gap-2 w-full">
                <button onClick={() => fetchAppointments()} disabled={!selectedCity || !selectedCenter} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition disabled:opacity-50">
                  {loading ? "Syncing..." : "Sync"}
                </button>
                <button onClick={() => { setSelectedSlots([]); setAppointments([]); }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded transition">Reset</button>
              </div>
            </div>
            {fetchError && <p className="mt-2 text-sm text-red-600">{fetchError}</p>}
          </section>

          {/* Main Workspace */}
          {selectedCity && selectedCenter ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Left: Slots Grid */}
              <div className="xl:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-lg font-bold text-gray-800">Available Slots</h2>
                   <div className="flex gap-2 text-xs font-medium">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-green-500"></span> Available</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-600"></span> Selected</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 border border-red-200"></span> Booked</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {timeSlots.map((time) => (
                    <div key={time} className="bg-white border rounded shadow-sm p-3 hover:shadow-md transition">
                      <div className="text-xs font-bold text-gray-500 mb-2">{time}</div>
                      <div className="flex gap-2">
                        {["Slot 1", "Slot 2"].map((slot) => {
                          const booked = isBooked(time, slot);
                          const sel = isSelected(time, slot);
                          return (
                            <button
                              key={slot}
                              onClick={() => toggleSlot(time, slot)}
                              disabled={booked}
                              className={`flex-1 py-2 rounded text-sm font-medium border transition-all relative
                                ${booked 
                                  ? "bg-red-50 border-red-100 text-red-400 cursor-not-allowed" 
                                  : sel 
                                  ? "bg-blue-600 border-blue-600 text-white shadow-md ring-2 ring-blue-200" 
                                  : "bg-white border-green-200 text-green-700 hover:bg-green-50"
                                }`}
                            >
                              {slot} {booked && <span className="absolute inset-0 flex items-center justify-center bg-white/60 text-[10px] text-red-600 font-bold uppercase tracking-wider">Booked</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Actions & List */}
              <div className="xl:col-span-1 space-y-6">
                
                {/* Action Card */}
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 sticky top-24">
                  <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Booking Actions</h3>
                  
                  {selectedSlots.length > 0 ? (
                    <div className="mb-4 bg-blue-50 p-3 rounded border border-blue-100 max-h-32 overflow-y-auto">
                      {selectedSlots.map((s, i) => (
                        <div key={i} className="text-sm text-blue-800 flex justify-between">
                          <span>{s.time}</span> <span className="font-bold">{s.slot}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-4 text-sm text-gray-400 italic text-center py-2">Select slots to book</div>
                  )}

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={confirmBooking} 
                      disabled={selectedSlots.length === 0}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded shadow-md transition"
                    >
                      Confirm Booking ({selectedSlots.length})
                    </button>
                  </div>

                   <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-gray-700 text-sm">Today's Activity</h4>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{appointments.length}</span>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                          {appointments.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No bookings yet.</p>
                          ) : (
                            appointments.slice(0, 10).map((a, i) => (
                              <div key={i} className="text-xs p-2 bg-gray-50 border-l-2 border-green-500 rounded-r">
                                <div className="font-medium">{a.fullName}</div>
                                <div className="text-gray-500">{a.time} • {a.slot}</div>
                              </div>
                            ))
                          )}
                      </div>
                   </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded border border-dashed border-gray-300 text-gray-400">
               <svg className="w-16 h-16 mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               <p className="text-lg font-medium">Select City & Center to begin</p>
            </div>
          )}
        </div>
      </main>

      {/* 3. Shared Admin Footer */}
      <AdminFooter />

      {/* --- Modals & Toasts --- */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Booking?</h3>
            <p className="text-sm text-gray-600 mb-6">You are booking <strong>{selectedSlots.length}</strong> slots for the selected date.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded border">Cancel</button>
              <button onClick={doBooking} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded shadow">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded shadow-lg text-white font-medium z-[70] flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// Ensure SSR to prevent static mismatch warnings
export async function getServerSideProps() {
  return { props: {} };
}