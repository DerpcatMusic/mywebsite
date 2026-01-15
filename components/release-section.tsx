"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

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
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden py-32">
      {/* Blurred "Filler" Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40">
        <Image
          src={releaseImage || "/release.png"}
          alt=""
          fill
          className="scale-150 object-cover opacity-50 blur-[150px]"
          priority
        />
        <div className="absolute inset-0 bg-background/60" />{" "}
        {/* Overlay to blend with theme */}
      </div>

      {/* Decorative Light Leak */}
      <div className="light-leak relative left-[-10%] top-[-10%] z-0 animate-pulse opacity-40" />
      <div
        className="light-leak relative bottom-[-20%] right-[-10%] z-0 animate-pulse opacity-30"
        style={{ animationDelay: "2s" }}
      />

      <div className="container relative z-10 mx-auto grid grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        {/* Artwork - Large & Floating */}
        <div className="perspective-[1000px] group relative">
          <div className="absolute inset-0 scale-75 rounded-full bg-primary/20 blur-[100px] transition-transform duration-1000 group-hover:scale-100" />
          <div className="glass-card hover:rotate-y-6 hover:rotate-x-6 relative mx-auto aspect-square w-full max-w-lg transform overflow-hidden rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-transform duration-700 hover:scale-105">
            <Image
              src={releaseImage || "/release.png"}
              alt={releaseTitle}
              fill
              priority
              className="scale-100 object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Info - Elegant & Minimal */}
        <div className="z-10 flex flex-col items-center space-y-8 text-center lg:items-start lg:text-left">
          <div className="space-y-2">
            <span className="ml-1 block font-sans text-xs uppercase tracking-[0.3em] text-white/60">
              NEW RELEASE
            </span>
            <h1 className="font-pixel text-6xl font-normal leading-[0.9] tracking-tight text-white drop-shadow-2xl md:text-8xl lg:text-9xl">
              {releaseTitle}
            </h1>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href={streamLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-md transition-all duration-500 hover:bg-white/10"
            >
              <span className="font-sans text-sm font-medium uppercase tracking-widest text-white transition-all group-hover:tracking-[0.25em]">
                Stream Now
              </span>
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            </a>

            <a
              href="#shop"
              className="group relative inline-flex items-center gap-3 rounded-full border border-white/10 px-8 py-4 transition-all duration-500 hover:bg-white/5"
            >
              <span className="font-sans text-sm font-medium uppercase tracking-widest text-white/60 transition-colors group-hover:text-white">
                Get Merch
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
