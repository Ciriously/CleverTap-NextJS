"use client";

import { useState } from "react";
import {
  InstagramLogo,
  TwitterLogo,
  Globe,
  ArrowRight,
} from "@phosphor-icons/react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // CleverTap Integration
    if (typeof window !== "undefined") {
      const ctModule = await import("clevertap-web-sdk");
      const ct = ctModule.default || ctModule;

      // 1. Update Profile
      ct.onUserLogin.push({
        Site: {
          Email: email,
          "Newsletter Sub": true,
        },
      });

      // 2. Track Event
      ct.event.push("Newsletter Subscribed", { Source: "Footer" });

      alert("Welcome to the inner circle.");
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#1a1a1a] text-[#Fdfbf7] px-8 lg:px-24 pt-32 pb-12 relative overflow-hidden">
      {/* 1. NEWSLETTER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start mb-32 relative z-10">
        <div className="max-w-xl">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-[#9F8155] font-bold mb-6 block">
            Stay Updated
          </span>
          <h2 className="font-serif text-5xl lg:text-7xl leading-[0.9] mb-8">
            Join the <br /> <span className="italic text-[#555]">Archive.</span>
          </h2>
        </div>

        <form
          onSubmit={handleSubscribe}
          className="w-full lg:w-1/3 mt-12 lg:mt-0"
        >
          <div className="relative border-b border-[#333] pb-4 group hover:border-[#Fdfbf7] transition-colors duration-500 flex items-center">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-xl font-serif focus:outline-none placeholder:text-[#333] text-[#Fdfbf7]"
            />
            <button
              type="submit"
              className="text-[#9F8155] opacity-50 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 transform"
              title="Subscribe"
            >
              <ArrowRight size={24} weight="light" />
            </button>
          </div>
        </form>
      </div>

      {/* 2. LINKS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 border-t border-[#333] pt-16 mb-32 relative z-10">
        <div className="space-y-4">
          <h4 className="font-sans text-xs uppercase tracking-widest text-[#555]">
            Explore
          </h4>
          <ul className="space-y-2 font-serif text-lg text-[#aaa]">
            <li>
              <a href="/shop" className="hover:text-white transition-colors">
                Shop All
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Best Sellers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                New Arrivals
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-sans text-xs uppercase tracking-widest text-[#555]">
            Support
          </h4>
          <ul className="space-y-2 font-serif text-lg text-[#aaa]">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Shipping
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Returns
              </a>
            </li>
          </ul>
        </div>

        {/* SOCIAL ICONS (UPDATED) */}
        <div className="space-y-4">
          <h4 className="font-sans text-xs uppercase tracking-widest text-[#555]">
            Social
          </h4>
          <div className="flex gap-6 text-[#aaa]">
            <a
              href="#"
              className="hover:text-[#9F8155] transition-colors hover:scale-110 transform duration-300"
            >
              <InstagramLogo size={24} weight="light" />
            </a>
            <a
              href="#"
              className="hover:text-[#9F8155] transition-colors hover:scale-110 transform duration-300"
            >
              <TwitterLogo size={24} weight="light" />
            </a>
            <a
              href="#"
              className="hover:text-[#9F8155] transition-colors hover:scale-110 transform duration-300"
            >
              <Globe size={24} weight="light" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. MASSIVE BRANDING */}
      <div className="relative z-10">
        <h1 className="font-sans font-black text-[12vw] leading-none text-center text-[#222] select-none tracking-tighter">
          CURATED.
        </h1>
      </div>

      {/* 4. BACKGROUND GRAIN */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
    </footer>
  );
}
