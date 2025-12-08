"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user, login, logout, showToast } = useAuthStore();
  const router = useRouter();

  // Local State for Editing
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "",
  });

  // Load User Data on Mount
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Extract country code logic (simplified)
    const phone = user.phone || "";
    const code = phone.startsWith("+91")
      ? "+91"
      : phone.startsWith("+1")
      ? "+1"
      : "+91";
    const number = phone.replace(code, "");

    setFormData({
      name: user.name,
      email: user.email,
      phone: number,
      countryCode: code,
    });

    // Track Page View
    if (typeof window !== "undefined") {
      import("clevertap-web-sdk").then((ct) => {
        const clevertap = ct.default || ct;
        clevertap.event.push("Profile Viewed");
      });
    }
  }, [user, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Update Local Store (Re-using login action to update state)
    // In a real app, you'd have a specific 'updateUser' action, but 'login' works here
    await login(
      formData.name,
      formData.email,
      formData.countryCode,
      formData.phone
    );

    // 2. CLEVERTAP PROFILE PUSH (The Update Method)
    if (typeof window !== "undefined") {
      const ctModule = await import("clevertap-web-sdk");
      const clevertap = ctModule.default || ctModule;

      const fullPhone = `${formData.countryCode}${formData.phone}`;

      const profileUpdate = {
        Site: {
          Name: formData.name,
          Phone: fullPhone,
          Email: formData.email, // If email changed
          "Last Profile Update": new Date(),
        },
      };

      console.log("🚀 [CLEVERTAP] Pushing Profile Update:", profileUpdate);

      // This merges with the existing profile based on Identity/Email
      clevertap.profile.push(profileUpdate);

      // Track the Action Event
      clevertap.event.push("Profile Updated", { Status: "Success" });
    }

    showToast("Member Profile Updated Successfully");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-paper text-ink pt-32 px-8 lg:px-24 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-end mb-12 border-b border-gray-300 pb-8">
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-[#9F8155] font-bold">
              Membership ID: {user.identity.split("_")[1]}
            </span>
            <h1 className="font-serif text-5xl mt-4">Member Archive</h1>
          </div>
          <div className="w-16 h-16 rounded-full bg-ink text-white flex items-center justify-center font-serif text-2xl italic">
            {user.name.charAt(0)}
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-12">
          {/* NAME */}
          <div className="relative">
            <label className="block font-sans text-xs uppercase tracking-widest text-gray-500 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-transparent border-b border-gray-300 py-2 text-2xl font-serif text-ink focus:outline-none focus:border-[#9F8155] transition-colors"
            />
          </div>

          {/* EMAIL (Read Only visually, but editable if you want) */}
          <div className="relative opacity-70">
            <label className="block font-sans text-xs uppercase tracking-widest text-gray-500 mb-2">
              Email Identity (Locked)
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full bg-transparent border-b border-gray-300 py-2 text-2xl font-serif text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* PHONE */}
          <div className="flex gap-4">
            <div className="w-1/4">
              <label className="block font-sans text-xs uppercase tracking-widest text-gray-500 mb-2">
                Code
              </label>
              <select
                value={formData.countryCode}
                onChange={(e) =>
                  setFormData({ ...formData, countryCode: e.target.value })
                }
                className="w-full bg-transparent border-b border-gray-300 py-3 text-xl font-serif text-ink focus:outline-none"
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
            </div>
            <div className="w-3/4">
              <label className="block font-sans text-xs uppercase tracking-widest text-gray-500 mb-2">
                Mobile
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full bg-transparent border-b border-gray-300 py-2 text-2xl font-serif text-ink focus:outline-none focus:border-[#9F8155] transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-6 pt-8">
            <button
              type="submit"
              className="bg-[#1a1a1a] text-white px-8 py-4 font-sans text-xs uppercase tracking-widest hover:bg-[#9F8155] transition-colors"
            >
              Save Updates
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="border border-red-200 text-red-400 px-8 py-4 font-sans text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              Log Out
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
