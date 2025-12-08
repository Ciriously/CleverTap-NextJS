"use client";

import { useAuthStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserCircle, Bell, SignOut, Tote } from "@phosphor-icons/react";

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

  const handlePushRequest = async () => {
    if (typeof window !== "undefined") {
      const ctModule = await import("clevertap-web-sdk");
      const clevertap = (ctModule.default || ctModule) as any;

      console.log("🔔 [PUSH] Requesting Permission...");

      // 1. Check if notifications are already enabled
      if (Notification.permission === "granted") {
        showToast("Notifications are already enabled");
        return;
      }

      // 2. Trigger Soft Prompt (Simplified)
      // REMOVED: askAgainTimeInSeconds (This was causing the 'reading 5' crash)
      clevertap.notifications.push({
        titleText: "Unlock The Archive",
        bodyText: "Get notified about limited edition drops.",
        okButtonText: "Enable Access",
        rejectButtonText: "Later",
        serviceWorkerPath: "/clevertap_sw.js", // Ensure this file exists in /public
      });
    }
  };

  // Styles
  const isHome = pathname === "/";
  // Logic: Home top = White text (mix-blend). Scrolled or other pages = Ink text.
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
            className="font-sans text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-2"
          >
            {/* Added Tote Icon here for aesthetics */}
            <Tote size={18} weight="light" className="mb-1" />
            Cart
          </button>
        </nav>

        {/* AUTH & TOOLS */}
        {user ? (
          <div className="flex items-center gap-6">
            {/* 🔔 BELL ICON (With Ping Animation) */}
            <button
              onClick={handlePushRequest}
              className="group relative w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
              title="Enable Notifications"
            >
              <Bell
                size={24}
                weight="light"
                className="text-current group-hover:text-[#9F8155] transition-colors"
              />
              {/* Ping Animation */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#9F8155] rounded-full animate-ping opacity-75"></span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#9F8155] rounded-full"></span>
            </button>

            {/* PROFILE NAME */}
            <button
              onClick={() => router.push("/profile")}
              className="hidden md:block font-sans text-xs tracking-widest hover:text-[#9F8155] transition-colors"
            >
              {user.name.split(" ")[0].toUpperCase()}
            </button>

            {/* 👤 PROFILE ICON */}
            <div
              onClick={() => router.push("/profile")}
              className="cursor-pointer hover:scale-110 transition-transform hover:text-[#9F8155]"
            >
              <UserCircle size={28} weight="light" />
            </div>

            {/* 🚪 LOGOUT (Icon + Text) */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 border-l border-gray-300 pl-6 ml-2 transition-colors"
            >
              <SignOut size={16} weight="light" />
              <span>LOGOUT</span>
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
