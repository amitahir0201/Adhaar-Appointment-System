import React from "react";
import Link from "next/link";

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-blue-200 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* 1. Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-base font-bold text-blue-900 tracking-tight">
              Adhaar Appointment System
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              &copy; {currentYear} Government of India. All rights reserved.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="/support" className="hover:text-blue-600 transition-colors">
              Help Center
            </Link>
          </div>

          {/* 3. System Status & Version (Professional Touch) */}
          <div className="flex items-center gap-4">
            {/* Status Badge */}
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] uppercase font-bold text-green-700 tracking-wider">
                System Online
              </span>
            </div>

            <span className="text-xs text-slate-400 font-mono">
              v2.4.0
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}