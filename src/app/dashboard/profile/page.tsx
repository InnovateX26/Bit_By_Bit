"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
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

  const [originalData, setOriginalData] = useState(formData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");

  const [image, setImage] = useState("/avatar-placeholder.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
      return;
    }
    if (user) {
      const data = {
        fullName: user.fullName || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        location: user.profile?.location || "",
      };

      setFormData(data);
      setOriginalData(data);

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

  const isChanged =
    formData.fullName !== originalData.fullName ||
    formData.email !== originalData.email ||
    formData.mobileNumber !== originalData.mobileNumber ||
    formData.location !== originalData.location;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
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
        profile: { location: formData.location },
      });

      setOriginalData(formData);
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
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-4"> {/* 🔥 reduced padding */}

      {/* ✅ HEADER FIX */}
      <h1 className="text-xl font-semibold mb-4 ml-2">Account</h1>

      <div className="flex justify-center">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg overflow-hidden">

          <aside className="hidden md:block w-12 md:w-16 bg-gray-200"></aside>

          {/* FORM */}
          <section className="flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-6 w-full sm:w-[80%] mx-auto">

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-600">Name</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} disabled={!isEditing} className="w-full border-b p-2" />

                <label className="block text-sm font-medium text-slate-600">Email</label>
                <input name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} className="w-full border-b p-2" />

                <label className="block text-sm font-medium text-slate-600">Phone No.</label>
                <input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} disabled={!isEditing} className="w-full border-b p-2" />

                <label className="block text-sm font-medium text-slate-600">Location</label>
                <input name="location" value={formData.location} onChange={handleChange} disabled={!isEditing} className="w-full border-b p-2" />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing((prev) => !prev);
                    setStatus("");
                  }}
                  className="bg-cyan-100 px-6 py-2 rounded-full"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>

                {isEditing && isChanged && (
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-cyan-500 text-white px-6 py-2 rounded-full"
                  >
                    {isSaving ? "Saving..." : "Save & Continue"}
                  </button>
                )}
              </div>

              {status && <p>{status}</p>}
            </form>
          </section>

          {/* PROFILE */}
          <section className="hidden lg:flex flex-col items-center justify-center w-[45%] bg-gray-50 p-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-cyan-300 overflow-hidden">
                <img src={image} className="w-full h-full object-cover" />
              </div>

              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow"
                >
                  <Camera className="w-5 h-5" />
                </button>
              )}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <p className="mt-4 font-bold">{formData.fullName}</p>
          </section>

        </div>
      </div>
    </main>
  );
}