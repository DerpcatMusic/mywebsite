import Navigation from "@/components/navigation"
import AboutToursSection from "@/components/about-tours-section"
import BookingSection from "@/components/booking-section"
import ReleaseSection from "@/components/release-section"
import { currentRelease } from "@/config/releases"

export default function ArtistLandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main>
        <ReleaseSection
          releaseImage={currentRelease.image}
          releaseTitle={currentRelease.title}
          streamLink={currentRelease.streamLink}
        />
        <AboutToursSection />
        <BookingSection />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-primary/20 bg-black">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Artist Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
