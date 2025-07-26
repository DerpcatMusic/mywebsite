// app/page.tsx
import AboutToursSection from "@/components/about-tours-section";
import ProductLoader from "@/components/digital products/product-loader";
import FourthwallProductsSection from "@/components/fourthwall-products-section";
import ReleaseSection from "@/components/release-section";
import BookingSection from "@/components/booking-section";
import { currentRelease } from "@/config/releases";

export default function ArtistLandingPage() {

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <ReleaseSection
          releaseImage={currentRelease.image}
          releaseTitle={currentRelease.title}
          streamLink={currentRelease.streamLink}
        />
        <AboutToursSection />

        {/* Main title for both product sections */}
        <section className="bg-background py-6">
          <div className="mx-auto max-w-[80vw] px-2">
            <h2 className="mb-8 bg-gradient-to-r from-purple-500 via-orange-500 to-purple-500 bg-clip-text text-center text-6xl font-extrabold text-transparent">
              SHOP
            </h2>
          </div>
        </section>

        {/* Products sections side by side on larger screens */}
        <section className="-mt-2 bg-background">
          <div className="mx-auto max-w-[80vw] px-2">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="flex flex-col">
                <FourthwallProductsSection />
              </div>
              <div className="flex flex-col">
                <ProductLoader />
              </div>
            </div>
          </div>
        </section>

        <BookingSection />
      </main>

      <footer className="border-t border-border bg-card/5 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Derpcat 2025. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
