"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store";

// Lively, "Fake" Reviews
const REVIEWS = [
  {
    user: "Elena R.",
    text: "Ideally curated. Changed my perspective entirely.",
    rating: 5,
  },
  {
    user: "Marcus T.",
    text: "The print quality implied by the digital presence is palpable.",
    rating: 5,
  },
  { user: "Sarah L.", text: "A modern classic. Fast shipping too.", rating: 4 },
  {
    user: "David K.",
    text: "Exactly what I was looking for. A masterpiece.",
    rating: 5,
  },
];

export default function BookDetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useAuthStore();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // GOOGLE BOOKS ID LOOKUP
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        const data = await response.json();
        const info = data.volumeInfo;

        // Image Quality Hack
        let img = info.imageLinks?.thumbnail || "";
        if (img)
          img = img.replace("http:", "https:").replace("&zoom=1", "&zoom=0");

        // Clean HTML Description
        const desc = info.description
          ? info.description.replace(/<\/?[^>]+(>|$)/g, "")
          : "No description available for this masterpiece.";

        setBook({
          id: data.id,
          title: info.title,
          author: info.authors?.[0] || "Unknown",
          description: desc,
          coverUrl: img,
          // Consistent Price Generation
          price: parseFloat((25 + (info.title.length % 40)).toFixed(2)),
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      coverUrl: book.coverUrl,
      quantity: 1,
    });

    // Analytics
    if (typeof window !== "undefined") {
      import("clevertap-web-sdk").then((ct) => {
        const clevertap = ct.default || ct;
        clevertap.event.push("Added to Cart", {
          "Product Name": book.title,
          Source: "Details Page",
        });
      });
    }
  };

  if (loading || !book)
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center font-serif text-ink animate-pulse">
        Fetching from Archive...
      </div>
    );

  return (
    <main className="min-h-screen bg-paper text-ink p-6 lg:p-12 flex flex-col lg:flex-row gap-12 relative">
      {/* LEFT: IMAGE (Sticky & Large) */}
      <div className="w-full lg:w-1/2 lg:h-[90vh] lg:sticky lg:top-12 flex items-center justify-center bg-[#e8e6e1] relative overflow-hidden rounded-sm">
        {/* Background Blur */}
        <div className="absolute inset-0 bg-ink/5" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-[300px] h-[450px] lg:w-[400px] lg:h-[600px] shadow-2xl perspective-1000"
        >
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover rounded-sm shadow-xl"
          />

          {/* Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none rounded-sm" />
        </motion.div>
      </div>

      {/* RIGHT: CONTENT */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-12 py-12 lg:pr-24">
        {/* Title Block */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold font-bold">
            Detailed View
          </span>
          <h1 className="font-serif text-5xl lg:text-7xl leading-[0.9] mt-4 mb-2 text-ink">
            {book.title}
          </h1>
          <p className="font-serif italic text-3xl text-gray-400">
            by {book.author}
          </p>
        </motion.div>

        {/* Price & Add */}
        <div className="flex items-center gap-8 border-t border-b border-gray-200 py-8">
          <span className="font-sans text-4xl font-bold text-ink">
            ${book.price}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-ink text-white px-12 py-5 font-sans text-xs uppercase tracking-widest hover:bg-gold transition-colors shadow-lg"
          >
            Add to Cart
          </button>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h3 className="font-sans text-xs uppercase tracking-widest text-gray-500">
            Synopsis
          </h3>
          <p className="font-sans text-gray-600 leading-loose text-lg">
            {book.description}
          </p>
        </div>

        {/* Fake Lively Feedback */}
        <div className="bg-[#f4f1ea] p-10 mt-12 rounded-sm">
          <h3 className="font-serif text-2xl mb-8 flex items-center gap-4">
            Reader Notes{" "}
            <span className="text-sm font-sans text-gray-400 tracking-widest uppercase">
              (Verified)
            </span>
          </h3>
          <div className="space-y-8">
            {REVIEWS.map((review, i) => (
              <div
                key={i}
                className="border-b border-gray-300 pb-6 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-bold font-sans text-xs uppercase tracking-widest text-ink">
                    {review.user}
                  </span>
                  <span className="text-gold text-xs">
                    {"★".repeat(review.rating)}
                  </span>
                </div>
                <p className="font-serif italic text-gray-600">
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
