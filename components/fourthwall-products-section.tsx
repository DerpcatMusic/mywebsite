// components/fourthwall-products-section.tsx
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BrandData, useBrand } from "@/hooks/use-brand";
import { generateBrandCSS } from "@/lib/brand-provider";
import { FourthwallProduct, getAllFourthwallProducts } from "@/lib/fourthwall";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./product-card";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
    Autoplay,
    EffectCoverflow,
    Navigation,
    Pagination,
} from "swiper/modules";


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
          <div className="h-10 w-1/2 rounded-lg bg-secondary/50"></div>
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
        className="border-gray-600 text-gray-400 hover:bg-gray-800"
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
  const [isMobile, setIsMobile] = useState(false);
  const [activeBrandData, setActiveBrandData] = useState<BrandData | null>(null);

  const { brandData: fourthwallBrandData } = useBrand('fourthwall');

  const checkoutDomain = process.env.NEXT_PUBLIC_FW_CHECKOUT;

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


  useEffect(() => {
    if (fourthwallBrandData && !activeBrandData) {
      setActiveBrandData(fourthwallBrandData);
    }
  }, [fourthwallBrandData, activeBrandData]);

  const dynamicCarouselCssVariables = useMemo(() => {
    return activeBrandData ? generateBrandCSS(activeBrandData, 'carousel-brand') : '';
  }, [activeBrandData]);

  const handleSlideChange = () => {
    // Since this section only shows Fourthwall products, the active brand is always Fourthwall
    if (fourthwallBrandData) {
      setActiveBrandData(fourthwallBrandData);
    }
  };

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

  .swiper-button-next:hover,\n  .swiper-button-prev:hover {\n    background: rgba(147, 51, 234, 0.25);\n    border-color: rgba(147, 51, 234, 0.7);\n    transform: scale(1.15);\n    box-shadow: 0 6px 25px rgba(147, 51, 234, 0.5);\n    color: #a855f7;\n  }\n\n  .dark .swiper-button-next:hover,\n  .dark .swiper-button-prev:hover {\n    background: rgba(75, 85, 99, 0.3);\n    border-color: rgba(107, 114, 128, 0.6);\n    transform: scale(1.15);\n    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.5);\n    color: #f9fafb;\n  }\n\n  .swiper-button-next::after,\n  .swiper-button-prev::after {\n    font-size: 20px;\n    font-weight: 900;\n  }\n\n  @media (max-width: 768px) {\n    .swiper-slide {\n      width: 280px;\n    }\n\n    .swiper-button-next,\n    .swiper-button-prev {\n      display: none;\n    }\n\n    .swiper-pagination-bullet {\n      width: 12px;\n      height: 12px;\n    }\n  }\n  `;

  const isScrollable = !loading && !error && products.length > 0;

  return (
    <>
      <style>{css}</style> {/* Existing global Swiper CSS */}
      <style jsx>{`
        .carousel-wrapper {
          ${dynamicCarouselCssVariables}
        }
      `}</style>

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
          {error && <ErrorDisplay error={error} onRetry={fetchProducts} />}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <EmptyState onRetry={fetchProducts} />
          )}

          {/* Products Carousel */}
          {isScrollable && (
            <div className="w-full space-y-4">
              <div className="carousel-wrapper mx-auto w-full rounded-[24px] border-2 border-gray-300/40 bg-gradient-to-br from-white/80 via-gray-50/90 to-white/80 p-3 shadow-lg shadow-gray-300/20 backdrop-blur-sm dark:border-[rgba(var(--carousel-brand-secondary-rgb),0.4)] dark:from-[rgba(var(--carousel-brand-primary-rgb),0.8)] dark:via-[rgba(var(--carousel-brand-secondary-rgb),0.9)] dark:to-[rgba(var(--carousel-brand-primary-rgb),0.8)] dark:shadow-[rgba(var(--carousel-brand-primary-rgb),0.2)] md:rounded-t-[44px]">
                <div className="relative mx-auto flex w-full flex-col rounded-[24px] border border-gray-200/60 bg-gradient-to-br from-gray-50/30 via-white/20 to-gray-100/30 p-2 shadow-lg backdrop-blur-md dark:border-[rgba(var(--carousel-brand-accent-rgb),0.6)] dark:from-[rgba(var(--carousel-brand-primary-rgb),0.3)] dark:via-[rgba(var(--carousel-brand-secondary-rgb),0.2)] dark:to-[rgba(var(--carousel-brand-primary-rgb),0.3)] md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-4">
                   <div className="flex flex-col justify-center pb-2 pl-4 pt-6 md:items-center">
                     <div className="text-center">
                       <h3 className="mb-2 text-4xl font-bold tracking-tight text-purple-500">
                         OFFICIAL MERCH
                      </h3>
                      <p className="text-muted-foreground">
                        Fresh drip, fits all!
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-center gap-4">
                    <div className="w-full">
                      <Swiper
                        spaceBetween={30}
                        autoplay={{
                           delay: 3000,
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
                        onSlideChange={handleSlideChange}
                      >
                        {products.map((product, index) => (
                          <SwiperSlide key={`${product.id}-${index}`}>
                            <div className="flex justify-center">
                              <ProductCard
                                product={product}
                                fourthwallCheckoutDomain={checkoutDomain}
                              />
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
