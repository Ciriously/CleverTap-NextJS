"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../lib/store";
import { useRouter } from "next/navigation";

// --- TYPES ---
type Book = {
  key: string;
  title: string;
  authors: { name: string }[];
  cover_id: number;
  price: number;
};

// --- CONFIGURATION: GENRES ---
const CATEGORIES: Record<string, string> = {
  Design: "design",
  Architecture: "architecture",
  Technology: "technology",
  Philosophy: "philosophy",
  History: "history",
  Business: "business",
  Art: "art_history",
};

// --- NEW: DYNAMIC BACKGROUND COLORS ---
// Soft, pastel gradients that sit behind the title
const CATEGORY_THEMES: Record<string, string> = {
  Design: "linear-gradient(to bottom, #Fdfbf7 0%, #Fdfbf7 100%)", // Paper (Default)
  Architecture: "linear-gradient(to bottom, #D7DBE0 0%, #Fdfbf7 80%)", // Concrete Blue/Grey
  Technology: "linear-gradient(to bottom, #E0F2FE 0%, #Fdfbf7 80%)", // Electric Blue Tint
  Philosophy: "linear-gradient(to bottom, #F5E6D3 0%, #Fdfbf7 80%)", // Warm Sepia
  History: "linear-gradient(to bottom, #E8E1D5 0%, #Fdfbf7 80%)", // Old Parchment
  Business: "linear-gradient(to bottom, #DEE4E7 0%, #Fdfbf7 80%)", // Corporate Slate
  Art: "linear-gradient(to bottom, #FCE7F3 0%, #Fdfbf7 80%)", // Soft Pink Canvas
};

const NSFW_KEYWORDS = [
  "romance",
  "erotica",
  "passion",
  "desire",
  "lover",
  "seduction",
  "billionaire",
  "kiss",
];

export default function ShopPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [activeCategory, setActiveCategory] = useState("Design");
  const [loading, setLoading] = useState(true);

  const { user, addToCart } = useAuthStore();
  const router = useRouter();

  const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

  const isBookSafe = (work: any) => {
    const title = work.title.toLowerCase();
    if (NSFW_KEYWORDS.some((word) => title.includes(word))) return false;
    if (work.subject) {
      const subjects = work.subject.map((s: string) => s.toLowerCase());
      if (
        subjects.some(
          (s: string) => s.includes("romance") || s.includes("erotica")
        )
      )
        return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const subject = CATEGORIES[activeCategory];
        const randomOffset = Math.floor(Math.random() * 40);

        const endpoint = `https://openlibrary.org/subjects/${subject}.json?limit=20&offset=${randomOffset}`;
        const response = await fetch(endpoint);
        const data = await response.json();
        let rawBooks = data.works;

        if (!rawBooks) return;

        const safeBooks = rawBooks.filter(isBookSafe);

        const formattedBooks = safeBooks
          .map((work: any) => ({
            key: work.key,
            title: work.title,
            authors: work.authors || [{ name: "Unknown" }],
            cover_id: work.cover_id || work.cover_i,
            price: parseFloat((20 + (work.title.length % 30)).toFixed(2)),
          }))
          .filter((b: any) => b.cover_id);

        setBooks(shuffleArray(formattedBooks).slice(0, 15));

        if (typeof window !== "undefined") {
          const ctModule = await import("clevertap-web-sdk");
          const ct = ctModule.default || ctModule;
          ct.event.push("Category Viewed", {
            "Category Name": activeCategory,
            User: user?.email || "Guest",
          });
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [activeCategory, user]);

  const handleCardClick = (book: Book) => {
    const cleanId = book.key.replace("/works/", "");
    router.push(`/book/${cleanId}`);
  };

  const handleQuickAdd = async (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    addToCart({
      id: book.key,
      title: book.title,
      price: book.price,
      coverUrl: `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`,
      quantity: 1,
    });

    if (typeof window !== "undefined") {
      const ctModule = await import("clevertap-web-sdk");
      const ct = ctModule.default || ctModule;
      ct.event.push("Added to Cart", { "Product Name": book.title });
    }
  };

  return (
    <main className="min-h-screen bg-paper text-ink pb-48 relative">
      {/* --- NEW: DYNAMIC BACKGROUND MESH --- */}
      {/* This sits absolutely at the top and changes color */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[60vh] z-0 pointer-events-none"
        animate={{ background: CATEGORY_THEMES[activeCategory] }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {/* ------------------------------------ */}

      {/* HEADER (Z-Index 10 to sit above the background) */}
      <div className="relative z-10 pt-24 px-8 lg:px-24 mb-12">
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold font-bold">
          Curated Collection
        </span>
        <h1 className="font-serif text-5xl lg:text-7xl mt-4">The Archive</h1>
        <motion.p
          key={activeCategory} // Re-animate text on change
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-sans text-gray-500 mt-4 max-w-md text-sm leading-relaxed"
        >
          Exploring the depths of{" "}
          <span className="text-ink font-bold">{activeCategory}</span>. A
          selection of essential readings for the modern intellect.
        </motion.p>
      </div>

      {/* STICKY FILTER BAR */}
      <div className="sticky top-0 z-40 bg-paper/80 backdrop-blur-md border-b border-gray-200 px-8 lg:px-24 py-4 mb-12 flex gap-8 overflow-x-auto scrollbar-hide">
        {Object.keys(CATEGORIES).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="relative py-2 font-sans text-xs uppercase tracking-widest text-ink/60 hover:text-ink transition-colors whitespace-nowrap"
          >
            <span
              className={activeCategory === cat ? "text-ink font-bold" : ""}
            >
              {cat}
            </span>
            {activeCategory === cat && (
              <motion.div
                layoutId="activeFilter"
                className="absolute bottom-0 left-0 w-full h-[2px] bg-gold"
              />
            )}
          </button>
        ))}
      </div>

      {/* GRID (Z-Index 10 to sit above background) */}
      <div className="relative z-10 px-8 lg:px-24">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[2/3] mb-4 rounded-sm"></div>
                <div className="h-3 bg-gray-200 w-3/4 mb-2"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12"
          >
            <AnimatePresence mode="popLayout">
              {books.map((book, index) => (
                <motion.div
                  layout
                  key={book.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => handleCardClick(book)}
                  className="group relative cursor-pointer"
                >
                  <div className="relative aspect-[2/3] mb-4 overflow-hidden bg-[#e8e6e1] shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
                    <Image
                      src={`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`}
                      alt={book.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute bottom-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        onClick={(e) => handleQuickAdd(e, book)}
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur text-ink flex items-center justify-center hover:bg-gold hover:text-white shadow-lg transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-lg leading-tight text-ink line-clamp-2 min-h-[2.5rem]">
                      {book.title}
                    </h3>
                    <div className="flex justify-between items-baseline">
                      <p className="font-sans text-[10px] text-gray-500 uppercase tracking-widest line-clamp-1 max-w-[70%]">
                        {book.authors[0]?.name}
                      </p>
                      <span className="font-sans font-bold text-xs text-gold">
                        ${book.price}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  );
}
