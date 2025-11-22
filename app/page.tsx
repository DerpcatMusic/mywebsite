import AboutToursSection from "@/components/about-tours-section";
import BookingSection from "@/components/booking-section";
import ClientPageWrapper from "@/components/client-page-wrapper";
import ProductLoader from "@/components/digital products/product-loader";
import FourthwallProductsSection from "@/components/fourthwall-products-section";
import PageSection from "@/components/page-section";
import ReleaseSection from "@/components/release-section";
import { currentRelease } from "@/config/releases";

export default function ArtistLandingPage() {
  return (
    <ClientPageWrapper>
      <main className="w-full overflow-x-hidden">
        {/* Hero / Release Section */}
        <PageSection>
          <ReleaseSection
            releaseImage={currentRelease.image}
            releaseTitle={currentRelease.title}
            streamLink={currentRelease.streamLink}
          />
        </PageSection>

        {/* About & Tours */}
        <PageSection className="bg-background">
          <AboutToursSection />
        </PageSection>

        {/* Shop Section - Combined Title + Products */}
        <PageSection className="bg-background py-10">
          <div className="container mx-auto flex h-full flex-col justify-center px-4">
            <h2 className="mb-12 text-center font-pixel text-4xl uppercase tracking-widest text-primary drop-shadow-[4px_4px_0_rgba(255,255,255,0.2)] md:text-6xl">
              Item Shop
            </h2>
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-8 lg:grid-cols-2">
              <div className="flex flex-col items-center">
                <h3 className="mb-6 font-pixel text-xl text-muted-foreground">
                  Merch
                </h3>
                <FourthwallProductsSection />
              </div>
              <div className="flex flex-col items-center">
                <h3 className="mb-6 font-pixel text-xl text-muted-foreground">
                  Digital Goods
                </h3>
                <ProductLoader />
              </div>
            </div>
          </div>
        </PageSection>

        {/* Booking Section */}
        <PageSection>
          <BookingSection />
        </PageSection>
      </main>

      <footer className="snap-start border-t border-border bg-card/5 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-terminal text-muted-foreground">
            © {new Date().getFullYear()} Derpcat 2025. All rights reserved.
          </p>
        </div>
      </footer>
    </ClientPageWrapper>
  );
}
