// components/fourthwall-products-section.tsx
'use client';

import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getAllFourthwallProducts, FourthwallProduct } from '@/lib/fourthwall';
import ProductCard from '../product-card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle } from 'lucide-react';

// --- Helper Components ---
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
  const [isScrollPaused, setIsScrollPaused] = useState(false);
  const [focusedProduct, setFocusedProduct] = useState<string | null>(null);
  const checkoutDomain = process.env.NEXT_PUBLIC_FW_CHECKOUT;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProducts = await getAllFourthwallProducts();
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

  const handleProductTap = (productKey: string) => {
    if (focusedProduct === productKey) {
      // Second tap - unfocus
      setFocusedProduct(null);
      setIsScrollPaused(false);
    } else {
      // First tap - focus
      setFocusedProduct(productKey);
      setIsScrollPaused(true);
    }
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
          cursor: pointer;
        }
        
        .product-item:hover {
          transform: scale(1.05);
          z-index: 10;
        }
        
        .product-item.focused {
          transform: scale(1.05);
          z-index: 10;
        }
        
        .product-item.focused::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #a855f7, #8b5cf6);
          border-radius: 10px;
          z-index: -1;
          opacity: 0.6;
        }
        
        /* Mobile-specific styles */
        @media (hover: none) and (pointer: coarse) {
          .product-item:hover {
            transform: none;
          }
        }
        
        /* Disable hover effects on mobile */
        @media (max-width: 768px) {
          .product-item:hover {
            transform: none;
          }
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
            <div className="relative">
              <div className="scroll-container py-4">
                <div className="flex gap-8 pb-4">
                  <div className={`flex gap-8 animate-scroll ${isScrollPaused ? 'paused' : ''}`}>
                    {/* First set of products */}
                    {products.map((product, index) => {
                      const productKey = `${product.id}-${index}-a`;
                      const isFocused = focusedProduct === productKey;
                      
                      return (
                        <div
                          key={productKey}
                          className={`product-item flex-shrink-0 relative ${isFocused ? 'focused' : ''}`}
                          onMouseEnter={() => handleProductHover(true)}
                          onMouseLeave={() => handleProductHover(false)}
                          onClick={() => handleProductTap(productKey)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleProductTap(productKey);
                            }
                          }}
                        >
                          <ProductCard
                            product={product}
                            fourthwallCheckoutDomain={checkoutDomain}
                            className="w-72"
                          />
                        </div>
                      );
                    })}
                    {/* Second set of products for seamless loop */}
                    {products.map((product, index) => {
                      const productKey = `${product.id}-${index}-b`;
                      const isFocused = focusedProduct === productKey;
                      
                      return (
                        <div
                          key={productKey}
                          className={`product-item flex-shrink-0 relative ${isFocused ? 'focused' : ''}`}
                          onMouseEnter={() => handleProductHover(true)}
                          onMouseLeave={() => handleProductHover(false)}
                          onClick={() => handleProductTap(productKey)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleProductTap(productKey);
                            }
                          }}
                        >
                          <ProductCard
                            product={product}
                            fourthwallCheckoutDomain={checkoutDomain}
                            className="w-72"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                {focusedProduct && (
                  <p className="text-gray-400 text-sm">
                    Tap the product again to continue scrolling
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}