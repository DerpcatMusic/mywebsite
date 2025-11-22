"use client";

import LoadingScreen from "@/components/loading-screen";
import { useGSAP } from "@gsap/react";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function ClientPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useGSAP(() => {
    // Configure ScrollTrigger to use the main element as the scroller
    // since we have overflow-y: scroll on main for snap scrolling
    ScrollTrigger.defaults({
      scroller: "main",
    });
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {/* Main Content - Visible but covered by loading/transition initially */}
      <div
        className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"
          }`}
      >
        {children}
      </div>
    </>
  );
}
