import { useState } from "react";
import { useRouter } from "next/router";

export default function BookingProgress() {
  const steps = ["Choose Service", "Fill Forms", "Book Slot", "Verify Details", "Fee Payment"];
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const router = useRouter();

  const nextStep = () => {
    if (selectedService) {
      router.push({
        pathname: "/form",
        query: { service: selectedService, step: currentStep + 1 },
      });
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 
              ${index + 1 <= currentStep ? "bg-blue-500 text-white border-blue-500" : "border-gray-400 text-gray-500"}`}
            >
              {index + 1}
            </div>
            <p className="text-sm mt-2">{step}</p>
          </div>
        ))}
      </div>

      {/* Completion Line */}
      <div className="relative w-full h-1 bg-gray-300 rounded-full">
        <div
          className="absolute h-1 bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>

      {/* Service Selection Buttons */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {[
          "Fresh Aadhaar Enrollment",
          "Name Update",
          "Address Update",
          "Mobile No. Update",
          "Email ID Update",
          "Date of Birth Update",
          "Gender Update",
          "Biometric Update",
        ].map((service, index) => (
          <button
            key={index}
            onClick={() => setSelectedService(service)}
            className={`border p-4 flex items-center justify-between rounded-lg transition ${
              selectedService === service ? "bg-blue-200 border-blue-500" : "border-blue-500 hover:bg-blue-100"
            }`}
          >
            <span>{service}</span>
          </button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => router.push("/")}
          className="bg-gray-300 text-black px-6 py-2 rounded-full"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!selectedService}
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
