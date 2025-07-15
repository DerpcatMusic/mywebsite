// app/patreon/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import PatreonTiersDisplay from '@/components/digital products/patreon-tiers-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * A high-fidelity skeleton component that mimics the AltProductCard structure.
 * This provides a much better loading experience.
 */
function SkeletonCard() {
  return (
    <Card className="flex flex-col bg-orange-500/10 border-orange-500/20 w-full max-w-sm">
      <CardHeader className="p-0">
        <Skeleton className="w-full h-56 rounded-t-lg bg-orange-500/30" />
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <Skeleton className="h-6 w-3/4 mb-4 bg-orange-500/30" />
        <Skeleton className="h-4 w-full mb-2 bg-orange-500/30" />
        <Skeleton className="h-4 w-5/6 bg-orange-500/30" />
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export default function PatreonPage() {
  // Use a fallback URL if environment variable is not set
  const patreonCreatorUrl = process.env.NEXT_PUBLIC_PATREON_CREATOR_URL || 'https://www.patreon.com';
  
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
            Join The Inner Circle
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Support my journey as a creator and get exclusive content, behind-the-scenes access, and more. Your support makes all of this possible.
          </p>
          <div className="mt-8">
            <Button 
              asChild 
              size="lg" 
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-lg py-3 px-8 rounded-lg transition-transform duration-300 hover:scale-105"
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