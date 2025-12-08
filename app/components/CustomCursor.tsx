"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth physics
  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, smoothOptions);
  const smoothY = useSpring(mouseY, smoothOptions);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const manageMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check if hovering over a clickable element
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.tagName === "INPUT" ||
        target.tagName === "LABEL";

      setIsHovering(!!isClickable);
    };

    const manageMouseLeave = () => setIsVisible(false);
    const manageMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", manageMouseMove);
    window.addEventListener("mouseleave", manageMouseLeave);
    window.addEventListener("mouseenter", manageMouseEnter);

    return () => {
      window.removeEventListener("mousemove", manageMouseMove);
      window.removeEventListener("mouseleave", manageMouseLeave);
      window.removeEventListener("mouseenter", manageMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
      style={{
        translateX: smoothX,
        translateY: smoothY,
        opacity: isVisible ? 1 : 0,
        marginLeft: -10, // Center based on width/2
        marginTop: -10,
      }}
      animate={{
        width: isHovering ? 60 : 20, // Grow on hover
        height: isHovering ? 60 : 20,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    />
  );
}
