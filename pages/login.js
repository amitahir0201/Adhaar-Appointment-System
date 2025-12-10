import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Mail, Lock, ShieldAlert, User, Loader2 } from "lucide-react";
import Link from "next/link";

// IMPORTS: Adjust these paths based on where your files are located
import Header from "../components/navbar"; 
import Footer from "../components/footer";
import Navbar from "../components/navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [adminId, setAdminId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Client-side Admin ID check
    if (role === "admin" && adminId !== "admin1234") {
      setError("Invalid Admin ID Credentials");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!result.error) {
        if (role === "admin") {
          router.push("/admin/admin_dashboard");
        } else {
          router.push("/");
        }
      } else {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    // OUTER CONTAINER: Flex column with the specific background color
    <div className="min-h-screen flex flex-col ">
      
      {/* 1. HEADER */}
      <Navbar />

      {/* 2. MAIN CONTENT (Login Form) */}
      {/* flex-grow ensures this takes up available space between header and footer */}
      <main className="flex-grow flex items-center justify-center p-4">
        
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden my-8">
          
          {/* Form Header */}
          <div className="bg-[#42a5f9] p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm mb-4">
               <User className="text-white w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-blue-100 mt-2 text-sm">Sign in to access the Darshan Portal</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Role Selection Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg mb-6">
                <button
                  type="button"
                  onClick={() => { setRole("user"); setError(""); }}
                  className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all ${
                    role === "user" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <User size={16} />
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => { setRole("admin"); setError(""); }}
                  className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all ${
                    role === "admin" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <ShieldAlert size={16} />
                  Official
                </button>
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Admin ID Field (Animated) */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${role === "admin" ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="space-y-2 pt-1">
                  <label className="text-sm font-medium text-gray-700">Admin Secret ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ShieldAlert className="h-5 w-5 text-red-400" />
                    </div>
                    <input
                      type="password"
                      placeholder="Enter Admin ID"
                      className="block w-full pl-10 pr-3 py-3 border-2 border-red-100 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-colors bg-red-50/30"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      required={role === "admin"}
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm animate-pulse">
                  <ShieldAlert size={16} />
                  {error}
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
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Login Footer */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{" "}
                <Link href="/sign" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <Footer />
    </div>
  );
}