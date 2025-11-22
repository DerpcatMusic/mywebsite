"use client";

import { Button } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

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
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Parallax Background removed

      // Content Reveal (on load)
      const revealTl = gsap.timeline();
      revealTl.from(".hero-text", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
      });

      revealTl.from(
        ".hero-btn",
        {
          scale: 0,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.5"
      );
    },
    { scope: containerRef }
  );

  const handleBtnHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.1,
      rotation: -3,
      duration: 0.3,
      ease: "elastic.out(1, 0.3)",
    });
  };

  const handleBtnLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div ref={bgRef} className="absolute inset-0 -top-[10%] h-[120%] w-full">
        <Image
          src={releaseImage || "/release.png"}
          alt={releaseTitle}
          fill
          className="object-cover object-center"
          priority
          crossOrigin="anonymous"
        />
        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 mix-blend-overlay" />
        <div className="bg-noise absolute inset-0 opacity-30" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex h-full items-center justify-center"
      >
        <div className="px-4 text-center">
          <div className="mb-8">
            <h1 className="hero-text mb-4 font-pixel text-4xl font-black uppercase tracking-widest text-primary-foreground drop-shadow-[4px_4px_0_rgba(0,0,0,1)] md:text-6xl lg:text-7xl">
              {releaseTitle}
            </h1>
            <div className="hero-text mt-8 flex justify-center">
              <Button
                asChild
                size="lg"
                className="hero-btn group gap-3 rounded-full bg-primary px-8 py-6 font-pixel text-sm uppercase tracking-wider hover:bg-primary/80"
                onMouseEnter={handleBtnHover}
                onMouseLeave={handleBtnLeave}
              >
                <a
                  href={streamLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3"
                >
                  <Play className="h-5 w-5 fill-current text-primary-foreground transition-transform group-hover:scale-110" />
                  <span className="text-primary-foreground">Stream Now</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="font-pixel text-[10px] uppercase text-foreground/80">
            Scroll
          </span>
          <div className="h-4 w-4 rotate-45 border-b-2 border-r-2 border-foreground" />
        </div>
      </div>
    </section>
  );
}
