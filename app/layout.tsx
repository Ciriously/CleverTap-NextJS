import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// --- COMPONENTS ---
import AnalyticsInit from "./components/AnalyticsInit";
import CustomCursor from "./components/CustomCursor";
import Toast from "./components/Toast";
import FloatingCart from "./components/FloatingCart";
import TabEffects from "./components/TabEffects";
import Header from "./components/Header";

// --- FONT CONFIG ---
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// --- METADATA ---
export const metadata: Metadata = {
  title: "Curated Reads | The Archive",
  description: "A curated selection of the finest literature.",
  manifest: "/manifest.json",
};

// --- VIEWPORT (Initial Theme Color) ---
export const viewport: Viewport = {
  themeColor: "#Fdfbf7", // Matches bg-paper
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-paper text-ink antialiased cursor-none overflow-x-hidden">
        {/* 1. TEXTURE OVERLAY (Film Grain) */}
        <div className="bg-noise"></div>
        {/* 2. UX ENHANCERS */}
        <CustomCursor /> {/* The liquid dot */}
        <TabEffects /> {/* Title changes when tab inactive */}
        {/* 3. GLOBAL UI ELEMENTS */}
        <Toast /> {/* Sliding notifications */}
        <FloatingCart /> {/* Sticky cart button */}
        {/* 4. ANALYTICS ENGINE */}
        <AnalyticsInit /> {/* CleverTap SDK */}
        {/* 5. PAGE CONTENT */}
        <Header />
        {children}
      </body>
    </html>
  );
}
