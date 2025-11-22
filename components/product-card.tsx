// components/product-card.tsx
"use client";
import Image from "next/image";
import Link from "next/link";

import { UnifiedProduct } from "@/types/shop";
import AddToCartButton from "./AddToCartButton";
import { Button } from "./ui/button";
import { ExternalLink, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: UnifiedProduct;
}

const PLACEHOLDER_IMAGE_URL =
  "https://via.placeholder.com/288x288/1a1a1a/6b46c1?text=No+Image";

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image || PLACEHOLDER_IMAGE_URL;
  const priceDisplay = product.formattedPrice;

  // Determine URLs
  const detailsUrl = product.isExternal
    ? (product.externalUrl || "#")
    : `/products/${product.slug}`;

  const buyUrl = product.externalUrl || "#";

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
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="neon-text font-pixel text-xl text-primary">
              {priceDisplay}
            </span>
            <div className="flex items-center gap-2 rounded-none border border-white/10 bg-black/50 px-2 py-1">
              <div
                className={`h-2 w-2 ${product.available ? "bg-green-500 shadow-[0_0_5px_#22c55e]" : "bg-red-500 shadow-[0_0_5px_#ef4444]"} animate-pulse`}
              />
              <span className="font-pixel text-[10px] uppercase tracking-wider text-white">
                {product.available ? "In Stock" : "Sold Out"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Details / View Button */}
            {product.isExternal ? (
              <a href={detailsUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <button className="pixel-btn w-full py-2 text-[10px] transition-colors group-hover:bg-primary group-hover:text-white">
                  View
                </button>
              </a>
            ) : (
              <Link href={detailsUrl} passHref className="w-full">
                <button className="pixel-btn w-full py-2 text-[10px] transition-colors group-hover:bg-primary group-hover:text-white">
                  Details
                </button>
              </Link>
            )}

            {/* Add to Cart / Buy Now Button */}
            {product.isExternal ? (
              <a href={buyUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button
                  variant="secondary"
                  size="sm"
                  className="pixel-btn w-full py-2 text-[10px]"
                >
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Buy Now
                </Button>
              </a>
            ) : (
              <AddToCartButton
                item={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: imageUrl || "",
                  type: "product",
                }}
                className="pixel-btn w-full py-2 text-[10px]"
                variant="secondary"
                size="sm"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
