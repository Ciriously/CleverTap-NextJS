"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type NativeData = {
  title: string;
  message: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  bg_color?: string;
};

export default function NativeSpotlight() {
  const [data, setData] = useState<NativeData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkNativeDisplay = async () => {
      if (typeof window !== "undefined") {
        const ctModule = await import("clevertap-web-sdk");

        // 👇 THE FIX: Cast to 'any' to stop TypeScript complaining
        const clevertap = (ctModule.default || ctModule) as any;

        // Safety check: Ensure nativeDisplay module is available
        if (!clevertap.nativeDisplay) {
          console.warn("⚠️ CleverTap Native Display module not found.");
          return;
        }

        console.log("📡 [NATIVE] Checking for Display Units...");

        clevertap.nativeDisplay.getDisplayUnits({
          callback: (units: any) => {
            console.log("📡 [NATIVE] Units received:", units);

            if (units && units.length > 0) {
              const unit = units[0];
              const content = unit.content[0];

              setData({
                title: content.title.text,
                message: content.message.text,
                image_url: content.media.url,
                cta_text: content.action.text,
                cta_url: content.action.url.android || "/shop",
                bg_color: unit.custom_kv?.bg_color,
              });

              // Track Impression
              clevertap.nativeDisplay.recordDisplayUnitViewed(unit.unit_id);
            } else {
              console.log("📡 [NATIVE] No active campaigns found.");
            }
          },
        });
      }
    };

    checkNativeDisplay();
  }, []);

  if (!data) return null;

  return (
    <section className="w-full py-24 px-8 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full rounded-sm overflow-hidden relative shadow-2xl"
        style={{ backgroundColor: data.bg_color || "#1a1a1a" }}
      >
        <div className="flex flex-col lg:flex-row items-center">
          {/* TEXT SIDE */}
          <div className="w-full lg:w-1/2 p-12 lg:p-24 text-white z-10 relative">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-[#9F8155] font-bold mb-4 block">
              Exclusive Feature
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl mb-6 leading-tight">
              {data.title}
            </h2>
            <p className="font-sans text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
              {data.message}
            </p>

            <button
              onClick={() => {
                // Track Click manually if needed
                console.log("Native Ad Clicked");
                router.push(data.cta_url);
              }}
              className="group flex items-center gap-4 text-white hover:text-[#9F8155] transition-colors"
            >
              <span className="font-sans text-xs uppercase tracking-widest font-bold">
                {data.cta_text}
              </span>
              <span className="w-12 h-px bg-white group-hover:w-24 transition-all duration-300 group-hover:bg-[#9F8155]"></span>
            </button>
          </div>

          {/* IMAGE SIDE */}
          <div className="w-full lg:w-1/2 h-[300px] lg:h-[500px] relative">
            <Image
              src={data.image_url}
              alt={data.title}
              fill
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-transparent to-transparent" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
