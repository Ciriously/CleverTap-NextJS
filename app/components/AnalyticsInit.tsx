"use client";

import { useEffect } from "react";

export default function AnalyticsInit() {
  useEffect(() => {
    const initCleverTap = async () => {
      if (typeof window === "undefined") return;

      try {
        console.log("🔌 [SYSTEM] Loading CleverTap Module...");

        const ctModule = await import("clevertap-web-sdk");
        const clevertap = ctModule.default;

        // 👇 USE ENV VARIABLE HERE
        const accountId = process.env.NEXT_PUBLIC_CLEVERTAP_ID;

        if (!accountId) {
          console.error(
            "❌ [CONFIG] Missing NEXT_PUBLIC_CLEVERTAP_ID in .env.local"
          );
          return;
        }

        clevertap.init(accountId, "eu1");
        clevertap.setLogLevel(3);

        console.log("✅ [SUCCESS] CleverTap Initialized with ID:", accountId);
      } catch (err) {
        console.error("❌ [CRITICAL] CleverTap Failed to Init:", err);
      }
    };

    initCleverTap();
  }, []);

  return null;
}
