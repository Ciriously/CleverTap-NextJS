"use client";

import { useAuthStore } from "@/lib/store";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Trash, ShoppingBagOpen } from "@phosphor-icons/react";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, user, showToast } = useAuthStore();
  const router = useRouter();

  const total = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const handleCheckout = async () => {
    if (!user) {
      showToast("Please login to complete purchase");
      router.push("/login");
      return;
    }

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

      showToast("Order Confirmed. Welcome to the Archive.");

      clearCart();
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen bg-paper text-ink p-8 lg:p-24 pt-32">
      <h1 className="font-serif text-5xl lg:text-7xl mb-12">Your Selection</h1>

      {cart.length === 0 ? (
        <div className="text-center py-24 flex flex-col items-center">
          {/* EMPTY STATE ICON */}
          <ShoppingBagOpen
            size={64}
            weight="thin"
            className="text-gray-300 mb-6"
          />
          <p className="font-sans text-gray-400 uppercase tracking-widest text-sm">
            Your cart is empty.
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="inline-block mt-8 border-b border-ink pb-1 font-serif italic hover:text-[#9F8155] transition-colors"
          >
            Return to Archive
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-16">
          {/* ITEM LIST */}
          <div className="w-full lg:w-2/3 space-y-8">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  key={item.id}
                  className="flex gap-6 border-b border-gray-300 pb-8"
                >
                  <div className="relative w-24 h-36 bg-[#e8e6e1] shadow-md">
                    <Image
                      src={item.coverUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-serif text-xl lg:text-2xl leading-tight">
                        {item.title}
                      </h3>
                      <p className="font-sans text-[10px] text-gray-500 uppercase tracking-widest mt-2">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="font-sans font-bold text-[#9F8155]">
                        ${item.price}
                      </span>

                      {/* REMOVE BUTTON (ICON) */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                        title="Remove Item"
                      >
                        <Trash size={20} weight="light" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* SUMMARY */}
          <div className="w-full lg:w-1/3 h-fit sticky top-32">
            <div className="bg-[#f4f1ea] p-8 rounded-sm">
              <h3 className="font-sans text-[10px] uppercase tracking-widest text-gray-500 mb-8 border-b border-gray-300 pb-2">
                Order Summary
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm font-sans text-gray-600">
                  <span>Subtotal</span>
                  <span>${total}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-sans text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8 pt-4 border-t border-gray-300">
                <span className="font-serif text-xl">Total</span>
                <span className="font-serif text-3xl text-ink">${total}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-ink text-white py-4 font-sans text-xs uppercase tracking-widest hover:bg-[#9F8155] transition-colors shadow-lg"
              >
                Checkout
              </button>

              <p className="text-center mt-4 text-[10px] text-gray-400 font-sans uppercase tracking-widest">
                Secure Encryption via CleverTap
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
