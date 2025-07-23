// components/digital-products/alt-products-section.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { GumroadProduct } from "@/lib/gumroad";
import { LemonSqueezyProduct } from "@/lib/lemonsqueezy";
import { PatreonTier } from "@/lib/patreon";
import AltProductCard from "./alt-product-card";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type AltProduct = GumroadProduct | LemonSqueezyProduct | PatreonTier;

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
          <div className="h-10 w-1/2 rounded-lg bg-orange-900/50"></div>
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
    <div className="mx-auto max-w-md">
      <div className="flex items-center rounded-lg border border-red-800 bg-red-950/50 p-4 text-red-200">
        <AlertCircle className="mr-3 h-4 w-4" />
        <div className="flex-grow">
          <p className="mb-1 font-semibold">Error Loading Products:</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="ml-4 border-orange-700 text-orange-200 hover:bg-orange-800"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    </div>
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
        We couldn't find any products. This might be due to a configuration
        issue or the services being temporarily unavailable.
      </p>
      <Button
        onClick={onRetry}
        variant="outline"
        className="border-orange-600 text-orange-400 hover:bg-orange-800"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh Products
      </Button>
    </div>
  );
}

// --- Main Products Section ---
interface AltProductsSectionProps {
  initialProducts: AltProduct[];
}

export default function AltProductsSection({
  initialProducts,
}: AltProductsSectionProps) {
  // Store the original, single set of products
  const [originalProducts] = useState(initialProducts || []);
  // Create the triplicated array for rendering the infinite loop
  const productsToRender =
    originalProducts.length > 0
      ? [...originalProducts, ...originalProducts, ...originalProducts]
      : [];

  const [error] = useState<string | null>(null); // Assuming error handling happens before this component
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [focusedProduct, setFocusedProduct] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const resumeScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const CARD_WIDTH = 288; // w-72
  const GAP_WIDTH = 32; // gap-8 = 2rem
  const CARD_TOTAL_WIDTH = CARD_WIDTH + GAP_WIDTH;
  const CARDS_PER_SCROLL = 3;
  const SCROLL_ANIMATION_DURATION = 500;

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const getOneSetWidth = useCallback(() => {
    if (originalProducts.length === 0) return 0;
    return originalProducts.length * CARD_TOTAL_WIDTH;
  }, [originalProducts, CARD_TOTAL_WIDTH]);

  // --- Infinite Scroll Setup ---
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
    if (originalProducts.length > 0) {
      const timer = setTimeout(() => setupInitialScroll(), 50);
      return () => clearTimeout(timer);
    }
  }, [originalProducts.length, setupInitialScroll]);

  // --- Custom, Interruptible Animation Engine ---
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

  // --- User Interaction & Auto-scroll Control ---
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

  // --- REWRITTEN & FIXED: Core Scrolling Logic ---
  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current || originalProducts.length === 0) return;

    handleManualInteraction();
    setFocusedProduct(null);

    const container = scrollContainerRef.current;
    const scrollAmount = CARD_TOTAL_WIDTH * CARDS_PER_SCROLL;
    const oneSetWidth = getOneSetWidth();

    let currentScroll = container.scrollLeft;

    // Silent jump logic: reposition instantly if we're about to cross a boundary
    if (
      direction === "right" &&
      currentScroll >= oneSetWidth * 2 - scrollAmount
    ) {
      container.scrollLeft -= oneSetWidth;
    } else if (direction === "left" && currentScroll <= oneSetWidth) {
      container.scrollLeft += oneSetWidth;
    }

    currentScroll = container.scrollLeft;
    const targetScroll =
      currentScroll + (direction === "right" ? scrollAmount : -scrollAmount);

    smoothScrollTo(targetScroll, SCROLL_ANIMATION_DURATION);
  };

  // --- REWRITTEN & FIXED: Auto-Scroll Logic ---
  const animateAutoScroll = useCallback(() => {
    if (!scrollContainerRef.current || !isAutoScrolling) return;

    const container = scrollContainerRef.current;
    const oneSetWidth = getOneSetWidth();

    // Check if we've scrolled past the end of the middle set
    if (container.scrollLeft >= oneSetWidth * 2) {
      // Instantly jump back to the equivalent position in the middle set
      container.scrollLeft -= oneSetWidth;
    }

    // Animate by smoothly scrolling 1px
    smoothScrollTo(container.scrollLeft + 1, 50);
  }, [isAutoScrolling, getOneSetWidth, smoothScrollTo]);

  useEffect(() => {
    if (isAutoScrolling && originalProducts.length > 0) {
      const autoScrollInterval = setInterval(animateAutoScroll, 50);
      return () => clearInterval(autoScrollInterval);
    }
  }, [isAutoScrolling, originalProducts.length, animateAutoScroll]);

  const handleProductTap = (productId: string) => {
    handleManualInteraction();
    setFocusedProduct((prev) => (prev === productId ? null : prev));
  };

  return (
    <>
      <style jsx>{`
        /* All original orange-themed CSS is preserved here. No changes needed. */
        /* --- General Layout and Container Styles --- */
        .products-container {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 34rem; /* Adjusted for card height and effects */
          perspective: 1000px; /* For 3D transforms */
          transform-style: preserve-3d;
        }

        .scroll-container {
          display: flex;
          gap: 2rem;
          overflow-x: auto; /* Allow direct scroll manipulation via JS */
          scrollbar-width: none; /* Hide scrollbar for Firefox */
          -ms-overflow-style: none; /* Hide scrollbar for IE/Edge */
          padding: 2rem 2rem; /* Important: Padding allows glow/scale to extend */
          scroll-behavior: auto; /* IMPORTANT for script-driven scroll */
          -webkit-overflow-scrolling: touch; /* Enhance touch scrolling on iOS */
          white-space: nowrap; /* Keep product cards in a single line */

          /* Edge masks for a modern, fading look */
          mask: linear-gradient(
            to right,
            transparent 0%,
            rgba(0, 0, 0, 0.1) 3%,
            black 12%,
            black 88%,
            rgba(0, 0, 0, 0.1) 97%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            to right,
            transparent 0%,
            rgba(0, 0, 0, 0.1) 3%,
            black 12%,
            black 88%,
            rgba(0, 0, 0, 0.1) 97%,
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
          background: linear-gradient(
            135deg,
            hsl(var(--primary)),
            rgba(255, 45, 0, 1)
          );
          backdrop-filter: blur(20px);
          color: hsl(var(--primary-foreground));
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 2px solid rgba(255, 70, 0, 0.4);
          box-shadow:
            0 8px 32px rgba(255, 70, 0, 0.4),
            0 4px 16px rgba(0, 0, 0, 0.3),
            0 1px 0 rgba(231, 231, 231, 0.2) inset;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          transform-style: preserve-3d;
          cursor: pointer; /* Ensure cursor indicates interactivity */
        }

        .arrow-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 70, 0, 0.3),
            rgba(255, 45, 0, 0.3)
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
          background: linear-gradient(
            135deg,
            rgba(255, 45, 0, 1),
            rgba(194, 65, 12, 1)
          );
          transform: translateY(-50%) scale(1.15) translateZ(10px);
          box-shadow:
            0 16px 48px rgba(255, 70, 0, 0.6),
            0 8px 24px rgba(255, 45, 0, 0.4),
            0 4px 8px rgba(0, 0, 0, 0.3),
            0 1px 0 rgba(231, 231, 231, 0.3) inset;
          border-color: rgba(255, 70, 0, 0.6);
        }

        .arrow-button:active {
          transform: translateY(-50%) scale(1.05) translateZ(5px);
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow:
            0 8px 24px rgba(255, 70, 0, 0.5),
            0 4px 12px rgba(255, 45, 0, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.2),
            0 1px 0 rgba(231, 231, 231, 0.2) inset;
        }

        .arrow-button .arrow-icon {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          z-index: 1;
        }

        .arrow-button:hover .arrow-icon {
          transform: scale(1.1);
          filter: drop-shadow(0 0 12px rgba(231, 231, 231, 0.8));
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
          0%,
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
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
          filter: drop-shadow(0 20px 40px rgba(255, 70, 0, 0.3));
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
          .arrow-button.left {
            left: 0.5rem;
          }
          .arrow-button.right {
            right: 0.5rem;
          }
          .arrow-button {
            height: 3.5rem;
            width: 3.5rem;
          }
          .products-container {
            min-height: 30rem;
          }
          .scroll-container {
            mask: linear-gradient(
              to right,
              transparent 0%,
              rgba(0, 0, 0, 0.2) 8%,
              black 20%,
              black 80%,
              rgba(0, 0, 0, 0.2) 92%,
              transparent 100%
            );
            -webkit-mask: linear-gradient(
              to right,
              transparent 0%,
              rgba(0, 0, 0, 0.2) 8%,
              black 20%,
              black 80%,
              rgba(0, 0, 0, 0.2) 92%,
              transparent 100%
            );
            padding: 2rem 1rem; /* Adjust padding for mobile */
          }
          .product-wrapper {
            cursor: pointer;
            -webkit-tap-highlight-color: rgba(255, 70, 0, 0.2);
          }
          .product-wrapper:active {
            transform: scale(0.98) translateZ(5px);
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }

        @media (min-width: 769px) and (max-width: 1200px) {
          .arrow-button.left {
            left: -3rem;
          }
          .arrow-button.right {
            right: -3rem;
          }
        }
      `}</style>

      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 bg-gradient-to-r from-primary via-[hsl(20_100%_55%)] to-[hsl(25_100%_50%)] bg-clip-text text-center text-5xl font-extrabold text-transparent">
            Digital Products & Tiers
          </h2>

          {originalProducts.length === 0 &&
            (error ? (
              <ErrorDisplay error={error} onRetry={handleRetry} />
            ) : (
              <EmptyState onRetry={handleRetry} />
            ))}

          {originalProducts.length > 0 && (
            <div
              className="products-container"
              onMouseEnter={handleManualInteraction}
              onMouseLeave={() => setIsAutoScrolling(true)}
              onTouchStart={handleManualInteraction}
            >
              <button
                onClick={() => handleScroll("left")}
                className="arrow-button left"
                aria-label="Previous products"
              >
                <ChevronLeft
                  size={24}
                  strokeWidth={2.5}
                  className="arrow-icon"
                />
              </button>

              <div ref={scrollContainerRef} className="scroll-container">
                {productsToRender.map((product, index) => {
                  const uniqueKey = `${product.id}-${index}`;
                  const isFocused = focusedProduct === product.id;
                  const isUnfocused =
                    focusedProduct !== null && focusedProduct !== product.id;

                  return (
                    <div
                      key={uniqueKey}
                      className={`product-wrapper ${
                        isFocused ? "focused" : isUnfocused ? "unfocused" : ""
                      }`}
                      onClick={() => handleProductTap(product.id)}
                      style={{
                        animationDelay: `${(index % originalProducts.length) * 0.1}s`,
                      }}
                    >
                      <AltProductCard product={product} />
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => handleScroll("right")}
                className="arrow-button right"
                aria-label="Next products"
              >
                <ChevronRight
                  size={24}
                  strokeWidth={2.5}
                  className="arrow-icon"
                />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
