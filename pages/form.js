import { useRouter } from "next/router";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Import UUID for formId

export default function FormPage() {
  const router = useRouter();
  const { service, step } = router.query;
  const steps = ["Choose Service", "Fill Forms", "Book Slot", "Verify Details", "Fee Payment"];
  const currentStep = step ? parseInt(step) : 2; // Set Step 2 active

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    aadhaarNumber: "",
    gender: "",
    dob: "",
    address: "",
    idProof: "",
    reason: service || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Generate unique formId
    const formId = uuidv4();  

    try {
      const response = await fetch("/api/saveAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, timeslot: "", date: "", formId }),
      });

      if (response.ok) {
        router.push({
          pathname: "/appointment",
          query: { service, formId }, // Pass formId in query
        });
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((stepLabel, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 
              ${index + 1 <= currentStep ? "bg-blue-500 text-white border-blue-500" : "border-gray-400 text-gray-500"}`}>
              {index + 1}
            </div>
            <p className="text-sm mt-2">{stepLabel}</p>
          </div>
        ))}
      </div>

      {/* Completion Line */}
      <div className="relative w-full h-1 bg-gray-300 rounded-full">
        <div className="absolute h-1 bg-blue-500 rounded-full transition-all duration-300" 
             style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}>
        </div>
      </div>

      {/* Form */}
      <h2 className="text-xl font-bold my-4">Fill Details for {service}</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input type="text" name="fullName" placeholder="Full Name" required value={formData.fullName} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="phone" placeholder="Phone Number" required value={formData.phone} onChange={handleChange} className="border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="aadhaarNumber" placeholder="Aadhaar Number" required value={formData.aadhaarNumber} onChange={handleChange} className="border p-2 rounded" />
        <select name="gender" required className="w-full p-3 border rounded bg-white" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="date" name="dob" required value={formData.dob} onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="address" placeholder="Address" required value={formData.address} onChange={handleChange} className="border p-2 rounded" />
        <select name="idProof" required className="w-full p-3 border rounded bg-white" onChange={handleChange}>
          <option value="">Select ID Proof</option>
          <option value="PAN Card">PAN Card</option>
          <option value="Passport">Passport</option>
          <option value="Voter ID">Voter ID</option>
          <option value="Driving License">Driving License</option>
          <option value="Other">Other</option>
        </select>
        <input type="text" name="reason" placeholder="Reason" required value={formData.reason} onChange={handleChange} className="border p-2 rounded" disabled />

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button type="button" onClick={() => router.push("/steps")} className="bg-gray-300 text-black px-6 py-2 rounded-full">
            Back
          </button>
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600">
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
