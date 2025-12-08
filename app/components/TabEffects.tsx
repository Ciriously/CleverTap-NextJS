"use client";

import { useEffect } from "react";

export default function TabEffects() {
  useEffect(() => {
    // Store original values
    const originalTitle = document.title;
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 1. User Left the Tab
        document.title = "The Archive Awaits...";
        themeMeta?.setAttribute("content", "#1a1a1a"); // Turn browser bar Black
      } else {
        // 2. User Came Back
        document.title = originalTitle;
        themeMeta?.setAttribute("content", "#Fdfbf7"); // Turn browser bar Paper White
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
