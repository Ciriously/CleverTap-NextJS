"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useEffect, useState } from "react";

// --- COMPONENTS ---
import NativeSpotlight from "./components/NativeSpotlight";
import Footer from "./components/Footer";
import Manifesto from "./components/Manifesto";

// --- TYPES ---
type HeroBook = {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  price: number;
};

// --- PARTICLE COMPONENT (Subtle Dust) ---
const FloatingParticles = () => {
  // 1. Start with empty state (matches server)
  const [particles, setParticles] = useState<any[]>([]);

  // 2. Generate random numbers ONLY on the client
  useEffect(() => {
    const generatedParticles = [...Array(8)].map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 10,
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#9F8155] opacity-20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const { user, logout, addToCart } = useAuthStore();
  const router = useRouter();

  const [book, setBook] = useState<HeroBook | null>(null);
  const [loading, setLoading] = useState(true);

  // Scroll Parallax for Marquee (Only reacts to scrolling, not mouse)
  const { scrollYProgress } = useScroll();
  const marqueeX = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // --- FETCH HERO BOOK ---
  useEffect(() => {
    const fetchHeroBook = async () => {
      try {
        // Fetch "Design" books
        const response = await fetch(
          "https://www.googleapis.com/books/v1/volumes?q=subject:design&orderBy=newest&langRestrict=en&maxResults=5"
        );
        const data = await response.json();

        const validBook = data.items?.find(
          (item: any) =>
            item.volumeInfo.imageLinks?.thumbnail && item.volumeInfo.description
        );

        if (!validBook) return;

        const info = validBook.volumeInfo;
        const rawImage = info.imageLinks.thumbnail;
        const highResImage = rawImage
          .replace("http:", "https:")
          .replace("&zoom=1", "&zoom=0");

        setBook({
          id: validBook.id,
          title: info.title,
          author: info.authors?.[0] || "Unknown Author",
          description:
            info.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 150) +
            "...",
          coverUrl: highResImage,
          price: parseFloat((25 + (info.title.length % 15)).toFixed(2)),
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroBook();
  }, []);

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!book) return;

    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      coverUrl: book.coverUrl,
      quantity: 1,
    });

    if (typeof window !== "undefined") {
      const ctModule = await import("clevertap-web-sdk");
      const ct = ctModule.default || ctModule;
      ct.event.push("Added to Cart", {
        "Product Name": book.title,
        Category: "Hero Section",
      });
    }
  };

  return (
    <main className="min-h-screen w-full bg-paper flex flex-col overflow-x-hidden relative">
      {/* --- HERO SECTION --- */}
      <section className="relative w-full lg:h-screen flex flex-col lg:flex-row">
        {/* PARTICLES (Subtle Background movement) */}
        <FloatingParticles />

        {/* LOADING STATE */}
        {loading || !book ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-[400px] w-[280px] bg-gray-200 rounded-sm shadow-xl"></div>
            </div>
          </div>
        ) : (
          <>
            {/* LEFT SIDE: TEXT (Stable) */}
            <div className="w-full lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center z-10 pt-32 lg:pt-0">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <span className="h-[1px] w-12 bg-[#9F8155]"></span>
                  <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#9F8155] font-bold">
                    Editor's Choice
                  </span>
                </div>

                <h1 className="font-serif text-6xl lg:text-8xl leading-[0.9] text-ink line-clamp-3 mix-blend-darken">
                  {book.title}
                </h1>

                <p className="font-serif italic text-2xl text-gray-400">
                  by {book.author}
                </p>

                <p className="font-sans text-gray-600 max-w-md text-lg leading-relaxed pt-4 line-clamp-3">
                  {book.description}
                </p>

                <div className="pt-8 flex gap-6">
                  <button
                    onClick={handleAddToCart}
                    className="group relative px-8 py-4 bg-ink text-white font-sans text-sm tracking-widest overflow-hidden shadow-2xl hover:scale-105 transition-transform"
                  >
                    <span className="relative z-10 group-hover:text-ink transition-colors duration-300">
                      {user ? `BUY NOW ($${book.price})` : "LOGIN TO BUY"}
                    </span>
                    <div className="absolute inset-0 bg-[#9F8155] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>

                  <button
                    onClick={() => router.push(`/book/${book.id}`)}
                    className="px-8 py-4 border-b border-gray-300 font-sans text-sm tracking-widest text-gray-500 hover:text-ink hover:border-ink transition-colors"
                  >
                    VIEW DETAILS
                  </button>
                </div>
              </motion.div>
            </div>

            {/* RIGHT SIDE: IMAGE (Breathing, not Wobbly) */}
            <div className="w-full lg:w-1/2 relative h-[60vh] lg:h-auto bg-[#e8e6e1] overflow-hidden flex items-center justify-center">
              {/* KINETIC BACKGROUND TEXT */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] -rotate-45 opacity-[0.04] pointer-events-none select-none z-0">
                <motion.div
                  style={{ x: marqueeX }} // Scroll Parallax
                  className="font-sans font-black text-[150px] leading-none whitespace-nowrap text-ink"
                >
                  ARCHIVE • DESIGN • CULTURE • ARCHIVE • DESIGN • CULTURE •
                </motion.div>
              </div>

              {/* HERO IMAGE */}
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, y: [0, -15, 0] }} // Gentle Breathing Float
                transition={{
                  scale: { duration: 1.2 },
                  y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                }}
                className="relative w-[280px] h-[420px] lg:w-[350px] lg:h-[540px] shadow-2xl z-10 perspective-1000"
              >
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  fill
                  className="object-cover rounded-sm"
                  priority
                />
                {/* Realistic Gloss Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none rounded-sm" />
              </motion.div>
            </div>
          </>
        )}
      </section>

      {/* --- CONTENT FLOW --- */}

      {/* 1. SCROLLING MANIFESTO */}
      <Manifesto />

      {/* 2. CLEVERTAP NATIVE SLOT (Dark Mode) */}
      <div
        id="ct-exclusive-drop-slot"
        className="w-full relative z-30 bg-[#1a1a1a]"
      >
        <NativeSpotlight />
      </div>

      {/* 3. MEGA FOOTER */}
      <Footer />
    </main>
  );
}
