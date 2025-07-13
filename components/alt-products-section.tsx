// components/alt-products-section.tsx
'use client';

import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getAllGumroadProducts,
  GumroadProduct,
} from '@/lib/gumroad';
import {
  getAllLemonSqueezyProducts,
  LemonSqueezyProduct,
} from '@/lib/lemonsqueezy';
import AltProductCard from './alt-product-card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle } from 'lucide-react';

// Define a union type for the products in this section
type AltProduct = GumroadProduct | LemonSqueezyProduct;

// --- Helper Components ---
function ProductSkeleton() {
  return (
    <div className="flex-shrink-0 w-72 bg-orange-500/20 rounded-lg animate-pulse">
      <div className="w-full h-56 bg-orange-500/30 rounded-t-lg"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-orange-500/30 rounded w-3/4"></div>
        <div className="h-3 bg-orange-500/30 rounded w-full"></div>
        <div className="h-3 bg-orange-500/30 rounded w-1/2"></div>
        <div className="pt-4 flex justify-between items-center">
          <div className="h-8 bg-orange-500/30 rounded w-1/3"></div>
          <div className="h-10 bg-yellow-500/50 rounded-lg w-1/2"></div>
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
        We couldn't find any products from Gumroad or Lemon Squeezy. Please check your configurations and API tokens.
      </p>
      <Button onClick={onRetry} variant="outline" className="border-orange-600 text-orange-400 hover:bg-orange-800">
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh Products
      </Button>
    </div>
  );
}

// --- Main Products Section ---
export default function AltProductsSection() {
  const [products, setProducts] = useState<AltProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrollPaused, setIsScrollPaused] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [gumroadProducts, lemonsqueezyProducts] = await Promise.all([
        getAllGumroadProducts(),
        getAllLemonSqueezyProducts(),
      ]);

      const fetchedProducts: AltProduct[] = [...gumroadProducts, ...lemonsqueezyProducts];

      if (fetchedProducts && fetchedProducts.length > 0) {
        // Duplicate products to ensure smooth infinite scroll
        let duplicatedProducts = [...fetchedProducts];
        while (duplicatedProducts.length < 20 && fetchedProducts.length > 0) {
          duplicatedProducts = [...duplicatedProducts, ...fetchedProducts];
        }
        setProducts(duplicatedProducts);
      } else {
        setProducts([]);
      }
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

  const handleProductHover = (isHovering: boolean) => {
    setIsScrollPaused(isHovering);
  };

  const isScrollable = !loading && !error && products.length > 0;

  return (
    <>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-scroll {
          animation: scroll 80s linear infinite;
        }

        .animate-scroll.paused {
          animation-play-state: paused;
        }

        .scroll-container {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }

        .product-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .product-item:hover {
          transform: scale(1.05);
          z-index: 10;
        }
      `}</style>

      <section className="py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-extrabold text-center mb-12 text-orange-400">
            Digital Products
          </h2>

          {loading && (
            <div className="flex overflow-x-hidden pb-4 gap-8">
              {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          )}

          {error && <ErrorDisplay error={error} onRetry={fetchProducts} />}
          {!loading && !error && products.length === 0 && <EmptyState onRetry={fetchProducts} />}

          {isScrollable && (
            <div className="relative">
              <div className="scroll-container py-4">
                <div className="flex gap-8 pb-4">
                  <div className={`flex gap-8 animate-scroll ${isScrollPaused ? 'paused' : ''}`}>
                    {/* First set of products */}
                    {products.map((product, index) => (
                      <div
                        key={`${product.id}-${index}-a`}
                        className="product-item flex-shrink-0"
                        onMouseEnter={() => handleProductHover(true)}
                        onMouseLeave={() => handleProductHover(false)}
                      >
                        <AltProductCard
                          product={product}
                          className="w-72"
                        />
                      </div>
                    ))}
                    {/* Second set of products for seamless loop */}
                    {products.map((product, index) => (
                      <div
                        key={`${product.id}-${index}-b`}
                        className="product-item flex-shrink-0"
                        onMouseEnter={() => handleProductHover(true)}
                        onMouseLeave={() => handleProductHover(false)}
                      >
                        <AltProductCard
                          product={product}
                          className="w-72"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                {/* Optional: Add a button or link here if needed */}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
