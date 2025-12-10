import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AdminHeader({ onExport }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => router.pathname === path;

  // Navigation Configuration
  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/admin_dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
      ),
    },
    {
      name: "Book Slots",
      href: "/admin/slots",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      ),
    },
    {
      name: "Offline Mode",
      href: "/admin/offline_dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" /></svg>
      ),
    },
    {
      name: "Verify App",
      href: "/admin/update-form",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ),
    },
  ];

  const handleLogout = () => {
    // Add logic
    router.push("/login");
  };

  return (
    <header className="bg-[#42a5f5] sticky top-0 z-50 shadow-md shadow-blue-900/5">
      {/* Background: Light Blue Gradient 
        backdrop-blur makes it look like frosted glass 
      */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 opacity-95 backdrop-blur-xl border-b border-blue-200"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* --- 1. Logo Section --- */}
          <div 
            onClick={() => router.push("/admin/admin_dashboard")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Logo Icon Box */}
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-200">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight leading-none">
                Admin<span className="text-blue-600">Portal</span>
              </h1>
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">
                Appointment System
              </span>
            </div>
          </div>

          {/* --- 2. Desktop Navigation Pills --- */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/50 p-1.5 rounded-full border border-blue-200 shadow-sm">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 translate-y-[-1px]"
                      : "text-blue-800 hover:bg-blue-100/80 hover:text-blue-900"
                  }`}
                >
                  {/* Show icon only if active or hovered (optional, keeping visible here for clarity) */}
                  <span className={active ? "text-blue-200" : "text-blue-500"}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* --- 3. Right Actions (Buttons & Logout) --- */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Export Button */}
            {onExport && (
              <button
                onClick={onExport}
                className="text-blue-700 font-semibold text-sm hover:text-blue-900 transition underline decoration-blue-300 underline-offset-4"
              >
                Export CSV
              </button>
            )}

            {/* Add App Button */}
            <Link
              href="/form"
              className="flex items-center gap-2 bg-white text-blue-700 border border-blue-200 hover:border-blue-300 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              New App
            </Link>

            {/* Logout / User Profile */}
            <div className="h-8 w-px bg-blue-200 mx-1"></div>
            
            <button
              onClick={handleLogout}
              className="group flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
              title="Logout"
            >
              <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                AD
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-blue-900">Admin</span>
                <span className="text-[10px] font-medium text-blue-400 group-hover:text-red-500 transition-colors flex items-center gap-1">
                  Log out
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </span>
              </div>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-blue-900 bg-blue-100 p-2 rounded-md hover:bg-blue-200 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* --- 4. Mobile Menu (Slide Down) --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-blue-50/95 backdrop-blur-xl border-b border-blue-200 shadow-xl">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${
                  isActive(item.href)
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-blue-800 hover:bg-blue-100"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            
            <div className="border-t border-blue-200 my-2 pt-2 space-y-2">
               <Link
                href="/form"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-blue-700 bg-white border border-blue-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                New Application
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}