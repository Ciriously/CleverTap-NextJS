"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../lib/store";
import { useEffect, useState } from "react";

// --- TYPES ---
type HeroBook = {
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  price: number;
  id: string;
};

export default function Home() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  // STATE: This is our Single Source of Truth
  const [book, setBook] = useState<HeroBook | null>(null);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH DYNAMIC DATA ---
  useEffect(() => {
    const fetchHeroBook = async () => {
      try {
        console.log("📡 [API] Fetching Hero Book...");

        // Fetch "Trending" books
        const response = await fetch(
          "https://openlibrary.org/trending/daily.json?limit=1"
        );
        const data = await response.json();
        const work = data.works[0]; // Get the #1 trending book

        // Fetch detailed description for this specific book
        const detailsResponse = await fetch(
          `https://openlibrary.org${work.key}.json`
        );
        const detailsData = await detailsResponse.json();

        // Clean up the description (API sometimes returns object or string)
        let desc = "No description available.";
        if (typeof detailsData.description === "string")
          desc = detailsData.description;
        else if (detailsData.description?.value)
          desc = detailsData.description.value;

        // Construct the Object
        const dynamicBook: HeroBook = {
          title: work.title,
          author: work.author_name?.[0] || "Unknown Author",
          description: desc.substring(0, 150) + "...", // Truncate for UI
          coverUrl: `https://covers.openlibrary.org/b/id/${work.cover_i}-L.jpg`,
          id: work.key,
          // Generate a price based on title length so it's consistent
          price: parseFloat((15 + (work.title.length % 10)).toFixed(2)),
        };

        setBook(dynamicBook);
        console.log("✅ [API] Hero Book Loaded:", dynamicBook.title);
      } catch (error) {
        console.error("❌ [API] Failed to fetch hero book", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroBook();
  }, []);

  // --- 2. DYNAMIC EVENT HANDLER ---
  const handleAddToCart = async () => {
    console.log('🛒 [ACTION] "Buy Now" Clicked');

    if (!user) {
      router.push("/login");
      return;
    }

    // Guard: Ensure book data exists
    if (!book) return;

    alert(`Processing Purchase for: ${book.title}`);

    if (typeof window !== "undefined") {
      try {
        const clevertapModule = await import("clevertap-web-sdk");
        const clevertap = clevertapModule.default || clevertapModule;

        // --- STRICT FORMATTING START ---

        // 1. Force Amount to be a clean Number (not string)
        const totalAmount = Number(book.price);

        // 2. Generate a Random Integer for ID (like 24052013)
        const randomChargeID = Math.floor(10000000 + Math.random() * 90000000);

        // 3. Construct the Event Object exactly as requested
        const chargeDetails = {
          Amount: totalAmount,
          "Payment mode": "Credit Card",
          "Charged ID": randomChargeID,
          Items: [
            {
              Category: "Books",
              "Book name": book.title, // Dynamic Title
              Quantity: 1,
            },
          ],
        };
        // --- STRICT FORMATTING END ---

        console.log("🚀 [CLEVERTAP] Pushing Charged:", chargeDetails);

        // Send to CleverTap
        clevertap.event.push("Charged", chargeDetails);
      } catch (e) {
        console.error("❌ CleverTap Failed:", e);
      }
    }
  };

  return (
    <main className="min-h-screen w-full bg-paper flex flex-col lg:flex-row overflow-hidden relative">
      {/* NAV */}
      <nav className="absolute top-0 left-0 w-full p-8 z-50 flex justify-between items-center">
        <div className="font-serif font-bold text-xl text-ink">CURATED.</div>
        <div className="hidden lg:block">
          <a
            href="/shop"
            className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-ink"
          >
            Browse Collection
          </a>
        </div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="font-sans text-xs tracking-widest text-gray-500">
              HELLO, {user.name.toUpperCase()}
            </span>
            <button
              onClick={() => {
                logout();
                router.refresh();
              }}
              className="font-sans text-xs font-bold uppercase text-red-500 ml-4"
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="font-sans text-xs font-bold uppercase tracking-widest text-ink border border-ink px-6 py-2 hover:bg-ink hover:text-white transition-colors"
          >
            LOGIN / JOIN
          </button>
        )}
      </nav>

      {/* LOADING STATE */}
      {loading || !book ? (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-64 w-48 bg-gray-200 mb-4 rounded shadow-lg"></div>
            <div className="h-4 w-32 bg-gray-200 mb-2"></div>
            <div className="h-8 w-64 bg-gray-200"></div>
          </div>
        </div>
      ) : (
        <>
          {/* LEFT SIDE: DYNAMIC TEXT */}
          <div className="w-full lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <span className="h-px w-12 bg-gold"></span>
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold font-bold">
                  Trending Now
                </span>
              </div>

              {/* DYNAMIC TITLE */}
              <h1 className="font-serif text-5xl lg:text-7xl leading-[0.9] text-ink line-clamp-3">
                {book.title}
              </h1>

              <p className="font-serif italic text-2xl text-gray-400">
                by {book.author}
              </p>

              {/* DYNAMIC DESCRIPTION */}
              <p className="font-sans text-gray-600 max-w-md text-lg leading-relaxed pt-4 line-clamp-4">
                {book.description}
              </p>

              <div className="pt-8">
                <button
                  onClick={handleAddToCart}
                  className="group relative px-8 py-4 bg-ink text-white font-sans text-sm tracking-widest overflow-hidden"
                >
                  <span className="relative z-10 group-hover:text-ink transition-colors duration-300">
                    {user ? `BUY NOW ($${book.price})` : "LOGIN TO BUY"}
                  </span>
                  <div className="absolute inset-0 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE: Visual + Kinetic Background */}
          <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto bg-[#e8e6e1] overflow-hidden">
            {/* 1. Kinetic Marquee Text (Behind the book) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] -rotate-45 opacity-5 pointer-events-none select-none z-0">
              <motion.div
                className="font-sans font-black text-[120px] leading-none whitespace-nowrap text-ink"
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              >
                BESTSELLER • ARCHIVE • COLLECTION • BESTSELLER • ARCHIVE •
              </motion.div>
              <motion.div
                className="font-serif italic text-[120px] leading-none whitespace-nowrap text-ink mt-4"
                animate={{ x: [-1000, 0] }} // Moves opposite direction
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              >
                READING • CULTURE • ART • READING • CULTURE • ART •
              </motion.div>
            </div>

            {/* 2. The Book (Now with 3D Float Effect) */}
            <div className="absolute inset-0 flex items-center justify-center p-12 z-10">
              <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, y: [0, -20, 0] }} // Floating Y animation
                transition={{
                  scale: { duration: 1.2 },
                  y: { repeat: Infinity, duration: 6, ease: "easeInOut" }, // Infinite Float
                }}
                className="relative w-64 h-96 lg:w-96 lg:h-[600px] shadow-2xl"
              >
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Realistic Shadow */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/20 blur-xl rounded-full"></div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
