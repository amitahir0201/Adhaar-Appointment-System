import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/router";

export default function AppointmentBooking() {
  const router = useRouter();
  const rawQuery = router?.query || {};
  const service = rawQuery.service;
  const formId = Array.isArray(rawQuery.formId) ? rawQuery.formId[0] : rawQuery.formId;

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("ASK Ahmedabad");
  const [error, setError] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    // Reset slots if no date is selected
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    async function loadSlots() {
      setError(null);
      setLoadingSlots(true);

      try {
        const res = await fetch(`/api/getslots?date=${encodeURIComponent(selectedDate)}`, {
          method: "GET",
          signal: controller.signal,
          headers: { "Accept": "application/json" },
        });

        // 1. Handle API Errors (Non-200 responses)
        if (!res.ok) {
          const contentType = res.headers.get("content-type");
          let errorMessage = `Failed to load slots (Status: ${res.status})`;

          try {
            if (contentType && contentType.includes("application/json")) {
              const errorJson = await res.json();
              errorMessage = errorJson.error || errorJson.message || errorMessage;
            } else {
              const errorText = await res.text();
              // Check if the server returned a code crash stack trace
              if (errorText.includes("startsWith") || errorText.includes("Runtime Error")) {
                console.error("CRITICAL API ERROR:", errorText); // Log raw error for developer
                errorMessage = "System error: The server encountered a problem. Please check server logs.";
              } else {
                errorMessage = errorText || errorMessage;
              }
            }
          } catch (e) {
            // Parsing failed, keep default message
          }

          // STOP execution here. Do not throw. Just update UI.
          if (!cancelled) setError(errorMessage);
          return; 
        }

        // 2. Handle Success
        const data = await res.json();
        if (!cancelled) {
          setAvailableSlots(Array.isArray(data.slots) ? data.slots : []);
        }

      } catch (err) {
        // 3. Handle Network/Fetch Errors
        if (err.name === "AbortError") return;
        console.error("Client Fetch Error:", err);
        if (!cancelled) setError("Network error. Please check your connection.");
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }

    loadSlots();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedSlot(null);
    setError(null);
  };

  const handleSlotSelection = (slot) => {
    if (slot && slot.available) setSelectedSlot(slot.time);
  };

  const handleConfirmAppointment = async () => {
    if (!formId) {
      setError("Form ID not found. Please fill out the form first.");
      return;
    }
    if (!selectedDate || !selectedSlot) {
      setError("Please select a date and slot before continuing.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/updateAppointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId, date: selectedDate, slot: selectedSlot, center: selectedCenter }),
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = { raw: text };
      }

      if (res.ok) {
        router.push({ pathname: "/verify", query: { formId } });
      } else {
        console.error("Failed to update appointment:", data);
        setError(data?.error || data?.message || `Server returned ${res.status}`);
      }
    } catch (err) {
      console.error("Error updating appointment:", err);
      setError("Unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalSteps = 5;
  const currentStepIndex = 2;
  const progressWidth = `${Math.round(((currentStepIndex + 1) / totalSteps) * 100)}%`;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center mt-4">
        {service || "Book Aadhaar Appointment"}
      </h2>

      {/* Progress Bar Container */}
      <div className="w-full max-w-xl mb-6 px-2">
        <div className="flex justify-between items-start md:items-center">
          {[
            "Choose Service",
            "Fill Forms",
            "Book Slot",
            "Verify Details",
            "Fee Payment",
          ].map((stepLabel, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full border-2 text-xs md:text-base ${
                  index <= currentStepIndex
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-400 text-gray-500"
                }`}
                aria-current={index === currentStepIndex}
              >
                {index + 1}
              </div>
              <p className="text-[10px] md:text-sm mt-2 text-center break-words w-full px-1">
                {stepLabel}
              </p>
            </div>
          ))}
        </div>
        <div className="relative w-full h-1 bg-gray-300 rounded-full mt-2">
          <div
            className="absolute h-1 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: progressWidth }}
            aria-hidden
          />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl w-full mt-2">
        
        {/* LEFT COLUMN: Selection Area */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg col-span-1 lg:col-span-2 order-1">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-center text-blue-700">
            📅 Schedule Your Aadhaar Service
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium text-base md:text-lg">
              Aadhaar Seva Kendra*
            </label>
            <select
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option>ASK Ahmedabad</option>
              <option>ASK Mumbai</option>
              <option>ASK Delhi</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium text-base md:text-lg">
              Select Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={today}
              className="w-full p-3 text-base md:text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {selectedDate && (
            <>
              {error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
                  <p className="font-semibold">{error}</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Available Slots for <span className="text-indigo-600">{selectedDate}</span>:
                  </h3>

                  {loadingSlots ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                      {availableSlots.length === 0 ? (
                        <p className="col-span-full text-gray-500 text-center">
                          No slots available for this date.
                        </p>
                      ) : (
                        availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            className={`p-2 md:p-3 text-sm md:text-lg font-medium rounded-xl border transition-all ${
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
                            aria-pressed={selectedSlot === slot.time}
                          >
                            {slot.time}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* RIGHT COLUMN: Details */}
        <div className="bg-white p-6 rounded-xl shadow-lg col-span-1 order-2">
          <h2 className="text-xl md:text-2xl font-bold text-center text-blue-700">
            ✅ Your Appointment Details
          </h2>

          {selectedDate && selectedSlot ? (
            <div className="flex flex-col items-center">
              <div className="mt-6 text-center">
                <p className="text-4xl md:text-5xl font-bold text-blue-600">
                  {selectedDate.split("-")[2]}
                </p>
                <p className="text-base md:text-lg text-gray-700">
                  {format(new Date(selectedDate), "EEEE, MMMM yyyy")}
                </p>
              </div>
              <div className="mt-4 text-red-600">
                <span className="text-lg md:text-xl font-bold">⏰ {selectedSlot}</span>
              </div>
              <div className="mt-6 text-red-600 text-base md:text-lg text-center">
                <p className="font-bold">🏢 {selectedCenter}</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-6">
              Select a date & slot to view details
            </p>
          )}
        </div>

        {/* BOTTOM BUTTONS */}
        <div className="col-span-1 lg:col-span-3 flex justify-between mt-6 order-3 mb-8">
          <button
            type="button"
            onClick={() => router.push("/steps")}
            className="bg-gray-300 text-black px-6 py-3 rounded-full hover:bg-gray-400 transition"
          >
            Back
          </button>

          <button
            onClick={handleConfirmAppointment}
            disabled={!selectedSlot || submitting}
            type="button"
            className={`px-8 py-3 rounded-full text-white font-semibold transition ${
              !selectedSlot || submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg"
            }`}
          >
            {submitting ? "Submitting..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}