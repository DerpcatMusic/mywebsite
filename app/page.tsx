// app/page.tsx
import Navigation from "@/components/navigation"
import AboutToursSection from "@/components/about-tours-section"
import BookingSection from "@/components/booking-section"
import ReleaseSection from "@/components/release-section"
import FourthwallProductsSection from "@/components/fourthwall-products-section" // Import the self-sufficient component
import AltProductsSection from "@/components/alt-products-section";
import { currentRelease } from "@/config/releases"

// This is no longer an async component
export default function ArtistLandingPage() {
  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <Navigation />
      <main>
        <ReleaseSection
          releaseImage={currentRelease.image}
          releaseTitle={currentRelease.title}
          streamLink={currentRelease.streamLink}
        />
        <AboutToursSection />

        {/* The component now fetches its own data, so we don't pass any props */}
        <FourthwallProductsSection />

        {/* New section for Gumroad and Lemon Squeezy products */}
        <AltProductsSection />

        <BookingSection />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-secondary/10 bg-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Derpcat 2025. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}