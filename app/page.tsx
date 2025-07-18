// app/page.tsx
import Navigation from "@/components/navigation"
import AboutToursSection from "@/components/about-tours-section"
import BookingSection from "@/components/booking-section"
import ReleaseSection from "@/components/release-section"
import FourthwallProductsSection from "@/components/fourthwall-products-section"
// import AltProductsSection from "@/components/digital products/alt-products-section"; // REMOVE THIS LINE
import ProductLoader from "@/components/digital products/product-loader"; // ADD THIS LINE
import { currentRelease } from "@/config/releases"

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

        <FourthwallProductsSection />

        {/* New section for Gumroad, Lemon Squeezy, and Patreon products */}
        {/* CORRECTED: Use ProductLoader to fetch data and pass to AltProductsSection */}
        <ProductLoader />

        <BookingSection />
      </main>

      <footer className="py-8 border-t border-secondary/10 bg-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Derpcat 2025. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}