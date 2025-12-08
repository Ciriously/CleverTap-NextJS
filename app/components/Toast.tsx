"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/store";
import { CheckCircle } from "@phosphor-icons/react";

export default function Toast() {
  const { toast, hideToast } = useAuthStore();

  return (
    <AnimatePresence>
      {toast.isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10000]"
        >
          <div
            className="bg-[#1a1a1a]/95 backdrop-blur-md text-white pl-6 pr-8 py-4 rounded-full shadow-2xl flex items-center gap-4 cursor-pointer border border-[#333]"
            onClick={hideToast}
          >
            {/* SUCCESS ICON */}
            <CheckCircle size={24} weight="light" className="text-[#9F8155]" />

            {/* MESSAGE */}
            <span className="font-sans text-[10px] uppercase tracking-widest font-bold">
              {toast.message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
