// app/auth/signup/page.tsx
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FacebookIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";

const SignupPage = () => {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await signup(formData);
      // Redirect to dashboard after successful signup
      router.push("/dashboard");
      router.refresh(); // Force refresh to update navbar
    } catch (error: any) {
      setError(error.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 via-white to-sky-300 bg-[length:400%_400%] animate-backgroundMove">
      <Card className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(56,189,248,0.6)]">
        
        {/* Left Side - Form */}
        <div className="flex flex-col justify-center items-center p-10 bg-white">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">SIGN UP</h2>
          <p className="text-sm text-gray-500 mb-6">
            Create your account and get started today!
          </p>

          {error && (
            <div className="w-full max-w-md mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-md">
            {/* Full Name */}
            <Input 
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name" 
              className="mb-4 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-sky-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.6)]" 
              required
            />

            {/* Email */}
            <Input 
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address" 
              className="mb-4 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-sky-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.6)]" 
              required
            />

            {/* Mobile */}
            <Input 
              name="mobileNumber"
              type="tel" 
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="Mobile Number" 
              className="mb-4 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-sky-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.6)]" 
              required
            />

            {/* Password */}
            <Input 
              name="password"
              type="password" 
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password" 
              className="mb-4 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-sky-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.6)]" 
              required
            />

            {/* Confirm Password */}
            <Input 
              name="confirmPassword"
              type="password" 
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password" 
              className="mb-6 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-sky-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.6)]" 
              required
            />

            {/* Signup Button */}
            <Button 
              type="submit"
              disabled={loading}
              className="w-full py-3 mb-4 bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Login Link */}
            <div className="text-center mb-4">
              <Link href="/auth/signin" className="text-sky-600 hover:text-sky-700 text-sm">
                Already have an account? Login here
              </Link>
            </div>

            {/* Divider */}
            <div className="flex items-center w-full my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-2 text-gray-500 text-sm">or sign up with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Social Buttons */}
            <div className="flex flex-col space-y-3 w-full">
              <Button variant="outline" className="flex items-center justify-center py-3 rounded-lg border-gray-300 hover:bg-gray-100">
                <img src="/google.svg" alt="Google" className="w-5 h-5" />
                <span className="ml-2 text-sm">Sign up with Google</span>
              </Button>

              <Button variant="outline" className="flex items-center justify-center py-3 rounded-lg border-gray-300 hover:bg-gray-100">
                <FacebookIcon className="w-5 h-5 text-blue-600" />
                <span className="ml-2 text-sm">Sign up with Facebook</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Right Side - Gradient with Glowing Text */}
        <div className="relative flex items-center justify-center bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-center p-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg animate-glow">
            Drive Smarter with Carebot
          </h1>
        </div>
      </Card>

      {/* Animations */}
      <style jsx>{`
        @keyframes backgroundMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-backgroundMove {
          animation: backgroundMove 20s ease infinite; /* slowed down */
        }
        @keyframes glow {
          0% { text-shadow: 0 0 10px rgba(255,255,255,0.6), 0 0 20px rgba(56,189,248,0.8); }
          50% { text-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(56,189,248,1); }
          100% { text-shadow: 0 0 10px rgba(255,255,255,0.6), 0 0 20px rgba(56,189,248,0.8); }
        }
        .animate-glow {
          animation: glow 2.5s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
};

export default SignupPage;
