"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../lib/store";

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
            className="bg-ink/90 backdrop-blur-md text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 cursor-pointer"
            onClick={hideToast}
          >
            {/* Icon */}
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>

            {/* Text */}
            <span className="font-sans text-xs uppercase tracking-widest font-bold">
              {toast.message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
