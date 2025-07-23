// components/fourthwall-products-section.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { getAllFourthwallProducts, FourthwallProduct } from "@/lib/fourthwall";
import ProductCard from "./product-card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- Helper Components ---
function ProductSkeleton() {
  return (
    <div className="w-72 flex-shrink-0 animate-pulse rounded-lg bg-secondary/20">
      <div className="h-56 w-full rounded-t-lg bg-secondary/30"></div>
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-secondary/30"></div>
        <div className="h-3 w-full rounded bg-secondary/30"></div>
        <div className="h-3 w-1/2 rounded bg-secondary/30"></div>
        <div className="flex items-center justify-between pt-4">
          <div className="h-8 w-1/3 rounded bg-secondary/30"></div>
          <div className="h-10 w-1/2 rounded-lg bg-purple-900/50"></div>
        </div>
      </div>
    </div>
  );
}

function ErrorDisplay({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <Alert
      variant="destructive"
      className="mx-auto max-w-md border-red-800 bg-red-950/50"
    >
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-red-200">{error}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="ml-4 border-red-700 text-red-200 hover:bg-red-800"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function EmptyState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="py-12 text-center">
      <div className="mb-4 text-6xl">📦</div>
      <h3 className="mb-2 text-2xl font-semibold text-gray-300">
        No products found
      </h3>
      <p className="mx-auto mb-6 max-w-md text-gray-400">
        We couldn't find any products. Please check your Fourthwall
        configuration and API token.
      </p>
      <Button
        onClick={onRetry}
        variant="outline"
        className="border-purple-600 text-purple-400 hover:bg-purple-800"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
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
  const [isMobile, setIsMobile] = useState(false);

  const checkoutDomain = process.env.NEXT_PUBLIC_FW_CHECKOUT;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const resumeScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const CARD_WIDTH = 304; // 18rem (288px) card + 1rem (16px) gap
  const CARDS_PER_SCROLL = 3;
  const SCROLL_ANIMATION_DURATION = 500;

  // --- Device Detection ---
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // --- Data Fetching ---
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProducts = await getAllFourthwallProducts();
      setProducts(fetchedProducts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getOneSetWidth = useCallback(() => {
    if (!products || products.length === 0) return 0;
    return products.length * CARD_WIDTH;
  }, [products]);

  const setupInitialScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const oneSetWidth = getOneSetWidth();
      scrollContainerRef.current.scrollTo({
        left: oneSetWidth,
        behavior: "instant",
      });
    }
  }, [getOneSetWidth]);

  useEffect(() => {
    if (!loading && products.length > 0 && !isMobile) {
      const timer = setTimeout(() => setupInitialScroll(), 50);
      return () => clearTimeout(timer);
    }
  }, [loading, products.length, isMobile, setupInitialScroll]);

  const smoothScrollTo = useCallback((target: number, duration: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const startPosition = container.scrollLeft;
    const distance = target - startPosition;
    let startTime: number | null = null;
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      container.scrollLeft =
        startPosition + distance * easeInOutCubic(progress);
      if (timeElapsed < duration) {
        animationFrameRef.current = requestAnimationFrame(animation);
      }
    };
    animationFrameRef.current = requestAnimationFrame(animation);
  }, []);

  const handleManualInteraction = useCallback(() => {
    setIsAutoScrolling(false);
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    if (resumeScrollTimeoutRef.current)
      clearTimeout(resumeScrollTimeoutRef.current);
    resumeScrollTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 6000);
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current || products.length === 0) return;
    handleManualInteraction();
    const container = scrollContainerRef.current;
    const scrollAmount = CARD_WIDTH * CARDS_PER_SCROLL;
    const oneSetWidth = getOneSetWidth();
    let currentScroll = container.scrollLeft;
    if (
      direction === "right" &&
      currentScroll >= oneSetWidth * 2 - scrollAmount
    ) {
      container.scrollLeft = currentScroll - oneSetWidth;
    } else if (direction === "left" && currentScroll <= oneSetWidth) {
      container.scrollLeft = currentScroll + oneSetWidth;
    }
    currentScroll = container.scrollLeft;
    const targetScroll =
      currentScroll + (direction === "right" ? scrollAmount : -scrollAmount);
    smoothScrollTo(targetScroll, SCROLL_ANIMATION_DURATION);
  };

  const animateAutoScroll = useCallback(() => {
    if (!scrollContainerRef.current || !isAutoScrolling) return;
    const container = scrollContainerRef.current;
    const oneSetWidth = getOneSetWidth();
    if (container.scrollLeft >= oneSetWidth * 2) {
      container.scrollLeft -= oneSetWidth;
    }
    const target = container.scrollLeft + 1;
    smoothScrollTo(target, 50);
  }, [isAutoScrolling, getOneSetWidth, smoothScrollTo]);

  useEffect(() => {
    if (
      isAutoScrolling &&
      !loading &&
      !error &&
      products.length > 0 &&
      !isMobile
    ) {
      const autoScrollInterval = setInterval(animateAutoScroll, 50);
      return () => clearInterval(autoScrollInterval);
    }
  }, [
    isAutoScrolling,
    loading,
    error,
    products.length,
    isMobile,
    animateAutoScroll,
  ]);

  const handleProductTap = (productId: string) => {
    setFocusedProduct((prev) => (prev === productId ? null : productId));
    if (!isMobile) handleManualInteraction();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    productId: string,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleProductTap(productId);
    }
  };

  const isScrollable = !loading && !error && products.length > 0;
  const productsToRender = isMobile
    ? products
    : isScrollable
      ? [...products, ...products, ...products]
      : [];

  return (
    <>
      <style jsx>{`
        .products-container {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 38rem;
          perspective: 1000px;
          padding: 0 4rem;
          transform-style: preserve-3d; /* FIX: Added to respect child 3D transforms */
        }

        .scroll-container {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          overflow-y: visible; /* Allow vertical overflow for focused card */
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 4rem 2rem;
          scroll-behavior: auto;
          -webkit-overflow-scrolling: touch;
          mask: linear-gradient(
            to right,
            transparent,
            black 8%,
            black 92%,
            transparent
          );
          -webkit-mask: linear-gradient(
            to right,
            transparent,
            black 8%,
            black 92%,
            transparent
          );
          width: 100%;
        }

        .scroll-container::-webkit-scrollbar {
          display: none;
        }

        .arrow-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50;
          height: 4rem;
          width: 4rem;
          border: none;
          outline: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0;
          background: rgba(255, 70, 0, 0.15);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 70, 0, 0.3);
          border-radius: 50%;
          background-image: linear-gradient(
            135deg,
            rgba(255, 70, 0, 0.4) 0%,
            rgba(255, 45, 0, 0.6) 50%,
            rgba(234, 88, 12, 0.4) 100%
          );
          box-shadow:
            0 0 20px rgba(255, 70, 0, 0.3),
            0 0 40px rgba(255, 70, 0, 0.2),
            0 4px 8px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(231, 231, 231, 0.1);
          color: hsl(var(--foreground));
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow:
              0 0 20px rgba(255, 70, 0, 0.3),
              0 0 40px rgba(255, 70, 0, 0.2),
              0 4px 8px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(231, 231, 231, 0.1);
          }
          50% {
            box-shadow:
              0 0 30px rgba(255, 70, 0, 0.5),
              0 0 60px rgba(255, 70, 0, 0.3),
              0 4px 12px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(231, 231, 231, 0.2);
          }
        }

        .arrow-button:hover {
          transform: translateY(-50%) scale(1.1);
          background-image: linear-gradient(
            135deg,
            rgba(255, 70, 0, 0.6) 0%,
            rgba(255, 45, 0, 0.8) 50%,
            rgba(234, 88, 12, 0.6) 100%
          );
          box-shadow:
            0 0 30px rgba(255, 70, 0, 0.6),
            0 0 60px rgba(255, 70, 0, 0.4),
            0 0 100px rgba(255, 70, 0, 0.2),
            0 8px 16px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(231, 231, 231, 0.2);
          color: hsl(var(--primary-foreground));
          animation: none;
        }

        .arrow-button:active {
          transform: translateY(-50%) scale(1.05);
          transition-duration: 0.1s;
          box-shadow:
            0 0 20px rgba(255, 70, 0, 0.8),
            0 0 40px rgba(255, 70, 0, 0.6),
            0 2px 4px rgba(0, 0, 0, 0.6),
            inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .arrow-button.left {
          left: 1rem;
        }
        .arrow-button.right {
          right: 1rem;
        }

        .product-wrapper {
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-origin: center;
          flex-shrink: 0;
          will-change: transform, opacity;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          position: relative;
        }

        .product-wrapper.focused {
          transform: scale(1.08) translateZ(30px);
          z-index: 20;
          /* FIX: Removed the filter property that caused the glow */
        }

        .product-wrapper.unfocused {
          opacity: 0.7;
          transform: scale(0.96);
          filter: blur(1px);
        }

        @media (max-width: 768px) {
          .products-container {
            position: static;
            min-height: auto;
            align-items: flex-start;
            padding: 0;
          }
          .scroll-container {
            display: flex;
            flex-wrap: wrap;
            overflow-x: hidden;
            overflow-y: visible;
            justify-content: center;
            padding: 1rem 0.5rem;
            mask: none;
            -webkit-mask: none;
            height: auto;
          }
          .product-wrapper {
            width: calc(50% - 0.5rem);
            max-width: 288px;
            margin-bottom: 1rem;
            flex-grow: 1;
          }
          .arrow-button {
            display: none;
          }
          .pb-4.gap-8 {
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
          }
          .pb-4.gap-8 > div {
            width: calc(50% - 0.5rem);
            max-width: 288px;
          }
        }
      `}</style>

      {/* FIX: Removed overflow-hidden from the main section */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 bg-gradient-to-r from-primary via-[hsl(20_100%_55%)] to-[hsl(25_100%_50%)] bg-clip-text text-center text-5xl font-extrabold text-transparent">
            Official Merchandise
          </h2>

          {loading && (
            <div className="flex justify-center gap-8 pb-4">
              {[...Array(isMobile ? 4 : 3)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}
          {error && <ErrorDisplay error={error} onRetry={fetchProducts} />}
          {!loading && !error && products.length === 0 && (
            <EmptyState onRetry={fetchProducts} />
          )}

          {isScrollable && (
            <div
              className="products-container"
              onMouseEnter={!isMobile ? handleManualInteraction : undefined}
              onMouseLeave={
                !isMobile ? () => setIsAutoScrolling(true) : undefined
              }
            >
              {!isMobile && (
                <>
                  <button
                    onClick={() => handleScroll("left")}
                    className="arrow-button left"
                    aria-label="Previous products"
                  >
                    <ChevronLeft size={20} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => handleScroll("right")}
                    className="arrow-button right"
                    aria-label="Next products"
                  >
                    <ChevronRight size={20} strokeWidth={2.5} />
                  </button>
                </>
              )}

              <div ref={scrollContainerRef} className="scroll-container">
                {productsToRender.map((product, index) => {
                  const uniqueKey = `${product.id}-${index}`;
                  const isFocused = focusedProduct === product.id;
                  const isUnfocused = focusedProduct !== null && !isFocused;

                  return (
                    <div
                      key={uniqueKey}
                      className={`product-wrapper ${isFocused ? "focused" : ""} ${isUnfocused ? "unfocused" : ""}`}
                      onClick={() => handleProductTap(product.id)}
                      onKeyDown={(e) => handleKeyDown(e, product.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${product.name}`}
                    >
                      <ProductCard
                        product={product}
                        fourthwallCheckoutDomain={checkoutDomain}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
