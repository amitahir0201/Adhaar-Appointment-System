import { useState } from "react";
import { useRouter } from "next/router";
import { User, Mail, Lock, Loader2, UserPlus, ShieldAlert } from "lucide-react"; 
import Link from "next/link";

// IMPORTS: Ensure these paths match your actual file names
import Navbar from "../components/navbar"; 
import Footer from "../components/footer";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    adminId: ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Client-side Admin ID check
    if (formData.role === "admin" && formData.adminId !== "admin1234") {
      setError("Invalid Admin ID Credentials");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
      } else {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col ">
      
      {/* 1. HEADER */}
      {/* <Navbar /> */}

      {/* 2. MAIN CONTENT */}
      <main className="flex-grow flex items-center justify-center p-4">
        
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden my-8">
          
          {/* Card Header */}
          <div className="bg-[#42a5f9] p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm mb-4">
               <UserPlus className="text-white w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
          </div>

          <div className="p-8">
            {/* Messages */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center flex items-center justify-center gap-2">
                <ShieldAlert size={16} /> {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm text-center">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Admin ID Field (Conditional) */}
              {formData.role === "admin" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-sm font-medium text-gray-700">Admin Secret ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ShieldAlert className="h-5 w-5 text-red-400" />
                    </div>
                    <input
                      type="password"
                      name="adminId"
                      placeholder="Enter Admin ID"
                      className="block w-full pl-10 pr-3 py-3 border-2 border-red-100 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-colors bg-red-50/30"
                      value={formData.adminId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Creating Account...
                  </>
                ) : (
                  "Register"
                )}
              </button>

              {/* Footer Link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      {/* <Footer /> */}
    </div>
  );
}