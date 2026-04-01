"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: "",
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

    try {
      await login(formData.emailOrMobile, formData.password);
      // Redirect to dashboard after successful sign in
      router.push("/dashboard");
      router.refresh(); // Force refresh to update navbar
    } catch (error: any) {
      setError(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 via-white to-sky-300 bg-[length:400%_400%] animate-backgroundMove">
      <Card className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(56,189,248,0.6)]">
        
        {/* Left Side - Login Form */}
        <div className="flex flex-col justify-center items-center p-10 bg-white/90 backdrop-blur-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
          <p className="text-lg font-medium bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-transparent mb-6 animate-pulse">
            Let's Get You Started with Carebot
          </p>

          {error && (
            <div className="w-full max-w-md mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
            <Input
              name="emailOrMobile"
              value={formData.emailOrMobile}
              onChange={handleInputChange}
              placeholder="Email or Mobile Number"
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.6)] transition-all duration-300"
              required
            />
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.6)] transition-all duration-300"
              required
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login Now"}
            </Button>

            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <Link href="/auth/signin" className="hover:text-sky-600">
                Forgot Password?
              </Link>
              <Link href="/auth/signup" className="hover:text-sky-600">
                Create Account
              </Link>
            </div>
          </form>

        </div>

        {/* Right Side - Welcome Section */}
        <div className="relative flex items-center justify-center bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-wide drop-shadow-2xl animate-textGlow text-center">
            Welcome to <br /> Carebot
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
        .animate-textGlow {
          animation: glow 2.5s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
};

export default LoginPage;
