"use client";
import { motion } from "framer-motion";

export default function Manifesto() {
  return (
    <div className="w-full bg-[#9F8155] text-white py-4 overflow-hidden relative z-20">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-12 mx-6">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em]">
              Free Worldwide Shipping
            </span>
            <span className="w-2 h-2 rounded-full bg-white/50"></span>
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em]">
              Secure Encryption
            </span>
            <span className="w-2 h-2 rounded-full bg-white/50"></span>
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em]">
              First Edition Quality
            </span>
            <span className="w-2 h-2 rounded-full bg-white/50"></span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
