import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const router = useRouter();
  const { formId, service } = router.query;
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    if (!formId) return;

    // Fetch appointment data
    fetch(`/api/getAppointment?formId=${formId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          // Exclude _id and formId from displayed data
          const { _id, formId, ...filteredData } = data;
          setFormData(filteredData);
          setUpdatedData(filteredData);
        }
      })
      .catch((error) => console.error("Error fetching appointment:", error));
  }, [formId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/updateAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formId, ...updatedData }), // Send formId but don't display it
      });

      if (response.ok) {
        setFormData(updatedData);
        setIsEditing(false);
      } else {
        console.error("Error updating appointment");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNext = async () => {
    if (isEditing) {
      await handleSave();
    }
    router.push({
      pathname: "/payment",
      query: { formId, service },
    });
  };

  if (!formData) {
    return <p className="text-center mt-6">Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-6">
        {["Choose Service", "Fill Forms", "Book Slot", "Verify Details", "Fee Payment"].map((stepLabel, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 
              ${index + 1 <= 4 ? "bg-blue-500 text-white border-blue-500" : "border-gray-400 text-gray-500"}`}>
              {index + 1}
            </div>
            <p className="text-sm mt-2">{stepLabel}</p>
          </div>
        ))}
      </div>

      {/* Completion Line */}
      <div className="relative w-full h-1 bg-gray-300 rounded-full">
        <div className="absolute h-1 bg-blue-500 rounded-full transition-all duration-300" 
             style={{ width: "75%" }}>
        </div>
      </div>

      {/* Details Section */}
      <h2 className="text-xl font-bold my-4">Verify Your Details</h2>

      <div className="grid gap-4">
        {Object.entries(formData).map(([key, value]) => {
          if (key === "formId" || key === "_id") return null; // Hide formId and _id

          return (
            <div key={key} className="flex items-center justify-between border p-2 rounded">
              <span className="capitalize font-medium">{key.replace(/([A-Z])/g, " $1")}:</span>
              {isEditing ? (
                key === "date" || key === "slot" ? (
                  <span className="border p-2 rounded w-2/3 bg-gray-100 text-gray-600 cursor-not-allowed">
                    {value}
                  </span> // Date & Time Slot Locked
                ) : (
                  <input
                    type="text"
                    name={key}
                    value={updatedData[key]}
                    onChange={handleChange}
                    className="border p-2 rounded w-2/3"
                  />
                )
              ) : (
                <span>{value}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button onClick={() => router.push("/steps")} className="bg-gray-300 text-black px-6 py-2 rounded-full">
          Back
        </button>
        {isEditing ? (
          <button onClick={handleSave} className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600">
            Save Changes
          </button>
        ) : (
          <button onClick={handleEditClick} className="bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600">
            Edit
          </button>
        )}
        <button onClick={handleNext} className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600">
          Next
        </button>
      </div>
    </div>
  );
}
