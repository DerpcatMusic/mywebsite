// components/fourthwall-products-section.tsx
'use client';

import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getAllFourthwallProducts, FourthwallProduct } from '@/lib/fourthwall';
import ProductCard from '../product-card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [focusedProduct, setFocusedProduct] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const checkoutDomain = process.env.NEXT_PUBLIC_FW_CHECKOUT;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollSpeedRef = useRef(0.8); // Slightly faster for smoother auto-scroll
  const animationFrameRef = useRef<number | null>(null);

  // Card dimensions (adjust based on your actual card size)
  const CARD_WIDTH = 304; // 272px card + 32px gap (2rem)
  const CARDS_PER_SCROLL = 3;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProducts = await getAllFourthwallProducts();
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

  // Smooth scroll animation with easing
  const smoothScrollTo = useCallback((targetScrollLeft: number) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const startScrollLeft = container.scrollLeft;
    const distance = targetScrollLeft - startScrollLeft;
    const duration = 800; // 800ms for smooth animation
    const startTime = performance.now();

    // Cubic bezier easing function for smooth acceleration/deceleration
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      container.scrollLeft = startScrollLeft + distance * easedProgress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsScrolling(false);
      }
    };

    setIsScrolling(true);
    requestAnimationFrame(animate);
  }, []);

  // Infinite scroll animation for auto-scroll
  const animateScroll = useCallback(() => {
    if (!scrollContainerRef.current || !isAutoScrolling || isScrolling) return;

    const container = scrollContainerRef.current;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    
    if (container.scrollLeft >= maxScrollLeft) {
      container.scrollLeft = 0;
    } else {
      container.scrollLeft += scrollSpeedRef.current;
    }

    animationFrameRef.current = requestAnimationFrame(animateScroll);
  }, [isAutoScrolling, isScrolling]);

  // Start/stop auto scroll
  useEffect(() => {
    if (isAutoScrolling && products.length > 0 && !loading && !error && !isScrolling) {
      animationFrameRef.current = requestAnimationFrame(animateScroll);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAutoScrolling, products.length, loading, error, isScrolling, animateScroll]);

  // Pause auto scroll on interaction
  const handleScrollInteraction = useCallback(() => {
    setIsAutoScrolling(false);
    if (autoScrollIntervalRef.current) {
      clearTimeout(autoScrollIntervalRef.current);
    }
    // Resume after 6 seconds of no interaction (longer for smooth UX)
    autoScrollIntervalRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 6000);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (isScrolling) return; // Prevent scroll spam
    
    handleScrollInteraction();
    
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const currentScroll = container.scrollLeft;
      const scrollAmount = CARD_WIDTH * CARDS_PER_SCROLL;
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      let targetScroll: number;
      if (direction === 'left') {
        targetScroll = currentScroll - scrollAmount;
        // Handle infinite scroll left - if we're at the beginning, jump to end
        if (targetScroll < 0) {
          // Jump to the equivalent position from the end
          const totalCards = products.length;
          const equivalentPosition = maxScroll - Math.abs(targetScroll);
          targetScroll = Math.max(0, equivalentPosition);
        }
      } else {
        targetScroll = currentScroll + scrollAmount;
        // Handle infinite scroll right - if we exceed max, jump to beginning
        if (targetScroll > maxScroll) {
          const overflow = targetScroll - maxScroll;
          targetScroll = overflow;
        }
      }
      
      smoothScrollTo(targetScroll);
    }
  };

  const handleProductTap = (productId: string) => {
    if (focusedProduct === productId) {
      setFocusedProduct(null);
    } else {
      setFocusedProduct(productId);
      handleScrollInteraction();
    }
  };

  const isScrollable = !loading && !error && products.length > 0;

  // Duplicate products for seamless infinite scroll
  const duplicatedProducts = products.length > 0 ? [...products, ...products, ...products] : [];

  return (
    <>
      <style jsx>{`
        .scroll-container {
          display: flex;
          gap: 2rem;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          /* MODIFICATION: Added horizontal padding to allow glow to extend */
          padding: 2rem 2rem; 
          /* Enhanced smooth scrolling */
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          /* Add edge masks for modern look - only apply to scroll container */
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
          display: none;
        }
        
        .products-container {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 34rem;
          /* Add subtle perspective for 3D effect */
          perspective: 1000px;
        }
        
        .scroll-container {
          display: flex;
          gap: 2rem;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 2rem 2rem; /* Consistent padding */
          /* Enhanced smooth scrolling */
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          /* Add edge masks for modern look - only apply to scroll container */
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
        
        .arrow-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 40;
          height: 4rem;
          width: 4rem;
          border-radius: 50%;
          background: linear-gradient(135deg, 
            rgba(147, 51, 234, 0.95), 
            rgba(168, 85, 247, 0.95)
          );
          backdrop-filter: blur(20px);
          color: white;
          /* Ultra smooth modern transitions */
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 2px solid rgba(147, 51, 234, 0.4);
          box-shadow: 
            0 8px 32px rgba(147, 51, 234, 0.4),
            0 4px 16px rgba(0, 0, 0, 0.3),
            0 1px 0 rgba(255, 255, 255, 0.2) inset;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          /* Ensure perfect circle */
          flex-shrink: 0;
          transform-style: preserve-3d;
        }
        
        .arrow-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(147, 51, 234, 0.3), 
            rgba(168, 85, 247, 0.3)
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
            rgba(147, 51, 234, 1), 
            rgba(168, 85, 247, 1)
          );
          transform: translateY(-50%) scale(1.15) translateZ(10px);
          box-shadow: 
            0 16px 48px rgba(147, 51, 234, 0.6),
            0 8px 24px rgba(168, 85, 247, 0.4),
            0 4px 8px rgba(0, 0, 0, 0.3),
            0 1px 0 rgba(255, 255, 255, 0.3) inset;
          border-color: rgba(147, 51, 234, 0.6);
        }
        
        .arrow-button:active {
          transform: translateY(-50%) scale(1.05) translateZ(5px);
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 8px 24px rgba(147, 51, 234, 0.5),
            0 4px 12px rgba(168, 85, 247, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.2),
            0 1px 0 rgba(255, 255, 255, 0.2) inset;
        }
        
        .arrow-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: translateY(-50%) scale(0.9);
          box-shadow: 0 4px 12px rgba(147, 51, 234, 0.2);
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

        /* Mobile positioning */
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
            /* Adjust mask for mobile */
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
          }
        }

        /* Tablet positioning */
        @media (min-width: 769px) and (max-width: 1200px) {
          .arrow-button.left { left: -3rem; }
          .arrow-button.right { right: -3rem; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }

        .product-wrapper {
          /* Enhanced smooth transitions for 3D card content */
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-origin: center;
          flex-shrink: 0;
          display: flex;
          transform-style: preserve-3d;
          /* Add subtle parallax effect */
          will-change: transform;
        }

        .product-wrapper.focused {
          transform: scale(1.05) rotateY(2deg) translateZ(20px);
          z-index: 10;
          /* Enhanced shadow for focus */
          filter: drop-shadow(0 20px 40px rgba(147, 51, 234, 0.3));
        }

        .product-wrapper.unfocused {
          opacity: 0.6;
          transform: scale(0.95) rotateY(-1deg) translateZ(-10px);
          filter: blur(1px);
        }

        /* Add smooth entrance animation */
        .product-wrapper {
          animation: slideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
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

        /* Enhanced mobile interactions */
        @media (max-width: 768px) {
          .product-wrapper {
            cursor: pointer;
            /* Add touch feedback */
            -webkit-tap-highlight-color: rgba(147, 51, 234, 0.2);
          }
          
          .product-wrapper:active {
            transform: scale(0.98) translateZ(5px);
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }

        /* Smooth loading transitions */
        .loading-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <section className="py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
            Official Merchandise
          </h2>

          {loading && (
            <div className="flex justify-center pb-4 gap-8 loading-fade-in">
              {[...Array(3)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          )}

          {error && <ErrorDisplay error={error} onRetry={fetchProducts} />}
          {!loading && !error && products.length === 0 && <EmptyState onRetry={fetchProducts} />}

          {isScrollable && (
            <div className="products-container">
              <Button 
                onClick={() => handleScroll('left')} 
                className="arrow-button left"
                aria-label="Previous 3 products"
                disabled={isScrolling}
              >
                <ChevronLeft size={24} strokeWidth={2.5} className="arrow-icon" />
              </Button>
              
              <div 
                ref={scrollContainerRef} 
                className={`scroll-container`}
                onMouseEnter={() => setIsAutoScrolling(false)}
                onMouseLeave={() => setIsAutoScrolling(true)}
                onTouchStart={handleScrollInteraction}
              >
                {duplicatedProducts.map((product, index) => {
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
                        e.preventDefault();
                        handleProductTap(product.id);
                      }}
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <ProductCard
                        product={product}
                        fourthwallCheckoutDomain={checkoutDomain}
                      />
                    </div>
                  );
                })}
              </div>
              
              <Button 
                onClick={() => handleScroll('right')} 
                className="arrow-button right"
                aria-label="Next 3 products"
                disabled={isScrolling}
              >
                <ChevronRight size={24} strokeWidth={2.5} className="arrow-icon" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}