"use client"

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Image from "next/image"

interface ReleaseSectionProps {
  releaseImage?: string
  releaseTitle?: string
  streamLink?: string
}

export default function ReleaseSection({
  releaseImage = "/release.png?height=600&width=1200",
  releaseTitle = "Latest Release",
  streamLink = "#",
}: ReleaseSectionProps) {
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
        <div className="absolute inset-0 bg-black/50" />
      </div>

 {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl font-serif">
              {releaseTitle}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 drop-shadow-lg">Out Now</p>
          </div>

          <Button
            asChild
            size="lg"
            // FIX: Add 'block', 'mx-auto', and 'w-fit' to ensure the button itself is centered
            className="bg-primary hover:bg-transparent hover:border-2 hover:border-primary text-white font-bold px-12 py-6 text-xl transition-all duration-150 hover:shadow-2xl hover:shadow-primary/50 group block mx-auto w-fit"
            style={{ borderRadius: "0px" }}
          >
            <a
              href={streamLink}
              target="_blank"
              rel="noopener noreferrer"
              // Ensure internal content is centered (Button usually handles this, but good to be explicit)
              className="flex items-center justify-center"
            >
              <Play className="w-6 h-6 mr-3 transition-transform duration-150" />
              Stream Now
            </a>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 flex justify-center" style={{ borderRadius: "0px" }}>
          <div className="w-1 h-3 bg-white/50 mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
