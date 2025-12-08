"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "../../../lib/store";

// Fake lively feedback data
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
];

export default function BookDetailsPage() {
  const { id } = useParams(); // Get the ID from URL
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Fetch details from Open Library using the ID (Key)
    const fetchDetails = async () => {
      try {
        // Open Library Work API
        const response = await fetch(
          `https://openlibrary.org/works/${id}.json`
        );
        const data = await response.json();

        // Fetch Author Name (Separate API call usually needed, but we simulate for speed or fetch if link exists)
        // For aesthetics, we'll keep it simple or fetch the author if the link is there.
        let authorName = "Unknown Author";
        if (data.authors && data.authors.length > 0) {
          const authorRes = await fetch(
            `https://openlibrary.org${data.authors[0].author.key}.json`
          );
          const authorData = await authorRes.json();
          authorName = authorData.name;
        }

        // Clean Description
        let desc = "No description available for this masterpiece.";
        if (typeof data.description === "string") desc = data.description;
        else if (data.description?.value) desc = data.description.value;

        setBook({
          id: id as string,
          title: data.title,
          author: authorName,
          description: desc,
          coverUrl: `https://covers.openlibrary.org/b/id/${
            data.covers?.[0] || ""
          }-L.jpg`,
          price: parseFloat((15 + (data.title.length % 20)).toFixed(2)),
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
    // Visual Feedback
    alert("Added to Cart");
  };

  if (loading || !book)
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        Loading Archive...
      </div>
    );

  return (
    <main className="min-h-screen bg-paper text-ink p-6 lg:p-12 flex flex-col lg:flex-row gap-12">
      {/* LEFT: IMAGE (Sticky) */}
      <div className="w-full lg:w-1/2 lg:h-[90vh] lg:sticky lg:top-12 flex items-center justify-center bg-[#e8e6e1] relative overflow-hidden">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-[300px] h-[450px] shadow-2xl"
        >
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </motion.div>
      </div>

      {/* RIGHT: CONTENT */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-12 py-12">
        {/* Title Block */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold">
            Architecture / Design
          </span>
          <h1 className="font-serif text-5xl lg:text-7xl leading-[0.9] mt-4 mb-2">
            {book.title}
          </h1>
          <p className="font-serif italic text-2xl text-gray-400">
            by {book.author}
          </p>
        </motion.div>

        {/* Price & Add */}
        <div className="flex items-center gap-8 border-t border-b border-gray-200 py-8">
          <span className="font-sans text-3xl font-bold">${book.price}</span>
          <button
            onClick={handleAddToCart}
            className="bg-ink text-white px-8 py-4 font-sans text-xs uppercase tracking-widest hover:bg-gold transition-colors"
          >
            Add to Cart
          </button>
        </div>

        {/* Description */}
        <p className="font-sans text-gray-600 leading-relaxed text-lg max-w-xl">
          {book.description.substring(0, 500)}...
        </p>

        {/* Fake Lively Feedback */}
        <div className="bg-[#f4f1ea] p-8 mt-12">
          <h3 className="font-serif text-2xl mb-6">Reader Notes</h3>
          <div className="space-y-6">
            {REVIEWS.map((review, i) => (
              <div
                key={i}
                className="border-b border-gray-300 pb-4 last:border-0"
              >
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-bold font-sans text-xs uppercase tracking-widest">
                    {review.user}
                  </span>
                  <span className="text-gold">{"★".repeat(review.rating)}</span>
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
