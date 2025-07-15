// components/digital-products/alt-products-section.tsx
'use client';

import React, { useState } from 'react';
import { GumroadProduct } from '@/lib/gumroad';
import { LemonSqueezyProduct } from '@/lib/lemonsqueezy';
import { PatreonTier } from '@/lib/patreon';
import AltProductCard from './alt-product-card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert'; // Not used in this version, can be removed
import { RefreshCw, AlertCircle } from 'lucide-react'; // AlertCircle not used in this version

type AltProduct = GumroadProduct | LemonSqueezyProduct | PatreonTier;

// Helper components (ProductSkeleton, ErrorDisplay, EmptyState) can stay exactly as they were.
function ProductSkeleton() {
  return (
    <div className="flex space-x-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-lg shadow-lg w-72 h-96 flex-shrink-0">
          <div className="w-full h-56 bg-gray-700 rounded-t-lg"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            <div className="mt-4 flex justify-between items-center">
              <div className="h-6 bg-gray-600 rounded w-1/4"></div>
              <div className="h-10 bg-gray-600 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Alert variant="destructive" className="bg-red-900/20 border-red-500/30 text-red-400">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <p className="font-semibold mb-2">Error Loading Products:</p>
        <p className="mb-4">{error}</p>
        <Button onClick={onRetry} variant="outline" className="border-red-600 text-red-400 hover:bg-red-800">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}
function EmptyState({ onRetry }: { onRetry: () => void }): React.JSX.Element {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📦</div>
      <h3 className="text-2xl font-semibold mb-2 text-gray-300">No products found</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        We couldn't find any products. This might be due to a configuration issue or the services being temporarily unavailable.
      </p>
      <Button onClick={onRetry} variant="outline" className="border-orange-600 text-orange-400 hover:bg-orange-800">
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh Products
      </Button>
    </div>
  );
}

// Define the props interface for the component
interface AltProductsSectionProps {
  initialProducts: AltProduct[];
}

export default function AltProductsSection({ initialProducts }: AltProductsSectionProps) {
  // State is now initialized directly from the props passed by the server page
  const [products, setProducts] = useState<AltProduct[]>(() => {
    if (!initialProducts || initialProducts.length === 0) {
      return [];
    }
    // Duplicate products for the infinite scroll effect
    let duplicatedProducts = [...initialProducts];
    while (duplicatedProducts.length < 20 && initialProducts.length > 0) {
      duplicatedProducts = [...duplicatedProducts, ...initialProducts];
    }
    return duplicatedProducts;
  });

  const [isScrollPaused, setIsScrollPaused] = useState(false);

  const handleRetry = () => {
    window.location.reload(); // Simple refresh to re-trigger server fetch
  };

  const handleProductHover = (isHovering: boolean) => {
    setIsScrollPaused(isHovering);
  };

  const hasProducts = products.length > 0;

  return (
    <>
      <style jsx>{`
        .scrolling-wrapper {
          display: flex;
          overflow-x: hidden; /* Hide scrollbar */
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          white-space: nowrap;
          padding-bottom: 1rem; /* Space for scrollbar if it shows up on some systems */
        }
        .scrolling-wrapper::-webkit-scrollbar {
          display: none; /* Hide scrollbar for Chrome, Safari, Opera */
        }
        .scrolling-wrapper {
          -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
          scrollbar-width: none; /* Hide scrollbar for Firefox */
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite; /* Adjust duration for speed */
        }
        .paused {
          animation-play-state: paused;
        }
      `}</style>

      <section className="py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-extrabold text-center mb-12 text-orange-400">
            Digital Products & Tiers
          </h2>

          {!hasProducts && <EmptyState onRetry={handleRetry} />}

          {hasProducts && (
             <div className="relative overflow-hidden py-4"> {/* Added overflow-hidden */}
                <div
                    className={`scrolling-wrapper ${isScrollPaused ? 'paused' : 'animate-scroll'}`}
                    onMouseEnter={() => handleProductHover(true)}
                    onMouseLeave={() => handleProductHover(false)}
                >
                    {products.map((product) => (
                        <div key={product.id} className="inline-block px-2"> {/* Use inline-block for horizontal layout */}
                            <AltProductCard product={product} />
                        </div>
                    ))}
                    {/* Duplicate products for seamless infinite scroll effect */}
                    {products.map((product) => (
                        <div key={`${product.id}-duplicate`} className="inline-block px-2">
                            <AltProductCard product={product} />
                        </div>
                    ))}
                </div>
             </div>
          )}
        </div>
      </section>
    </>
  );
}