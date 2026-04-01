"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield,
  MessageSquare,
  Pill,
  AlertTriangle,
  MapPin,
  Heart,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navigationItems = [ 
  { label: "Dashboard", href: "/dashboard", icon: MessageSquare },
  { label: "Chat Assistant", href: "/dashboard/chat", icon: MessageSquare },
  { label: "Medication", href: "/dashboard/MedicationAssistant", icon: Pill },
  { label: "Emergency", href: "/dashboard/emergency", icon: AlertTriangle },
  { label: "Nearby Services", href: "/dashboard/nearbyservices", icon: MapPin },
  { label: "Mental Wellness", href: "/dashboard/mental-wellness", icon: Heart },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#sidebar") && !target.closest("#hamburger")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    logout();
    router.push("/auth/signin");
  };

  // ✅ FIXED TITLE LOGIC
  const getPageTitle = () => {
    if (pathname.includes("/profile")) return "Account"; // ✅ FIX
    const item = navigationItems.find((nav) => nav.href === pathname);
    return item ? item.label : "Dashboard";
  };

  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#e8f6f6]">
        <p className="text-slate-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#e8f6f6] overflow-hidden">
      {/* Sidebar */}
      <nav
        id="sidebar"
        className={`fixed md:relative top-0 left-0 h-full w-72 bg-[#0c162c] flex flex-col justify-between transform transition-transform duration-300 z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 flex-shrink-0`}
      >
        <div className="flex flex-col h-full">
          <div className="pt-8 pb-6 px-6">
            <Link href="/" className="text-3xl font-extrabold italic text-white tracking-wide">
              caRebot<span className="text-cyan-400 not-italic">+</span>
            </Link>
          </div>

          <div className="px-5 mb-6">
            <div className="flex items-center gap-3 bg-[#16294a] text-gray-300 px-4 py-3 rounded-lg text-sm border border-[#233f6b]">
              <Shield size={16} className="text-cyan-400" />
              <span>Privacy-First AI</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col px-4 gap-2">
            {navigationItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-400 to-teal-300 text-black font-semibold"
                      : "text-gray-300 hover:bg-[#16294a] hover:text-white"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={18} />}
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-[#1e3458]">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-[#16294a] hover:text-white rounded-xl"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex flex-col h-screen min-w-0">
        <header className="h-16 border-b bg-[#e8f6f6] flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              id="hamburger"
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* ✅ FIXED TITLE */}
            <h1 className="text-xl font-bold text-gray-900">
              {getPageTitle()}
            </h1>
          </div>

          <Link href="/dashboard/profile">
            <button className="w-10 h-10 rounded-full bg-cyan-100">
              <User size={20} />
            </button>
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#e8f6f6]">
          {children}
        </main>
      </div>
    </div>
  );
}