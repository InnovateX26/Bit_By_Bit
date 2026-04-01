"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, ArrowRight, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  activePage?: string;
  setActivePage?: React.Dispatch<React.SetStateAction<string>>;
}

export default function Navbar({ activePage, setActivePage }: NavbarProps = {}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const isDashboard = pathname?.startsWith("/dashboard") ?? false;
  const isProfile = pathname?.startsWith("/dashboard/profile") ?? false;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cyan-300 shadow-lg" : "bg-cyan-200"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link href="/" className="text-3xl font-extrabold italic">
          caRebot+
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/faq">FAQ</Link>
          <Link href="/about">About</Link>

          {isDashboard || isProfile || user ? (
            // ✅ LOGOUT & PROFILE
            <div className="flex items-center gap-4">
              <Link href="/dashboard/profile">
                <button title="Profile" className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 hover:bg-cyan-200 transition">
                  <User size={20} />
                </button>
              </Link>
              {user && (
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                >
                  <LogOut size={16} /> Logout
                </button>
              )}
            </div>
          ) : (
            // ✅ AUTH BUTTONS
            <div className="flex gap-4">
              <Link href="/auth/signin">
                <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-500 hover:bg-gray-100 transition">
                  Sign In <ArrowRight size={16} />
                </button>
              </Link>

              <Link href="/auth/signup">
                <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-cyan-300 to-teal-300 shadow-md hover:scale-105 transition">
                  Signup <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-cyan-200 py-4 flex flex-col items-center gap-4">
          <Link href="/faq" onClick={toggleMobileMenu}>
            FAQ
          </Link>
          <Link href="/about" onClick={toggleMobileMenu}>
            About
          </Link>

          {isDashboard || isProfile || user ? (
            <>
              <Link href="/dashboard/profile" onClick={toggleMobileMenu}>
                Profile
              </Link>
              {user && (
                <button onClick={() => { logout(); toggleMobileMenu(); }}>Logout</button>
              )}
            </>
          ) : (
            <>
              <Link href="/auth/signin" onClick={toggleMobileMenu}>
                Sign In
              </Link>
              <Link href="/auth/signup" onClick={toggleMobileMenu}>
                Get Started Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
