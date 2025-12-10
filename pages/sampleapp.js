import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/router";

// Removed Link because we need to submit data first, then navigate programmatically
// import Link from "next/link"; 

export default function AppointmentBooking() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  // Initialize as empty array
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("ASK Ahmedabad");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { service, formId } = router.query;
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (selectedDate) {
      setError(null);
      setAvailableSlots([]); // Clear previous slots while loading
      setLoading(true);

      fetch(`/api/getslots?date=${selectedDate}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((data) => {
          // FIX 1: Safety check to ensure data.slots is actually an array
          if (data && Array.isArray(data.slots)) {
            setAvailableSlots(data.slots);
          } else {
            setAvailableSlots([]); // Fallback to empty array if API response is weird
            console.warn("API returned invalid format:", data);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load slots. Please try again.");
          console.error("Error fetching slots:", err);
          setAvailableSlots([]); // Ensure map doesn't crash
          setLoading(false);
        });
    }
  }, [selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedSlot(null);
  };

  const handleSlotSelection = (slot) => {
    if (slot.available) {
      setSelectedSlot(slot.time);
    }
  };

  const handleConfirmAppointment = async () => {
    if (!formId) {
      alert("Form ID not found. Please fill out the form first.");
      return;
    }

    try {
      const response = await fetch("/api/updateAppointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId,
          date: selectedDate,
          slot: selectedSlot,
          center: selectedCenter, // You likely want to save the center too
        }),
      });

      if (response.ok) {
        router.push({
          pathname: "/verify",
          query: { formId },
        });
      } else {
        console.error("Failed to update appointment");
        setError("Error confirming appointment. Try again.");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      setError("Unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {service ? service : "Book Aadhaar Appointment"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl w-full mt-6">
        
        {/* Left Column: Selection */}
        <div className="bg-white p-6 rounded-xl shadow-lg col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
            📅 Schedule Your Aadhaar Service
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium text-lg">
              Aadhaar Seva Kendra*
            </label>
            <select
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            >
              <option>ASK Ahmedabad</option>
              <option>ASK Mumbai</option>
              <option>ASK Delhi</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium text-lg">
              Select Date:
            </label>
            <input
              type="date"
              value={selectedDate || ""}
              onChange={handleDateChange}
              min={today}
              className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {selectedDate && (
            <>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              
              {loading ? (
                <p className="text-center text-gray-500">Loading slots...</p>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Available Slots for{" "}
                    <span className="text-indigo-600">{selectedDate}</span>:
                  </h3>
                  
                  {/* FIX 2: Optional chaining and check for length */}
                  {availableSlots && availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          className={`p-3 text-lg font-medium rounded-xl border transition-all ${
                            slot.available
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          } ${
                            selectedSlot === slot.time
                              ? "ring-4 ring-blue-400 scale-105"
                              : ""
                          }`}
                          onClick={() => handleSlotSelection(slot)}
                          disabled={!slot.available}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No slots available for this date.</p>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Right Column: Summary & Action */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg flex-grow">
            <h2 className="text-2xl font-bold text-center text-blue-700">
              ✅ Your Appointment Details
            </h2>

            {selectedDate && selectedSlot ? (
              <>
                <div className="mt-6 text-center">
                  <p className="text-5xl font-bold text-blue-600">
                    {selectedDate.split("-")[2]}
                  </p>
                  <p className="text-lg text-gray-700">
                    {format(new Date(selectedDate), "EEEE, MMMM yyyy")}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-center text-red-600">
                  <span className="text-xl font-bold">⏰ {selectedSlot}</span>
                </div>
                <div className="mt-6 text-red-600 text-lg text-center">
                  <p className="font-bold">🏢 {selectedCenter}</p>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 mt-6">
                Select a date & slot to view details
              </p>
            )}
          </div>

          {/* FIX 3: Button moved here and Link removed. Using onClick handler. */}
          <button
            onClick={handleConfirmAppointment}
            disabled={!selectedSlot}
            className={`w-full py-3 rounded-full text-white font-bold text-lg transition-colors ${
              !selectedSlot 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Confirm & Next
          </button>
        </div>

      </div>
    </div>
  );
}