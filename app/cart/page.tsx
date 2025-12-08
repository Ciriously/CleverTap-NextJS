"use client";

import { useAuthStore } from "../../lib/store";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, user } = useAuthStore();
  const router = useRouter();

  const total = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to checkout");
      router.push("/login");
      return;
    }

    // FIRE CLEVERTAP CHARGED EVENT
    if (typeof window !== "undefined") {
      const ctModule = await import("clevertap-web-sdk");
      const ct = ctModule.default || ctModule;

      const chargeDetails = {
        Amount: parseFloat(total),
        "Payment mode": "Credit Card",
        "Charged ID": Math.floor(Date.now()),
        Items: cart.map((item) => ({
          Category: "Books",
          "Book name": item.title,
          Quantity: item.quantity,
          Price: item.price,
        })),
      };

      console.log("🚀 [CLEVERTAP] Charged:", chargeDetails);
      ct.event.push("Charged", chargeDetails);

      alert("Order Placed Successfully!");
      clearCart();
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen bg-paper text-ink p-8 lg:p-24">
      <h1 className="font-serif text-5xl lg:text-7xl mb-12">Your Selection</h1>

      {cart.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-sans text-gray-400 uppercase tracking-widest">
            Your cart is empty.
          </p>
          <a
            href="/shop"
            className="inline-block mt-8 border-b border-ink pb-1 font-serif italic hover:text-gold transition-colors"
          >
            Return to Archive
          </a>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-16">
          {/* ITEM LIST */}
          <div className="w-full lg:w-2/3 space-y-8">
            {cart.map((item) => (
              <motion.div
                layout
                key={item.id}
                className="flex gap-6 border-b border-gray-300 pb-8"
              >
                <div className="relative w-24 h-36 bg-gray-200">
                  <Image
                    src={item.coverUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl">{item.title}</h3>
                    <p className="font-sans text-xs text-gray-500 mt-2">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-sans font-bold">${item.price}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs uppercase tracking-widest text-red-400 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="w-full lg:w-1/3 bg-[#f4f1ea] p-8 h-fit">
            <h3 className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-8">
              Order Summary
            </h3>
            <div className="flex justify-between items-center mb-4">
              <span className="font-serif text-xl">Total</span>
              <span className="font-serif text-3xl">${total}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-ink text-white py-4 font-sans text-xs uppercase tracking-widest hover:bg-gold transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
