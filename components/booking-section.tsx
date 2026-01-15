"use client";

import { Button } from "@/components/ui/button";

export default function BookingSection() {
  return (
    <section
      id="book"
      className="relative w-full overflow-hidden border-t border-white/5 px-6 py-32"
    >
      <div className="container mx-auto flex flex-col items-center justify-between gap-12 md:flex-row">
        <div className="max-w-xl space-y-4">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.4em] text-white/30">
            INQUIRIES
          </span>
          <h2 className="font-pixel text-5xl font-normal leading-none text-white md:text-7xl">
            CONTACT ME
          </h2>
          <p className="max-w-sm text-lg font-light leading-relaxed text-white/50">
            For booking, collaborations, or just to say hi. Reach out directly.
          </p>
        </div>

        <a href="mailto:daniel@derpcatmusic.com" className="group relative">
          <div className="absolute inset-0 bg-white opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-10" />
          <Button className="h-20 rounded-full bg-white px-16 font-sans text-xl font-bold text-black shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/90 active:scale-95">
            GET IN TOUCH
          </Button>
        </a>
      </div>
    </section>
  );
}
