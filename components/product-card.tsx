// components/product-card.tsx
"use client";
import Image from "next/image";
import Link from "next/link";

import { FourthwallProduct } from "@/lib/fourthwall";
import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
  product: FourthwallProduct;
  fourthwallCheckoutDomain?: string;
}

const PLACEHOLDER_IMAGE_URL =
  "https://via.placeholder.com/288x288/1a1a1a/6b46c1?text=No+Image";

function createSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getProductImage(product: FourthwallProduct): string | null {
  return product.images?.[0]?.url || null;
}

function getProductPriceValue(product: FourthwallProduct): number {
  const variant = product.variants?.[0];
  if (!variant || !variant.unitPrice) {
    return 0;
  }
  const price = variant.unitPrice;
  if (typeof price === "number") {
    return price;
  }
  if (typeof price === "object" && "value" in price) {
    return (price as any).value;
  }
  return 0;
}

function getProductPrice(product: FourthwallProduct): string {
  const price = getProductPriceValue(product);
  return `$${price.toFixed(2)}`;
}

function getProductDescription(product: FourthwallProduct): string {
  return product.description || "";
}

export default function ProductCard({
  product,
  fourthwallCheckoutDomain,
}: ProductCardProps) {
  const imageUrl = getProductImage(product) || PLACEHOLDER_IMAGE_URL;
  const priceDisplay = getProductPrice(product);
  const description = getProductDescription(product);
  const productSlug = product.slug || createSlugFromName(product.name);
  const productUrl = `/products/${productSlug}`;
  const hasVariants = product.variants && product.variants.length > 0;
  const isAvailable =
    hasVariants && product.variants.some(variant => variant.unitPrice);

  return (
    <div className="pixel-card group relative flex h-[34rem] w-72 flex-col overflow-hidden bg-card transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]">
      {/* Marching Ants Border (Visible on Hover) */}
      <div className="marching-ants pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100" />

      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden border-b-2 border-white/20 bg-black">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:rotate-3 group-hover:scale-125"
        />
        {/* Glitch/Holo Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent opacity-0 mix-blend-color-dodge transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transform bg-primary transition-transform duration-300 group-hover:scale-x-100" />
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col p-5">
        {/* Background Noise for Card Content */}
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-10" />

        <h3 className="relative z-10 mb-3 line-clamp-2 h-10 font-pixel text-sm leading-tight text-foreground transition-colors group-hover:text-primary">
          {product.name}
        </h3>

        <div className="relative z-10 mb-4 line-clamp-3 flex-1 font-terminal text-lg text-muted-foreground">
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="neon-text font-pixel text-xl text-primary">
              {priceDisplay}
            </span>
            <div className="flex items-center gap-2 rounded-none border border-white/10 bg-black/50 px-2 py-1">
              <div
                className={`h-2 w-2 ${isAvailable ? "bg-green-500 shadow-[0_0_5px_#22c55e]" : "bg-red-500 shadow-[0_0_5px_#ef4444]"} animate-pulse`}
              />
              <span className="font-pixel text-[10px] uppercase tracking-wider text-white">
                {isAvailable ? "In Stock" : "Sold Out"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link href={productUrl} passHref className="w-full">
              <button className="pixel-btn w-full py-2 text-[10px] transition-colors group-hover:bg-primary group-hover:text-white">
                Details
              </button>
            </Link>
            <AddToCartButton
              item={{
                id: product.id,
                name: product.name,
                price: getProductPriceValue(product),
                image: imageUrl,
                type: "product",
              }}
              className="pixel-btn w-full py-2 text-[10px]"
              variant="secondary"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
