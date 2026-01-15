import AboutToursSection from "@/components/about-tours-section";
import BookingSection from "@/components/booking-section";
import ClientPageWrapper from "@/components/client-page-wrapper";
import FourthwallProductsSection from "@/components/fourthwall-products-section";
import ReleaseSection from "@/components/release-section";
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
        {/* Hero / Release Section - Full Width */}
        <div className="w-full">
          <ReleaseSection
            releaseImage={currentRelease.image}
            releaseTitle={currentRelease.title}
            streamLink={currentRelease.streamLink}
          />
        </div>

        {/* Live / Tour Section */}
        <section className="w-full px-6 py-32 md:px-24">
          <AboutToursSection />
        </section>

        {/* Official Merch (Fourthwall) - Full Width */}
        <section id="shop" className="w-full px-6 py-32 md:px-24">
          <FourthwallProductsSection />
        </section>

        {/* Booking Section - Full Width / Compact */}
        <section className="w-full">
          <BookingSection />
        </section>
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="font-sans text-xs font-medium tracking-wide text-muted-foreground/40">
            <span className="font-pixel mr-2 font-bold text-muted-foreground/60">
              DERPCAT
            </span>
            © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </ClientPageWrapper>
  );
}
