// components/digital-products/alt-products-section.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { GumroadProduct } from "@/lib/gumroad";
import { LemonSqueezyProduct } from "@/lib/lemonsqueezy";
import { PatreonTier } from "@/lib/patreon";
import AltProductCard from "./alt-product-card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertCircle, SparklesIcon } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";

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
        We couldn't find any digital products. This might be due to a
        configuration issue or the services being temporarily unavailable.
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
  const [products, setProducts] = useState<AltProduct[]>(initialProducts || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // --- Device Detection ---
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const css = `
  .swiper {
    width: 100%;
    padding-bottom: 50px;
  }

  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-3d .swiper-slide-shadow-left {
    background-image: none;
  }
  .swiper-3d .swiper-slide-shadow-right{
    background: none;
  }

  .swiper-pagination {
    position: relative;
    margin-top: 2rem;
  }

  .swiper-pagination-bullet {
    background: rgba(156, 163, 175, 0.6);
    width: 14px;
    height: 14px;
    opacity: 1;
    border: 2px solid rgba(156, 163, 175, 0.3);
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dark .swiper-pagination-bullet {
    background: rgba(229, 231, 235, 0.6);
    border: 2px solid rgba(229, 231, 235, 0.3);
  }

  .swiper-pagination-bullet-active {
    background: rgba(107, 114, 128, 0.8);
    box-shadow: 0 0 15px rgba(107, 114, 128, 0.4);
    border-color: rgba(107, 114, 128, 0.6);
    transform: scaleX(2.5) scaleY(1.2);
    border-radius: 10px;
    width: 28px;
  }

  .dark .swiper-pagination-bullet-active {
    background: rgba(243, 244, 246, 0.9);
    box-shadow: 0 0 15px rgba(243, 244, 246, 0.4);
    border-color: rgba(243, 244, 246, 0.6);
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: #e5e7eb;
    background: rgba(75, 85, 99, 0.15);
    backdrop-filter: blur(15px);
    border-radius: 50%;
    width: 55px;
    height: 55px;
    margin-top: -27px;
    border: 2px solid rgba(75, 85, 99, 0.4);
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  .dark .swiper-button-next,
  .dark .swiper-button-prev {
    color: #f3f4f6;
    background: rgba(55, 65, 81, 0.2);
    border: 2px solid rgba(75, 85, 99, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  }

  .swiper-button-next:hover,
  .swiper-button-prev:hover {
    background: rgba(107, 114, 128, 0.25);
    border-color: rgba(107, 114, 128, 0.7);
    transform: scale(1.15);
    box-shadow: 0 6px 25px rgba(107, 114, 128, 0.5);
    color: #f3f4f6;
  }

  .dark .swiper-button-next:hover,
  .dark .swiper-button-prev:hover {
    background: rgba(75, 85, 99, 0.3);
    border-color: rgba(107, 114, 128, 0.6);
    transform: scale(1.15);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.5);
    color: #f9fafb;
  }

  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 20px;
    font-weight: 900;
  }

  @media (max-width: 768px) {
    .swiper-slide {
      width: 280px;
    }

    .swiper-button-next,
    .swiper-button-prev {
      display: none;
    }

    .swiper-pagination-bullet {
      width: 12px;
      height: 12px;
    }
  }
  `;

  const isScrollable = !loading && !error && products.length > 0;

  return (
    <>
      <style>{css}</style>

      <section className="bg-background py-4">
        <div className="w-full max-w-none px-2">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center gap-8 pb-4">
              {[...Array(isMobile ? 2 : 3)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && <ErrorDisplay error={error} onRetry={handleRetry} />}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <EmptyState onRetry={handleRetry} />
          )}

          {/* Products Carousel */}
          {isScrollable && (
            <div className="w-full space-y-4">
              <div className="mx-auto w-full rounded-[24px] border-2 border-gray-300/40 dark:border-gray-600/40 bg-gradient-to-br from-white/80 via-gray-50/90 to-white/80 dark:from-gray-800/80 dark:via-gray-700/90 dark:to-gray-800/80 p-3 shadow-lg shadow-gray-300/20 dark:shadow-gray-800/20 backdrop-blur-sm md:rounded-t-[44px]">
                <div className="relative mx-auto flex w-full flex-col rounded-[24px] border border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-br from-gray-50/30 via-white/20 to-gray-100/30 dark:from-gray-900/30 dark:via-gray-800/20 dark:to-gray-900/30 p-2 shadow-lg backdrop-blur-md md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-4">
                  <div className="flex flex-col justify-center pb-2 pl-4 pt-6 md:items-center">
                    <div className="text-center">
                      <h3 className="text-4xl font-bold tracking-tight text-orange-500 mb-2">
                        DIGITAL GOODS
                      </h3>
                      <p className="text-muted-foreground">
                        Premium digital content & tiers!
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-center gap-4">
                    <div className="w-full">
                      <Swiper
                        spaceBetween={30}
                        autoplay={{
                          delay: 3500,
                          disableOnInteraction: false,
                          pauseOnMouseEnter: true,
                        }}
                        effect={"coverflow"}
                        grabCursor={true}
                        centeredSlides={true}
                        loop={products.length > 1}
                        slidesPerView={"auto"}
                        coverflowEffect={{
                          rotate: 0,
                          stretch: 0,
                          depth: 100,
                          modifier: 2.5,
                        }}
                        pagination={{
                          clickable: true,
                          dynamicBullets: true,
                        }}
                        navigation={
                          !isMobile
                            ? {
                                nextEl: ".swiper-button-next",
                                prevEl: ".swiper-button-prev",
                              }
                            : false
                        }
                        modules={[
                          EffectCoverflow,
                          Autoplay,
                          Pagination,
                          Navigation,
                        ]}
                        breakpoints={{
                          320: {
                            slidesPerView: 1,
                            spaceBetween: 20,
                          },
                          640: {
                            slidesPerView: "auto",
                            spaceBetween: 30,
                          },
                          768: {
                            slidesPerView: "auto",
                            spaceBetween: 40,
                          },
                        }}
                      >
                        {products.map((product, index) => (
                          <SwiperSlide key={`${product.id}-${index}`}>
                            <div className="flex justify-center">
                              <AltProductCard product={product} />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
