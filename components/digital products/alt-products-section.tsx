// components/digital-products/alt-products-section.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GumroadProduct } from '@/lib/gumroad';
import { LemonSqueezyProduct } from '@/lib/lemonsqueezy';
import { PatreonTier } from '@/lib/patreon';
import AltProductCard from './alt-product-card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

type AltProduct = GumroadProduct | LemonSqueezyProduct | PatreonTier;

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
          {/* Skeleton button color aligned with orange theme */}
          <div className="h-10 bg-orange-900/50 rounded-lg w-1/2"></div> 
        </div>
      </div>
    </div>
  );
}

function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center p-4 rounded-lg bg-red-950/50 border border-red-800 text-red-200">
        <AlertCircle className="h-4 w-4 mr-3" />
        <div className="flex-grow">
          <p className="font-semibold mb-1">Error Loading Products:</p>
          <p className="text-sm">{error}</p>
        </div>
        {/* Error retry button styled for the new orange theme */}
        <Button variant="outline" size="sm" onClick={onRetry} className="ml-4 border-orange-700 text-orange-200 hover:bg-orange-800">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📦</div>
      <h3 className="text-2xl font-semibold mb-2 text-gray-300">No products found</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        We couldn't find any products. This might be due to a configuration issue or the services being temporarily unavailable.
      </p>
      {/* Empty state refresh button styled for the new orange theme */}
      <Button onClick={onRetry} variant="outline" className="border-orange-600 text-orange-400 hover:bg-orange-800">
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh Products
      </Button>
    </div>
  );
}

// --- Main Products Section ---
interface AltProductsSectionProps {
  initialProducts: AltProduct[];
}

export default function AltProductsSection({ initialProducts }: AltProductsSectionProps) {
  const [products, setProducts] = useState<AltProduct[]>(() => {
    if (!initialProducts || initialProducts.length === 0) {
      return [];
    }
    // Duplicate products three times to ensure seamless infinite scroll (A, B, C)
    return [...initialProducts, ...initialProducts, ...initialProducts];
  });
  
  const [error, setError] = useState<string | null>(null); 
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [focusedProduct, setFocusedProduct] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false); // To prevent button spam during scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); // For delaying auto-scroll resume
  const animationFrameRef = useRef<number | null>(null);
  const scrollSpeedRef = useRef(0.8); // Controls auto-scroll speed

  // Card dimensions (based on AltProductCard: w-72 = 288px) + gap-8 (2rem = 32px)
  const CARD_TOTAL_WIDTH = 288 + 32; // 320px
  const CARDS_PER_SCROLL = 3;

  const handleRetry = useCallback(() => {
    // In this setup, we just reload the page to get fresh initialProducts
    window.location.reload(); 
  }, []);

  // Smooth scroll animation with easing
  const smoothScrollTo = useCallback((targetScrollLeft: number) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const startScrollLeft = container.scrollLeft;
    const distance = targetScrollLeft - startScrollLeft;
    const duration = 800; // 800ms for smooth animation
    const startTime = performance.now();

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      container.scrollLeft = startScrollLeft + distance * easedProgress;

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsScrolling(false);
      }
    };

    setIsScrolling(true);
    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // Infinite scroll animation for auto-scroll (loops from set A to set B)
  const animateScroll = useCallback(() => {
    if (!scrollContainerRef.current || !isAutoScrolling || isScrolling || products.length === 0) return;

    const container = scrollContainerRef.current;
    // Calculate the width of one full set of original products (e.g., set A)
    const singleSetWidth = CARD_TOTAL_WIDTH * initialProducts.length;

    // If we auto-scroll past the first duplicated set (A), jump back to the start of the second set (B)
    // This creates a seamless loop for auto-scrolling
    if (container.scrollLeft >= singleSetWidth) {
      container.scrollLeft -= singleSetWidth;
    } else {
      container.scrollLeft += scrollSpeedRef.current;
    }

    animationFrameRef.current = requestAnimationFrame(animateScroll);
  }, [isAutoScrolling, isScrolling, products.length, initialProducts.length, CARD_TOTAL_WIDTH]);

  // Start/stop auto scroll
  useEffect(() => {
    if (isAutoScrolling && products.length > 0 && !error && !isScrolling) {
      animationFrameRef.current = requestAnimationFrame(animateScroll);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Cleanup on unmount or dependency change
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
    };
  }, [isAutoScrolling, products.length, error, isScrolling, animateScroll]);

  // Pause auto scroll on interaction
  const handleScrollInteraction = useCallback(() => {
    setIsAutoScrolling(false);
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
    }
    // Resume after 6 seconds of no interaction
    autoScrollTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 6000);
  }, []);

  // Manual Left/Right Arrow Scrolling Logic (copied from your working Fourthwall example)
  const handleScroll = (direction: 'left' | 'right') => {
    if (isScrolling || !scrollContainerRef.current) return; // Prevent scroll spam or if ref is null
    
    handleScrollInteraction(); // Pause auto-scroll on manual interaction
    setFocusedProduct(null); // Unfocus any product when manually scrolling

    const container = scrollContainerRef.current;
    const currentScroll = container.scrollLeft;
    const scrollAmount = CARD_TOTAL_WIDTH * CARDS_PER_SCROLL;
    // maxScroll reflects the total scrollable width of all duplicated products
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    let targetScroll: number;

    if (direction === 'left') {
      targetScroll = currentScroll - scrollAmount;
      // If we scroll left and go past the beginning of the carousel
      if (targetScroll < 0) {
        // Jump to an equivalent position at the end of the carousel.
        // This makes it seem like a continuous loop from right to left.
        targetScroll = maxScroll - Math.abs(targetScroll);
        targetScroll = Math.max(0, targetScroll); // Ensure target doesn't go below 0
      }
    } else { // direction === 'right'
      targetScroll = currentScroll + scrollAmount;
      // If we scroll right and go past the end of the carousel
      if (targetScroll > maxScroll) {
        // Calculate how much we overshot the max scroll position
        const overflow = targetScroll - maxScroll;
        // Jump to the beginning of the carousel plus the overflow amount.
        // This makes it seem like a continuous loop from left to right.
        targetScroll = overflow;
      }
    }
    
    smoothScrollTo(targetScroll);
  };

  // Handle individual product tap/click for focus effect
  const handleProductTap = (productId: string) => {
    handleScrollInteraction(); // Pause auto-scroll
    if (focusedProduct === productId) {
      setFocusedProduct(null); // Unfocus if clicked again
    } else {
      setFocusedProduct(productId); // Focus the clicked product
    }
  };

  const hasLoadedProducts = products.length > 0;
  const loading = false; // Assuming initialProducts are pre-loaded via props for this component.

  return (
    <>
      <style jsx>{`
        /* --- General Layout and Container Styles --- */
        .products-container {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 34rem; /* Adjusted for card height and effects */
          perspective: 1000px; /* For 3D transforms */
        }

        .scroll-container {
          display: flex;
          gap: 2rem;
          overflow-x: auto; /* Allow direct scroll manipulation via JS */
          scrollbar-width: none; /* Hide scrollbar for Firefox */
          -ms-overflow-style: none; /* Hide scrollbar for IE/Edge */
          padding: 2rem 2rem; /* Important: Padding allows glow/scale to extend */
          scroll-behavior: smooth; /* For native scroll behavior (though JS overrides for buttons) */
          -webkit-overflow-scrolling: touch; /* Enhance touch scrolling on iOS */
          white-space: nowrap; /* Keep product cards in a single line */

          /* Edge masks for a modern, fading look */
          mask: linear-gradient(to right, 
            transparent 0%, 
            rgba(0,0,0,0.1) 3%, 
            black 12%, 
            black 88%, 
            rgba(0,0,0,0.1) 97%, 
            transparent 100%
          );
          -webkit-mask: linear-gradient(to right, 
            transparent 0%, 
            rgba(0,0,0,0.1) 3%, 
            black 12%, 
            black 88%, 
            rgba(0,0,0,0.1) 97%, 
            transparent 100%
          );
        }
        
        .scroll-container::-webkit-scrollbar {
          display: none; /* Hide scrollbar for Chrome, Safari, Opera */
        }

        /* --- Arrow Button Styles - NOW ORANGE AND SEXY --- */
        .arrow-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 40;
          height: 4rem;
          width: 4rem;
          border-radius: 50%;
          background: linear-gradient(135deg, 
            #f97316, /* Orange 500 */
            #ea580c  /* Orange 600 */
          );
          backdrop-filter: blur(20px);
          color: white;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 2px solid rgba(249, 115, 22, 0.4); /* Orange 500 with opacity */
          box-shadow: 
            0 8px 32px rgba(249, 115, 22, 0.4), /* Orange 500 shadow */
            0 4px 16px rgba(0, 0, 0, 0.3),
            0 1px 0 rgba(255, 255, 255, 0.2) inset;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          transform-style: preserve-3d;
          cursor: pointer; /* Ensure cursor indicates interactivity */
        }
        
        .arrow-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(249, 115, 22, 0.3), /* Orange 500 with opacity */
            rgba(234, 88, 12, 0.3)   /* Orange 600 with opacity */
          );
          border-radius: 50%;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform: scale(0.8);
        }
        
        .arrow-button:hover::before {
          opacity: 1;
          transform: scale(1);
          animation: pulse 2s infinite;
        }
        
        .arrow-button:hover {
          background: linear-gradient(135deg, 
            #ea580c, /* Orange 600 */
            #c2410c  /* Orange 700 */
          );
          transform: translateY(-50%) scale(1.15) translateZ(10px);
          box-shadow: 
            0 16px 48px rgba(249, 115, 22, 0.6), /* Stronger Orange 500 shadow */
            0 8px 24px rgba(234, 88, 12, 0.4),   /* Orange 600 shadow */
            0 4px 8px rgba(0, 0, 0, 0.3),
            0 1px 0 rgba(255, 255, 255, 0.3) inset;
          border-color: rgba(249, 115, 22, 0.6); /* Stronger Orange 500 border */
        }
        
        .arrow-button:active {
          transform: translateY(-50%) scale(1.05) translateZ(5px);
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 8px 24px rgba(249, 115, 22, 0.5), /* Orange 500 shadow */
            0 4px 12px rgba(234, 88, 12, 0.3),   /* Orange 600 shadow */
            0 2px 4px rgba(0, 0, 0, 0.2),
            0 1px 0 rgba(255, 255, 255, 0.2) inset;
        }
        
        .arrow-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: translateY(-50%) scale(0.9);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2); /* Faded Orange shadow */
        }
        
        .arrow-button .arrow-icon {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          z-index: 1;
        }
        
        .arrow-button:hover .arrow-icon {
          transform: scale(1.1);
          filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8));
        }
        
        .arrow-button:active .arrow-icon {
          transform: scale(0.95);
        }
        
        .arrow-button.left { 
          left: -5rem; 
        }
        .arrow-button.right { 
          right: -5rem; 
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }

        /* --- Product Card Wrapper Styles (for 3D effects and focus) --- */
        .product-wrapper {
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-origin: center;
          flex-shrink: 0;
          display: flex;
          transform-style: preserve-3d;
          will-change: transform, opacity, filter;
        }

        .product-wrapper.focused {
          transform: scale(1.05) rotateY(2deg) translateZ(20px);
          z-index: 10;
          filter: drop-shadow(0 20px 40px rgba(249, 115, 22, 0.3)); /* Orange focus shadow */
        }

        .product-wrapper.unfocused {
          opacity: 0.6;
          transform: scale(0.95) rotateY(-1deg) translateZ(-10px);
          filter: blur(1px);
        }

        /* Smooth entrance animation for products */
        .product-wrapper {
          animation: slideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0; /* Start hidden for animation */
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        /* --- Responsive Adjustments --- */
        @media (max-width: 768px) {
          .arrow-button.left { left: 0.5rem; }
          .arrow-button.right { right: 0.5rem; }
          .arrow-button {
            height: 3.5rem;
            width: 3.5rem;
          }
          .products-container {
            min-height: 30rem;
          }
          .scroll-container {
            mask: linear-gradient(to right, 
              transparent 0%, 
              rgba(0,0,0,0.2) 8%, 
              black 20%, 
              black 80%, 
              rgba(0,0,0,0.2) 92%, 
              transparent 100%
            );
            -webkit-mask: linear-gradient(to right, 
              transparent 0%, 
              rgba(0,0,0,0.2) 8%, 
              black 20%, 
              black 80%, 
              rgba(0,0,0,0.2) 92%, 
              transparent 100%
            );
            padding: 2rem 1rem; /* Adjust padding for mobile */
          }
          .product-wrapper {
            cursor: pointer;
            -webkit-tap-highlight-color: rgba(249, 115, 22, 0.2); /* Orange tap highlight */
          }
          .product-wrapper:active {
            transform: scale(0.98) translateZ(5px);
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }

        @media (min-width: 769px) and (max-width: 1200px) {
          .arrow-button.left { left: -3rem; }
          .arrow-button.right { right: -3rem; }
        }
      `}</style>
      
      <section className="py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            Digital Products & Tiers
          </h2>

          {loading && initialProducts.length === 0 && (
            <div className="flex justify-center pb-4 gap-8 loading-fade-in">
              {[...Array(3)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          )}

          {error && <ErrorDisplay error={error} onRetry={handleRetry} />}
          {!loading && !error && products.length === 0 && <EmptyState onRetry={handleRetry} />}

          {/* Only render the carousel if there are products to show */}
          {hasLoadedProducts && (
            <div className="products-container">
              <button 
                onClick={() => handleScroll('left')} 
                className="arrow-button left"
                aria-label="Previous 3 products"
                disabled={isScrolling}
              >
                <ChevronLeft size={24} strokeWidth={2.5} className="arrow-icon" />
              </button>
              
              <div 
                ref={scrollContainerRef} 
                className="scroll-container"
                onMouseEnter={() => setIsAutoScrolling(false)}
                onMouseLeave={() => setIsAutoScrolling(true)}
                onTouchStart={handleScrollInteraction}
              >
                {products.map((product, index) => {
                  // Use original product ID for focus, but index for unique key in duplicated list
                  const uniqueKey = `${product.id}-${index}`; 
                  const isFocused = focusedProduct === product.id;
                  const isUnfocused = focusedProduct !== null && focusedProduct !== product.id;
                  
                  return (
                    <div 
                      key={uniqueKey} 
                      className={`flex-shrink-0 flex product-wrapper ${
                        isFocused ? 'focused' : isUnfocused ? 'unfocused' : ''
                      }`}
                      onClick={() => handleProductTap(product.id)}
                      onTouchEnd={(e) => {
                        e.preventDefault(); // Prevent default browser touch actions
                        handleProductTap(product.id);
                      }}
                      style={{
                        // Staggered entrance animation delay: apply to each *original* product once
                        animationDelay: `${(index % initialProducts.length) * 0.1}s` 
                      }}
                    >
                      <AltProductCard
                        product={product}
                        // No fourthwallCheckoutDomain prop for AltProductCard
                      />
                    </div>
                  );
                })}
              </div>
              
              <button 
                onClick={() => handleScroll('right')} 
                className="arrow-button right"
                aria-label="Next 3 products"
                disabled={isScrolling}
              >
                <ChevronRight size={24} strokeWidth={2.5} className="arrow-icon" />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}