import AboutToursSection from "@/components/about-tours-section";
import BookingSection from "@/components/booking-section";
import ClientPageWrapper from "@/components/client-page-wrapper";
import PageSection from "@/components/page-section";
import ReleaseSection from "@/components/release-section";
import UnifiedShopSection from "@/components/unified-shop-section";
import { currentRelease } from "@/config/releases";
import { getAllGumroadProducts } from "@/lib/gumroad";
import { getAllLemonSqueezyProducts } from "@/lib/lemonsqueezy";
import { getAllPatreonTiers } from "@/lib/patreon";

export default async function ArtistLandingPage() {
  // Fetch Digital Products Server-Side
  const [gumroadResult, lemonsqueezyResult, patreonResult] =
    await Promise.allSettled([
      getAllGumroadProducts(),
      getAllLemonSqueezyProducts(),
      getAllPatreonTiers(),
    ]);

  const gumroadProducts =
    gumroadResult.status === "fulfilled" ? gumroadResult.value : [];
  const lemonsqueezyProducts =
    lemonsqueezyResult.status === "fulfilled" ? lemonsqueezyResult.value : [];
  const patreonTiers =
    patreonResult.status === "fulfilled" ? patreonResult.value : [];

  const allDigitalProducts = [
    ...gumroadProducts,
    ...lemonsqueezyProducts,
    ...patreonTiers,
  ];

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

        {/* Unified Shop Section */}
        <PageSection className="bg-background">
          <UnifiedShopSection digitalProducts={allDigitalProducts} />
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
