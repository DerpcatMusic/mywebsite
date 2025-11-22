"use client";

import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PageSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 0.5,
        },
      });

      // Performant fade-up reveal (GPU-accelerated)
      tl.fromTo(
        contentRef.current,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
        }
      );
    },
    { scope: sectionRef }
  );

  // Parallax removed as per user request

  return (
    <section
      ref={sectionRef}
      className={`relative flex min-h-screen w-full flex-col justify-center overflow-hidden ${className}`}
    >
      <div ref={contentRef} className="flex h-full w-full flex-col justify-center will-change-transform">
        {children}
      </div>
    </section>
  );
}
