// components/fourthwall-products-section.tsx
'use client';

import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getAllFourthwallProducts, FourthwallProduct } from '@/lib/fourthwall';
import ProductCard from '../product-card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

// --- Helper Components ---
// (ProductSkeleton, ErrorDisplay, EmptyState components remain the same)
function ProductSkeleton() {
  return (
    <div className="flex-shrink-0 w-72 bg-secondary/20 rounded-lg animate-pulse">
      <div className="w-full h-56 bg-secondary/30 rounded-t-lg"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-secondary/30 rounded w-3/4"></div>
        <div className="h-3 bg-secondary/30 rounded w-full"></div>
        <div className="h-3 bg-secondary/30 rounded w-1/2"></div>
        <div className="pt-4 flex justify-between items-center">
          <div className="h-8 bg-secondary/30 rounded w-1/3"></div>
          <div className="h-10 bg-purple-900/50 rounded-lg w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Alert variant="destructive" className="max-w-md mx-auto bg-red-950/50 border-red-800">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-red-200">{error}</span>
        <Button variant="outline" size="sm" onClick={onRetry} className="ml-4 border-red-700 text-red-200 hover:bg-red-800">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function EmptyState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📦</div>
      <h3 className="text-2xl font-semibold mb-2 text-gray-300">No products found</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        We couldn't find any products. Please check your Fourthwall configuration and API token.
      </p>
      <Button onClick={onRetry} variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-800">
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh Products
      </Button>
    </div>
  );
}


// --- Main Products Section ---
export default function FourthwallProductsSection() {
  const [products, setProducts] = useState<FourthwallProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const checkoutDomain = process.env.NEXT_PUBLIC_FW_CHECKOUT;
  
  // Ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProducts = await getAllFourthwallProducts();
      // NOTE: No longer duplicating products as infinite scroll is disabled
      setProducts(fetchedProducts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300; // Scroll by roughly one card width
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isScrollable = !loading && !error && products.length > 0;

  return (
    <>
      <style jsx>{`
        /* 
          SCROLLING DISABLED: All @keyframes and .animate-scroll classes have been removed.
          Scrolling is now handled manually by the arrow buttons.
        */
        .scroll-wrapper {
          position: relative;
        }

        .scroll-container {
          display: flex;
          gap: 2rem; /* 32px */
          overflow-x: auto;
          scrollbar-width: none; /* For Firefox */
          -ms-overflow-style: none; /* For Internet Explorer and Edge */
          padding-bottom: 1rem;
          scroll-behavior: smooth; /* Enables smooth scrolling for scrollBy */

          /* Fade out effect on the edges */
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }

        .scroll-container::-webkit-scrollbar {
          display: none; /* For Chrome, Safari, and Opera */
        }
        
        .product-item:hover {
          z-index: 10; /* Ensure hovered card is on top */
          /* Scaling is handled internally by the card's 3D transform, not here */
        }

        .arrow-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          height: 3.5rem;
          width: 3.5rem;
          border-radius: 9999px;
          background-color: rgba(0, 0, 0, 0.4);
          color: white;
          transition: all 0.2s ease-in-out;
        }
        .arrow-button:hover {
          background-color: rgba(128, 0, 255, 0.6);
          transform: translateY(-50%) scale(1.1);
        }
        .arrow-button:disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }
      `}</style>
      
      <section className="py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-extrabold text-center mb-12 text-purple-400">
            Official Merchandise
          </h2>

          {loading && (
            <div className="flex overflow-x-hidden pb-4 gap-8">
              {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          )}

          {error && <ErrorDisplay error={error} onRetry={fetchProducts} />}
          {!loading && !error && products.length === 0 && <EmptyState onRetry={fetchProducts} />}

          {isScrollable && (
            <div className="scroll-wrapper">
              <Button onClick={() => handleScroll('left')} className="arrow-button left-0 md:-left-4">
                  <ArrowLeft />
              </Button>
              <div ref={scrollContainerRef} className="scroll-container py-8">
                {products.map((product) => (
                  <div key={product.id} className="product-item flex-shrink-0">
                    <ProductCard
                      product={product}
                      fourthwallCheckoutDomain={checkoutDomain}
                    />
                  </div>
                ))}
              </div>
              <Button onClick={() => handleScroll('right')} className="arrow-button right-0 md:-right-4">
                <ArrowRight />
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}