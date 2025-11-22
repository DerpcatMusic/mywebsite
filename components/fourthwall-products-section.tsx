"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FourthwallProduct, getAllFourthwallProducts } from "@/lib/fourthwall";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "./product-card";

gsap.registerPlugin(ScrollTrigger);

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

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const checkoutDomain = process.env.NEXT_PUBLIC_FW_CHECKOUT;

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

  useGSAP(() => {
    if (!loading && products.length > 0 && gridRef.current) {
      gsap.from(gridRef.current.children, {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.2)",
      });
    }
  }, [loading, products]);

  const isScrollable = !loading && !error && products.length > 0;

  return (
    <section ref={containerRef} className="w-full py-8">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
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

        {/* Products Grid */}
        {isScrollable && (
          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3"
          >
            {products.map(product => (
              <div
                key={product.id}
                className="flex transform justify-center transition-transform duration-300 hover:scale-105"
              >
                <ProductCard
                  product={product}
                  fourthwallCheckoutDomain={checkoutDomain}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
