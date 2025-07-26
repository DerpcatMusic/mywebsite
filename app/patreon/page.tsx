// app/patreon/page.tsx
import PatreonTiersDisplay from "@/components/digital products/patreon-tiers-display";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Suspense } from "react";

/**
 * A high-fidelity skeleton component that mimics the AltProductCard structure.
 * This provides a much better loading experience.
 */
function SkeletonCard() {
  return (
    <Card className="flex w-full max-w-sm flex-col border-orange-500/20 bg-orange-500/10">
      <CardHeader className="p-0">
        <Skeleton className="h-56 w-full rounded-t-lg bg-orange-500/30" />
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <Skeleton className="mb-4 h-6 w-3/4 bg-orange-500/30" />
        <Skeleton className="mb-2 h-4 w-full bg-orange-500/30" />
        <Skeleton className="h-4 w-5/6 bg-orange-500/30" />
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <Skeleton className="h-8 w-1/3 bg-orange-500/30" />
        <Skeleton className="h-10 w-24 bg-orange-600/50" />
      </CardFooter>
    </Card>
  );
}

/**
 * The loading fallback UI that displays a grid of skeleton cards.
 */
function TiersLoadingFallback() {
  return (
    <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export default function PatreonPage() {
  // Use a fallback URL if environment variable is not set
  const patreonCreatorUrl =
    process.env.NEXT_PUBLIC_PATREON_CREATOR_URL || "https://www.patreon.com";

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-6xl">
            Join The Inner Circle
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Support my journey as a creator and get exclusive content,
            behind-the-scenes access, and more. Your support makes all of this
            possible.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="rounded-lg bg-orange-600 px-8 py-3 text-lg font-semibold text-white transition-transform duration-300 hover:scale-105 hover:bg-orange-700"
            >
              <Link
                href={patreonCreatorUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Become a Patron on Patreon"
              >
                Become a Patron
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tiers Display Section */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4">
          <Suspense fallback={<TiersLoadingFallback />}>
            <PatreonTiersDisplay />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
