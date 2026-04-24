"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type NativeData = {
  msgId: string;
  pivotId?: string;
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
    // The SDK dispatches 'CT_web_native_display' on document when a KV-pair
    // native display campaign triggers. detail = { msgId, pivotId?, kv: {...} }
    const handleNativeDisplay = (e: Event) => {
      const { msgId, pivotId, kv } = (e as CustomEvent).detail ?? {};

      if (!kv || !kv.title) return;

      setData({
        msgId,
        pivotId,
        title: kv.title,
        message: kv.message ?? "",
        image_url: kv.image_url ?? "",
        cta_text: kv.cta_text ?? "Explore",
        cta_url: kv.cta_url ?? "/shop",
        bg_color: kv.bg_color,
      });

      // Track impression
      if (typeof window !== "undefined" && window.clevertap) {
        window.clevertap.renderNotificationViewed({ msgId, pivotId });
      }
    };

    document.addEventListener("CT_web_native_display", handleNativeDisplay);
    return () => {
      document.removeEventListener("CT_web_native_display", handleNativeDisplay);
    };
  }, []);

  if (!data) return null;

  const handleClick = () => {
    if (typeof window !== "undefined" && window.clevertap) {
      window.clevertap.renderNotificationClicked({
        msgId: data.msgId,
        pivotId: data.pivotId,
      });
    }
    router.push(data.cta_url);
  };

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
              type="button"
              onClick={handleClick}
              className="group flex items-center gap-4 text-white hover:text-[#9F8155] transition-colors"
            >
              <span className="font-sans text-xs uppercase tracking-widest font-bold">
                {data.cta_text}
              </span>
              <span className="w-12 h-px bg-white group-hover:w-24 transition-all duration-300 group-hover:bg-[#9F8155]"></span>
            </button>
          </div>

          {/* IMAGE SIDE */}
          {data.image_url && (
            <div className="w-full lg:w-1/2 h-[300px] lg:h-[500px] relative">
              <Image
                src={data.image_url}
                alt={data.title}
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-linear-to-r from-ink via-transparent to-transparent" />
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
