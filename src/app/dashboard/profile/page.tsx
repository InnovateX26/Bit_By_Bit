"use client";

import { FormEvent, useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    location: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
      return;
    }
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        location: user.profile?.location || "",
      });
      if (searchParams.get("setup") === "1") {
        setIsEditing(true);
        setStatus("Complete your profile, then click Save & Continue.");
      }
    }
  }, [loading, user, router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("");
    setIsSaving(true);
    try {
      await updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        profile: {
          location: formData.location,
        },
      });
      setIsEditing(false);
      setStatus("Profile updated successfully.");
      if (searchParams.get("setup") === "1") {
        router.push("/dashboard");
      }
    } catch (error: any) {
      setStatus(error.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6">
        <p className="text-gray-600">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Sidebar (only visible on md and up) */}
        <aside className="hidden md:block w-12 md:w-16 bg-gray-200 p-2"></aside>

        {/* Profile Section for mobile (avatar above form) */}
        <section className="flex flex-col items-center justify-center w-full lg:hidden bg-gray-50 border-b px-6 py-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-cyan-300 flex items-center justify-center bg-gray-100">
              <img
                src="/avatar-placeholder.png"
                alt="avatar"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full"
              />
            </div>
            <button className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md">
              <Camera className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Greeting */}
          <div className="mt-6 text-center">
            <p className="text-lg sm:text-xl font-semibold">Hi,</p>
            <p className="text-xl sm:text-2xl font-bold">
              {formData.fullName || "User Name"}
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="flex-1 p-6 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6 w-full sm:w-[80%] mx-auto">
            <div>
              <label className="text-xs font-semibold">USER NAME</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none p-2 text-sm"
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="text-xs font-semibold">E-MAIL</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none p-2 text-sm"
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="text-xs font-semibold">MOBILE NUMBER</label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none p-2 text-sm"
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="text-xs font-semibold">LOCATION</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none p-2 text-sm"
                disabled={!isEditing}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing((prev) => !prev);
                  setStatus("");
                }}
                className="w-full sm:w-auto bg-cyan-100 px-6 py-2 rounded-full shadow-md hover:shadow-lg transition"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>

              {/* Save Button visible on phone */}
              <button
                type="submit"
                disabled={!isEditing || isSaving}
                className="block lg:hidden w-full sm:w-auto bg-cyan-500 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition"
              >
                {isSaving ? "Saving..." : "Save & Continue"}
              </button>
            </div>
            {status && <p className="text-sm text-slate-600">{status}</p>}
          </form>
        </section>

        {/* Profile Section for desktop/tablet */}
        <section className="hidden lg:flex flex-col items-center justify-center w-[45%] bg-gray-50 border-t lg:border-t-0 lg:border-l px-6 py-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-cyan-300 flex items-center justify-center bg-gray-100">
              <img
                src="/avatar-placeholder.png"
                alt="avatar"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full"
              />
            </div>
            <button className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md">
              <Camera className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Greeting */}
          <div className="mt-6 text-center">
            <p className="text-lg sm:text-xl font-semibold">Hi,</p>
            <p className="text-xl sm:text-2xl font-bold">
              {formData.fullName || "User Name"}
            </p>
          </div>

          <p className="mt-6 text-sm text-slate-500 text-center">
            Edit profile details from the form section and click Save.
          </p>
        </section>
      </div>
    </main>
  );
}
