import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

// Configuration Constants (Move these to a config file or API in production)
const CITIES = ["Delhi", "Mumbai", "Bangalore"];
const CENTERS = {
  "Delhi": ["Delhi Center 1", "Delhi Center 2"],
  "Mumbai": ["Mumbai Center 1", "Mumbai Center 2"],
  "Bangalore": ["Bangalore Center 1", "Bangalore Center 2"]
};

// flexible time slot generator
const generateTimeSlots = (startHour, endHour, intervalMinutes) => {
  const slots = [];
  let currentTime = new Date();
  currentTime.setHours(startHour, 0, 0, 0);

  const endTime = new Date();
  endTime.setHours(endHour, 0, 0, 0);

  while (currentTime < endTime) {
    const startStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    const endStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    slots.push(`${startStr} - ${endStr}`);
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots(9, 18, 30); // 9 AM to 6 PM, 30 min intervals

export default function SlotsPage() {
  const router = useRouter();

  // State
  const [currentDate, setCurrentDate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize Date on Mount
  useEffect(() => {
    setCurrentDate(new Date().toISOString().split("T")[0]);
  }, []);

  // Fetch Appointments
  const fetchAppointments = useCallback(async () => {
    if (!selectedCity || !selectedCenter || !currentDate) return;

    setLoading(true);
    setError("");
    setAppointments([]); // Clear previous data while fetching

    try {
      // simulating API delay for UX demonstration
      // In real app: const response = await fetch(...)
      const response = await fetch(`/api/admin/getAppointments?date=${currentDate}&city=${selectedCity}&center=${selectedCenter}`);
      
      if (!response.ok) throw new Error("Failed to fetch slots");
      
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error(err);
      // Fallback for demo if API doesn't exist yet
      setAppointments([]); 
      // setError("Could not load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedCity, selectedCenter, currentDate]);

  // Trigger fetch when filters change
  useEffect(() => {
    fetchAppointments();
    setSelectedSlots([]); // Reset selection when filters change
  }, [fetchAppointments]);

  // Handle Slot Selection
  const handleSlotSelect = (time, slotName) => {
    const isAlreadySelected = selectedSlots.find((s) => s.time === time && s.slot === slotName);
    
    if (isAlreadySelected) {
      setSelectedSlots(prev => prev.filter((s) => !(s.time === time && s.slot === slotName)));
    } else {
      setSelectedSlots(prev => [...prev, { time, slot: slotName }]);
    }
  };

  // Confirm Booking
  const confirmBooking = async () => {
    if (!selectedSlots.length) return alert("Please select at least one slot.");

    const bookingData = {
      date: currentDate,
      city: selectedCity,
      center: selectedCenter,
      slots: selectedSlots,
    };

    try {
      const response = await fetch("/api/admin/bookSlot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        alert("Booking Confirmed!");
        setSelectedSlots([]);
        fetchAppointments(); // Refresh data
      } else {
        throw new Error("Booking failed");
      }
    } catch (err) {
      alert("Error booking slots. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Book Appointment</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="date" 
                value={currentDate}
                min={new Date().toISOString().split("T")[0]} // Disable past dates
                onChange={(e) => setCurrentDate(e.target.value)}
                className="w-full border-gray-300 border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* City Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select 
                value={selectedCity} 
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedCenter(""); // Reset center when city changes
                }} 
                className="w-full border-gray-300 border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select City</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Center Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Center</label>
              <select 
                value={selectedCenter} 
                onChange={(e) => setSelectedCenter(e.target.value)} 
                className="w-full border-gray-300 border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                disabled={!selectedCity}
              >
                <option value="">Select Center</option>
                {selectedCity && CENTERS[selectedCity]?.map((center) => (
                  <option key={center} value={center}>{center}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Slots Grid */}
        {selectedCity && selectedCenter ? (
          loading ? (
            <div className="text-center py-12 text-gray-500">Loading slots...</div>
          ) : (
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Available Slots</h2>
                <div className="text-sm text-gray-500">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span> Available
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full ml-3 mr-1"></span> Booked
                  <span className="inline-block w-3 h-3 bg-blue-600 rounded-full ml-3 mr-1"></span> Selected
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TIME_SLOTS.map((time) => (
                  <div key={time} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-md font-medium text-gray-900 mb-3 text-center">{time}</h3>
                    <div className="flex justify-center gap-2">
                      {["Slot 1", "Slot 2"].map((slotName) => {
                        const isBooked = appointments.some((appt) => appt.time === time && appt.slot === slotName);
                        const isSelected = selectedSlots.some((s) => s.time === time && s.slot === slotName);
                        
                        return (
                          <button
                            key={slotName}
                            onClick={() => handleSlotSelect(time, slotName)}
                            disabled={isBooked}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                              isBooked 
                                ? "bg-red-100 text-red-600 cursor-not-allowed border border-red-200" 
                                : isSelected 
                                  ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600 ring-offset-1" 
                                  : "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
                            }`}
                          >
                            {slotName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
            Please select a City and Center to view slots.
          </div>
        )}

        {/* Footer / Confirm Action */}
        {selectedSlots.length > 0 && (
          <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 shadow-lg flex justify-between items-center z-50 px-8">
            <div className="text-gray-700">
              <span className="font-bold text-lg">{selectedSlots.length}</span> slots selected
            </div>
            <button 
              onClick={confirmBooking}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-transform transform active:scale-95"
            >
              Confirm Booking
            </button>
          </div>
        )}
      </div>
      
      {/* Spacer for fixed footer */}
      {selectedSlots.length > 0 && <div className="h-20"></div>}
    </div>
  );
}