"use client";

import { useAuthStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const { user, logout, showToast } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    showToast("Successfully Logged Out");
    router.push("/");
    router.refresh();
  };

  // --- NEW: HANDLE PUSH PERMISSION ---
  const handlePushRequest = async () => {
    if (typeof window !== "undefined") {
      // Dynamic import to load SDK
      const ctModule = await import("clevertap-web-sdk");
      const clevertap = (ctModule.default || ctModule) as any; // Cast to any to avoid TS errors

      console.log("🔔 [PUSH] Requesting Permission...");

      // 1. Request Permission
      clevertap.notifications.push({
        titleText: "Unlock The Archive",
        bodyText: "Get notified about limited edition drops.",
        okButtonText: "Enable",
        rejectButtonText: "Later",
        askAgainTimeInSeconds: 5,
        serviceWorkerPath: "/clevertap_sw.js", // Explicit path
      });

      // Visual feedback
      showToast("Check your browser permissions");
    }
  };

  // Styles
  const isHome = pathname === "/";
  const headerClass =
    isHome && !scrolled
      ? "fixed top-0 left-0 w-full z-50 p-8 text-white mix-blend-difference transition-all duration-300"
      : "fixed top-0 left-0 w-full z-50 px-8 py-4 bg-paper/90 backdrop-blur-md text-ink border-b border-gray-200 transition-all duration-300";

  return (
    <header className={headerClass}>
      <div className="flex justify-between items-center max-w-[1800px] mx-auto">
        {/* LOGO */}
        <div
          onClick={() => router.push("/")}
          className="font-serif font-bold text-xl cursor-pointer"
        >
          CURATED.
        </div>

        {/* NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => router.push("/shop")}
            className="font-sans text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            The Collection
          </button>
          <button
            onClick={() => router.push("/cart")}
            className="font-sans text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            Cart
          </button>
        </nav>

        {/* AUTH & TOOLS */}
        {user ? (
          <div className="flex items-center gap-6">
            {/* 🔔 NEW: BELL ICON (Push Trigger) */}
            <button
              onClick={handlePushRequest}
              className="group relative w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
              title="Enable Notifications"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
              {/* Ping Animation */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#9F8155] rounded-full animate-ping opacity-75"></span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#9F8155] rounded-full"></span>
            </button>

            {/* Profile Name */}
            <button
              onClick={() => router.push("/profile")}
              className="hidden md:block font-sans text-xs tracking-widest hover:text-[#9F8155] transition-colors"
            >
              {user.name.split(" ")[0].toUpperCase()}
            </button>

            {/* Profile Icon */}
            <div
              onClick={() => router.push("/profile")}
              className="w-8 h-8 rounded-full bg-[#9F8155] flex items-center justify-center cursor-pointer text-white font-serif italic"
            >
              {user.name.charAt(0)}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="font-sans text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 border-l border-gray-300 pl-6 ml-2 transition-colors"
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className={`font-sans text-xs font-bold uppercase tracking-widest border px-6 py-2 transition-colors ${
              isHome && !scrolled
                ? "border-white hover:bg-white hover:text-black"
                : "border-ink hover:bg-ink hover:text-white"
            }`}
          >
            LOGIN
          </button>
        )}
      </div>
    </header>
  );
}
