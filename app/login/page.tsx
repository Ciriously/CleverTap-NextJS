"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../lib/store";
import { motion } from "framer-motion";
import Image from "next/image";

// Common Country Codes
const COUNTRY_CODES = [
  { code: "+91", label: "IN (+91)" },
  { code: "+1", label: "US (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+81", label: "JP (+81)" },
  { code: "+971", label: "UAE (+971)" },
];

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // Default

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    // Pass all data to store
    await login(name, email, countryCode, phone);

    router.push("/");
  };

  // Animation Variants
  const inputVariant = {
    focused: { y: -20, scale: 0.8, color: "#C6A87C" },
    blurred: { y: 0, scale: 1, color: "#9ca3af" },
  };

  return (
    <main className="min-h-screen w-full flex bg-paper overflow-hidden">
      {/* LEFT SIDE: Form */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center p-12 lg:p-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-12">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold font-bold">
              Chapter 01
            </span>
            <h1 className="font-serif text-5xl lg:text-6xl mt-4 text-ink">
              Identify <br /> Yourself.
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-10">
            {/* 1. NAME FIELD */}
            <div className="relative border-b border-gray-300 py-2">
              <motion.label
                className="absolute left-0 origin-left font-sans text-sm uppercase tracking-widest pointer-events-none"
                initial="blurred"
                animate={
                  focusedField === "name" || name ? "focused" : "blurred"
                }
                variants={inputVariant}
              >
                Full Name
              </motion.label>
              <input
                type="text"
                value={name}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-2xl font-serif text-ink focus:outline-none pt-2"
              />
              <motion.div
                className="absolute bottom-[-1px] left-0 h-[2px] bg-gold w-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: focusedField === "name" ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                style={{ originX: 0 }}
              />
            </div>

            {/* 2. EMAIL FIELD */}
            <div className="relative border-b border-gray-300 py-2">
              <motion.label
                className="absolute left-0 origin-left font-sans text-sm uppercase tracking-widest pointer-events-none"
                initial="blurred"
                animate={
                  focusedField === "email" || email ? "focused" : "blurred"
                }
                variants={inputVariant}
              >
                Email Address
              </motion.label>
              <input
                type="email"
                value={email}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-2xl font-serif text-ink focus:outline-none pt-2"
              />
              <motion.div
                className="absolute bottom-[-1px] left-0 h-[2px] bg-gold w-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: focusedField === "email" ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                style={{ originX: 0 }}
              />
            </div>

            {/* 3. PHONE SECTION (Split Input) */}
            <div className="flex items-end gap-4">
              {/* Country Code Dropdown */}
              <div className="w-[30%] relative border-b border-gray-300 py-2">
                <label className="font-sans text-[10px] uppercase tracking-widest text-gold absolute -top-2">
                  Code
                </label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full bg-transparent text-xl font-serif text-ink focus:outline-none appearance-none cursor-pointer"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone Input */}
              <div className="w-[70%] relative border-b border-gray-300 py-2">
                <motion.label
                  className="absolute left-0 origin-left font-sans text-sm uppercase tracking-widest pointer-events-none"
                  initial="blurred"
                  animate={
                    focusedField === "phone" || phone ? "focused" : "blurred"
                  }
                  variants={inputVariant}
                >
                  Mobile Number
                </motion.label>
                <input
                  type="tel"
                  value={phone}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent text-2xl font-serif text-ink focus:outline-none pt-2"
                />
                <motion.div
                  className="absolute bottom-[-1px] left-0 h-[2px] bg-gold w-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: focusedField === "phone" ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ originX: 0 }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="group flex items-center gap-4 text-ink hover:text-gold transition-colors duration-300 mt-8"
            >
              <span className="font-sans text-xs uppercase tracking-[0.2em] font-bold">
                Generate ID & Enter
              </span>
              <span className="w-12 h-[1px] bg-currentColor group-hover:w-24 transition-all duration-300 bg-ink group-hover:bg-gold"></span>
            </button>
          </form>
        </motion.div>
      </div>

      {/* RIGHT SIDE: Visual */}
      <motion.div
        className="hidden lg:block w-[60%] relative h-screen bg-[#1a1a1a]"
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
      >
        <Image
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2256"
          alt="Abstract Library"
          fill
          className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute bottom-12 right-12 text-right">
          <p className="text-white/40 font-sans text-xs uppercase tracking-widest">
            Est. 2025
          </p>
          <p className="text-white/40 font-serif italic text-xl">
            Curated for the mind.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
