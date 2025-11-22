"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    FourthwallProduct,
    getAllFourthwallProducts,
} from "@/lib/fourthwall";
import { GumroadProduct } from "@/lib/gumroad";
import { LemonSqueezyProduct } from "@/lib/lemonsqueezy";
import { PatreonTier } from "@/lib/patreon";
import { UnifiedProduct } from "@/types/shop";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "./product-card";

gsap.registerPlugin(ScrollTrigger);

// --- Types ---
type AltProduct = GumroadProduct | LemonSqueezyProduct | PatreonTier;

interface UnifiedShopSectionProps {
    digitalProducts: AltProduct[];
}

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
                We couldn't find any products. Please check back later!
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

// --- Mapping Functions ---

function mapFourthwallToUnified(product: FourthwallProduct): UnifiedProduct {
    const variant = product.variants?.[0];
    const priceValue =
        variant?.unitPrice && typeof variant.unitPrice === "object"
            ? variant.unitPrice.value
            : 0;
    const currency =
        variant?.unitPrice && typeof variant.unitPrice === "object"
            ? variant.unitPrice.currency
            : "USD";

    return {
        id: product.id,
        name: product.name,
        description: product.description || "",
        image: product.images?.[0]?.url || null,
        price: priceValue,
        currency: currency,
        formattedPrice: `$${priceValue.toFixed(2)}`,
        slug: product.slug || product.name.toLowerCase().replace(/ /g, "-"),
        isExternal: false,
        type: "fourthwall",
        available:
            (product.variants?.length ?? 0) > 0 &&
            (product.variants?.some(v => v.unitPrice) ?? false),
    };
}

function mapGumroadToUnified(product: GumroadProduct): UnifiedProduct {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.preview_url,
        price: product.price / 100,
        currency: product.currency,
        formattedPrice: product.formatted_price,
        externalUrl: product.short_url || product.url,
        isExternal: true,
        type: "gumroad",
        available: true, // Assume available if returned
    };
}

function mapLemonSqueezyToUnified(
    product: LemonSqueezyProduct
): UnifiedProduct {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.large_thumb_url || product.thumb_url,
        price: 0, // Price not easily available as number in this flat object without parsing
        currency: "USD", // Defaulting
        formattedPrice: product.price_formatted,
        externalUrl: product.buy_now_url,
        isExternal: true,
        type: "lemonsqueezy",
        available: true,
    };
}

function mapPatreonToUnified(tier: PatreonTier): UnifiedProduct {
    const price = tier.attributes.amount_cents / 100;
    return {
        id: tier.id,
        name: tier.attributes.title,
        description: tier.attributes.description,
        image: tier.attributes.image_url,
        price: price,
        currency: "USD",
        formattedPrice: `$${price.toFixed(2)}/mo`,
        externalUrl:
            process.env.NEXT_PUBLIC_PATREON_CREATOR_URL ||
            "https://www.patreon.com",
        isExternal: true,
        type: "patreon",
        available: true,
    };
}

// --- Main Component ---

export default function UnifiedShopSection({
    digitalProducts,
}: UnifiedShopSectionProps) {
    const [products, setProducts] = useState<UnifiedProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch Fourthwall products
            const fwProducts = await getAllFourthwallProducts();
            const mappedFwProducts = fwProducts.map(mapFourthwallToUnified);

            // Map Digital Products
            const mappedDigitalProducts = digitalProducts.map(p => {
                if ("preview_url" in p) return mapGumroadToUnified(p as GumroadProduct);
                if ("buy_now_url" in p)
                    return mapLemonSqueezyToUnified(p as LemonSqueezyProduct);
                if ("type" in p && p.type === "tier")
                    return mapPatreonToUnified(p as PatreonTier);
                return null;
            }).filter((p): p is UnifiedProduct => p !== null);

            // Combine and Sort (optional, maybe by name or price?)
            // For now, Merch first, then Digital
            setProducts([...mappedFwProducts, ...mappedDigitalProducts]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load products");
        } finally {
            setLoading(false);
        }
    }, [digitalProducts]);

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
        <section ref={containerRef} className="w-full py-16"> {/* Added padding here */}
            <div className="mx-auto w-full max-w-7xl px-4">
                <h2 className="mb-16 text-center font-pixel text-4xl uppercase tracking-widest text-primary drop-shadow-[4px_4px_0_rgba(255,255,255,0.2)] md:text-6xl">
                    Shop
                </h2>

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
                        className="grid grid-cols-1 place-items-center gap-12 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {products.map(product => (
                            <div
                                key={`${product.type}-${product.id}`}
                                className="flex transform justify-center transition-transform duration-300 hover:scale-105"
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
