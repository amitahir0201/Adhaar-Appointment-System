import { useState } from "react";
import Link from "next/link";

export default function AppointmentDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Main Link */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="mr-5 text-lg cursor-pointer hover:text-gray-900 focus:outline-none"
      >
        Appointment ▾
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute mt-2 bg-white border rounded shadow-lg w-40">
          <Link 
            href="/sampleapp" 
            className="block px-4 py-2 text-blue-600 hover:bg-gray-100"
          >
            Online
          </Link>
          <Link 
            href="/offlinesampl" 
            className="block px-4 py-2 text-blue-600 hover:bg-gray-100"
          >
            Offline
          </Link>
        </div>
      )}
    </div>
  );
}
