import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FaUserCircle, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import Appo from "./appo";

const Navbar = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle "Login/Signup" Dropdown
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Toggle Mobile Menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Close mobile menu when a link is clicked
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-[#42a5f5] text-white body-font my-2 mx-2 md:mx-4 rounded-2xl shadow-md relative z-50">
      <div className="container mx-auto flex flex-wrap p-4 items-center justify-between">
        
        {/* --- LOGO SECTION --- */}
        <Link href="/" className="flex title-font font-medium items-center text-white" onClick={closeMobileMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl font-semibold">Aadhar Booking</span>
        </Link>

        {/* --- HAMBURGER ICON (Visible on Mobile) --- */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* --- DESKTOP NAVIGATION (Hidden on Mobile) --- */}
        <nav className="hidden md:flex md:ml-auto md:mr-auto flex-wrap items-center text-base justify-center space-x-6">
          <Link href="/" className="hover:text-blue-100 transition-colors">Home</Link>
          {session?.user?.role === "admin" && (
            <Link href="/admin/admin_dashboard" className="hover:text-blue-100 transition-colors">Admin Panel</Link>
          )}
          <Link href="/steps" className="hover:text-blue-100 transition-colors">Book Appointment</Link>
          <Link href="/contact" className="hover:text-blue-100 transition-colors">Contact/Support</Link>
          <div className="hover:text-blue-100 transition-colors">
            <Appo />
          </div>
        </nav>

        {/* --- DESKTOP AUTH SECTION (Hidden on Mobile) --- */}
        <div className="hidden md:flex items-center">
          {session ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-white text-2xl" />
                <span className="text-white font-medium">{session.user.name}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white border-0 py-1 px-4 focus:outline-none hover:bg-red-600 rounded text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                className="inline-flex items-center bg-white text-blue-500 border-0 py-1 px-4 focus:outline-none hover:bg-gray-100 rounded transition-colors font-medium"
                onClick={toggleDropdown}
              >
                Login
                <FaChevronDown className="ml-2 text-xs" />
              </button>

              {/* Desktop Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-xl overflow-hidden z-50">
                  <Link href="/login" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    Login
                  </Link>
                  <Link href="/sign" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY (Visible only when Open) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-blue-400 bg-[#42a5f5] rounded-b-2xl">
          <div className="flex flex-col p-4 space-y-4">
            
            {/* Mobile Links */}
            <Link href="/" onClick={closeMobileMenu} className="block hover:bg-blue-400 px-3 py-2 rounded transition-colors">Home</Link>
            {session?.user?.role === "admin" && (
              <Link href="/admin/admin_dashboard" onClick={closeMobileMenu} className="block hover:bg-blue-400 px-3 py-2 rounded transition-colors">Admin Panel</Link>
            )}
            <Link href="/steps" onClick={closeMobileMenu} className="block hover:bg-blue-400 px-3 py-2 rounded transition-colors">Book Appointment</Link>
            <Link href="/contact" onClick={closeMobileMenu} className="block hover:bg-blue-400 px-3 py-2 rounded transition-colors">Contact/Support</Link>
            <div className="px-3 py-2">
                <Appo />
            </div>

            <hr className="border-blue-300" />

            {/* Mobile Auth */}
            {session ? (
              <div className="flex flex-col space-y-3 px-3">
                <div className="flex items-center gap-2">
                  <FaUserCircle className="text-white text-xl" />
                  <span className="font-medium">{session.user.name}</span>
                </div>
                <button
                  onClick={() => { signOut(); closeMobileMenu(); }}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 text-center w-full"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 px-3">
                <Link 
                  href="/login" 
                  onClick={closeMobileMenu}
                  className="bg-white text-blue-500 py-2 px-4 rounded text-center font-medium hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link 
                  href="/sign" 
                  onClick={closeMobileMenu}
                  className="border border-white text-white py-2 px-4 rounded text-center font-medium hover:bg-blue-400"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;