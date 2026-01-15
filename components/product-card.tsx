// components/product-card.tsx
"use client";
import { FourthwallProduct } from "@/lib/fourthwall";
import { UnifiedProduct } from "@/types/shop";
import Image from "next/image";
import { useState } from "react";
import ProductModal from "./ProductModal";

interface ProductCardProps {
  product: UnifiedProduct;
  rawProduct?: FourthwallProduct; // For Fourthwall products with variants
}

const PLACEHOLDER_IMAGE_URL =
  "https://via.placeholder.com/288x288/1a1a1a/6b46c1?text=No+Image";

export default function ProductCard({ product, rawProduct }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageUrl = product.image || PLACEHOLDER_IMAGE_URL;

  // Handler for internal products (Fourthwall) to open modal
  const handleInternalClick = () => {
    if (!product.isExternal) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div
        className="glass-card group relative block aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-[3rem] transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
        onClick={handleInternalClick}
      >
        {/* External Link Overlay */}
        {product.isExternal && (
          <a
            href={product.externalUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-20"
            aria-label={`View ${product.name}`}
          />
        )}

        {/* Glow effect on hover */}
        <div className="absolute inset-0 -z-10 rounded-full bg-primary/5 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />

        {/* Image */}
        <div className="relative h-full w-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 md:p-10">
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
              Collection Item
            </span>
            <div className="flex items-end justify-between">
              <h3 className="font-pixel max-w-[80%] text-3xl font-normal leading-[1.1] text-white">
                {product.name}
              </h3>
              <div className="flex flex-col items-end">
                <span className="font-sans text-sm font-medium text-white/90">
                  {product.formattedPrice}
                </span>
              </div>
            </div>
          </div>
          {/* Subtle indicator */}
          <div className="mt-6 flex h-0 items-center gap-2 overflow-hidden transition-all duration-500 group-hover:h-5">
            <div className="h-px w-8 bg-white/20" />
            <span className="font-sans text-[10px] font-medium uppercase tracking-widest text-white/60">
              {product.isExternal ? "View Details" : "Quick Shop"}
            </span>
          </div>
        </div>
      </div>

      {/* Product Modal for Fourthwall products */}
      {!product.isExternal && rawProduct && (
        <ProductModal
          product={rawProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
