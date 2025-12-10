import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function VerifyDetails() {
  const router = useRouter();
  const { formId } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!formId) return;

    fetch(`/api/getAppointment?formId=${formId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appointment:", err);
        setError("Could not load appointment details.");
        setLoading(false);
      });
  }, [formId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading details...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">✅ Verify Your Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-semibold text-lg text-blue-600 mb-2">Personal Info</h3>
            <p><strong>Name:</strong> {data.fullName}</p>
            <p><strong>Phone:</strong> {data.phone}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Aadhaar:</strong> {data.aadhaarNumber}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-semibold text-lg text-blue-600 mb-2">Appointment Info</h3>
            <p><strong>Center:</strong> {data.center}</p>
            <p><strong>Date:</strong> {data.date}</p>
            <p><strong>Slot:</strong> {data.slot}</p>
            <p><strong>Purpose:</strong> {data.reason}</p>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button 
            onClick={() => router.back()} 
            className="px-6 py-2 bg-gray-300 rounded-full font-semibold hover:bg-gray-400"
          >
            Back
          </button>
          
          <button 
            onClick={() => alert("Redirecting to Payment Gateway...")}
            className="px-8 py-2 bg-green-500 text-white rounded-full font-bold text-lg hover:bg-green-600 shadow-md"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
}