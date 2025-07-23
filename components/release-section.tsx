"use client";

import { useState, useEffect, useRef } from "react"; // Import useState, useEffect, useRef
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Image from "next/image";

interface ReleaseSectionProps {
  releaseImage?: string;
  releaseTitle?: string;
  streamLink?: string;
}

export default function ReleaseSection({
  releaseImage = "/release.png?height=600&width=1200",
  releaseTitle = "Latest Release",
  streamLink = "#",
}: ReleaseSectionProps) {
  // 1. Create a ref for the scroll indicator element
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  // 2. Create a state to control the opacity, starting at 1 (fully visible)
  const [opacity, setOpacity] = useState(1);

  // 3. Define the scroll event handler
  const handleScroll = () => {
    if (!scrollIndicatorRef.current) return; // Ensure ref is attached

    const indicatorRect = scrollIndicatorRef.current.getBoundingClientRect();
    // `indicatorTop` is the distance from the viewport's top to the indicator's top
    const indicatorTop = indicatorRect.top;

    const viewportHeight = window.innerHeight;

    // Define the range (in pixels from the viewport top) over which the fade will occur
    // Start fading when the indicator's top is 85% down the viewport (e.g., still clearly visible)
    const fadeStartPixel = viewportHeight * 0.85;
    // Fully faded when the indicator's top is 40% down the viewport (e.g., half-way up the screen)
    // You can adjust these values based on how quickly/slowly you want it to fade
    const fadeEndPixel = viewportHeight * 0.4;

    let newOpacity: number;

    if (indicatorTop >= fadeStartPixel) {
      // Indicator is below the fade start point, keep full opacity
      newOpacity = 1;
    } else if (indicatorTop <= fadeEndPixel) {
      // Indicator has scrolled past the fade end point, make it fully transparent
      newOpacity = 0;
    } else {
      // Indicator is within the fading zone. Calculate opacity based on its position.
      // As indicatorTop decreases (scrolls up), the progress increases from 0 to 1.
      const scrollProgress =
        (fadeStartPixel - indicatorTop) / (fadeStartPixel - fadeEndPixel);
      // Opacity goes from 1 down to 0 as scrollProgress goes from 0 to 1.
      newOpacity = 1 - scrollProgress;
    }

    // Ensure opacity is clamped between 0 and 1
    setOpacity(Math.max(0, Math.min(1, newOpacity)));
  };

  // 4. Attach and clean up the scroll event listener using useEffect
  useEffect(() => {
    // Add event listener when component mounts
    window.addEventListener("scroll", handleScroll);
    // Also call it once on mount to set initial opacity correctly in case of pre-existing scroll
    handleScroll();

    // Clean up event listener when component unmounts to prevent memory leaks
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array means this effect runs once on mount and once on unmount

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={releaseImage || "/release.png"}
          alt={releaseTitle}
          fill
          className="object-cover object-center"
          priority
          crossOrigin="anonymous"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4 drop-shadow-2xl font-title">
              {releaseTitle}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/80 drop-shadow-lg font-body">
              Out Now
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-title text-lg tracking-wide px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group"
          >
            <a
              href={streamLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <Play className="w-6 h-6 mr-3 transition-transform duration-150 group-hover:scale-110" />
              Stream Now
            </a>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef} // 5. Attach the ref to the scroll indicator div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        style={{ opacity: opacity }} // 6. Apply the dynamic opacity
      >
        <div className="w-6 h-10 border-2 border-foreground/50 flex justify-center rounded-full">
          <div className="w-1 h-3 bg-foreground/50 mt-2 animate-pulse rounded-full" />
        </div>
      </div>
    </section>
  );
}
