"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500); // Small delay before unmounting
          return 100;
        }
        return prev + 2; // Adjust speed here
      });
    }, 20);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white"
    >
      <div className="mb-8 text-center">
        <h1 className="font-pixel animate-pulse text-4xl text-primary md:text-6xl">
          LOADING...
        </h1>
      </div>

      {/* Pixelated Progress Bar Container */}
      <div className="h-8 w-64 border-4 border-white p-1 md:w-96">
        {/* Fill */}
        <div
          className="h-full bg-primary transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="font-terminal mt-4 text-xl text-muted-foreground">
        {progress}%
      </div>

      {/* Decorative "Tips" or Flavor Text */}
      <div className="font-terminal absolute bottom-10 text-sm text-white/50">
        INITIALIZING SYSTEM...
      </div>
    </motion.div>
  );
}
