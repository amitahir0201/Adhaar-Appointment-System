import { useState } from "react";
import { useRouter } from "next/router";

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const router = useRouter();
  const steps = ["Choose Service", "Fill Forms", "Book Slot", "Verify Details", "Fee Payment"];
  const [currentStep, setCurrentStep] = useState(5);

  const handlePaymentSelection = (method) => {
    setSelectedMethod(method);
  };

  const handleFinish = () => {
    if (!selectedMethod) {
      alert("Please select a payment method to proceed.");
      return;
    }

    alert("🎉 Appointment confirmed! You will receive a confirmation message.");
    router.push("/"); // Redirect to home page
  };

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {/* Progress Steps */}
      <div className="w-full max-w-xl mb-6">
        <div className="flex justify-between items-center">
          {["Choose Service", "Fill Forms", "Book Slot", "Verify Details", "Fee Payment"].map((stepLabel, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${index <= 5 ? "bg-blue-500 text-white border-blue-500" : "border-gray-400 text-gray-500"}`}
              >
                {index + 1}
              </div>
              <p className="text-sm mt-2">{stepLabel}</p>
            </div>
          ))}
        </div>
        <div className="relative w-full h-1 bg-gray-300 rounded-full mt-2">
          <div className="absolute h-1 bg-blue-500 rounded-full transition-all duration-300" style={{ width: "100%" }}></div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
        💳 Select Payment Method
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Choose Payment Method:</h3>

        <div className="grid gap-4">
          {["Credit/Debit Card", "UPI", "Net Banking", "Wallet"].map((method) => (
            <button
              key={method}
              onClick={() => handlePaymentSelection(method)}
              className={`p-3 w-full rounded-lg border-2 transition-all text-lg font-medium ${
                selectedMethod === method
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        <button
          onClick={handleFinish}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-lg"
        >
          Finish & Confirm
        </button>
      </div>
    </div>
  );
}
