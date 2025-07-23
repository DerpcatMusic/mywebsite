// components/digital-products/alt-product-card.tsx
"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

import { GumroadProduct } from "../../lib/gumroad";
import {
  LemonSqueezyProduct,
  getLemonSqueezyProductImage,
  getLemonSqueezyProductPrice,
  getLemonSqueezyProductDescription,
} from "../../lib/lemonsqueezy";
import {
  PatreonTier,
  getPatreonTierImage,
  getPatreonTierPrice,
  getPatreonTierDescription,
  getPatreonTierUrl,
} from "../../lib/patreon";

type AltProduct = GumroadProduct | LemonSqueezyProduct | PatreonTier;

interface AltProductCardProps {
  product: AltProduct;
  className?: string;
}

const PLACEHOLDER_IMAGE_URL =
  "https://via.placeholder.com/288x288/1a1a1a/f97316?text=No+Image"; // Orange background

function createSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AltProductCard({
  product,
  className,
}: AltProductCardProps) {
  const transformRef = useRef<HTMLDivElement>(null);

  const isGumroadProduct = (p: AltProduct): p is GumroadProduct =>
    "preview_url" in p;
  const isLemonSqueezyProduct = (p: AltProduct): p is LemonSqueezyProduct =>
    "buy_now_url" in p && "price_formatted" in p;
  const isPatreonTier = (p: AltProduct): p is PatreonTier =>
    "attributes" in p &&
    typeof (p as any).attributes === "object" &&
    "amount_cents" in (p as any).attributes;

  let name: string;
  let description: string;
  let price: string;
  let url: string | null;
  let imageUrl: string | null;
  let buttonText: string;
  let hasVariants: boolean = false;
  let isAvailable: boolean = true;

  if (isGumroadProduct(product)) {
    name = product.name;
    description = product.description;
    price = product.formatted_price;
    url = product.short_url;
    imageUrl = product.preview_url || null;
    buttonText = "View Product";
  } else if (isLemonSqueezyProduct(product)) {
    name = product.name;
    description = getLemonSqueezyProductDescription(product);
    price = getLemonSqueezyProductPrice(product);
    url = product.buy_now_url || null;
    imageUrl = getLemonSqueezyProductImage(product);
    buttonText = "View Product";
    hasVariants = false; // Simplified since flattened interface doesn't have variants info
    isAvailable = true; // Simplified since flattened interface doesn't have status info
  } else if (isPatreonTier(product)) {
    name = product.attributes.title;
    description = getPatreonTierDescription(product);
    price = getPatreonTierPrice(product);
    url = getPatreonTierUrl(product);
    imageUrl = getPatreonTierImage(product);
    buttonText = "View Tier";
  } else {
    name = "Unknown Product";
    description = "No description available.";
    price = "N/A";
    url = null;
    imageUrl = null;
    buttonText = "Unavailable";
    isAvailable = false;
  }

  const finalImageUrl = imageUrl || PLACEHOLDER_IMAGE_URL;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = transformRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    const ty = ((y - h / 2) / 25) * -1;
    const tx = (x - w / 2) / 20;

    el.style.setProperty("--tx", `${tx}deg`);
    el.style.setProperty("--ty", `${ty}deg`);
  };

  const handleMouseLeave = () => {
    const el = transformRef.current;
    if (!el) return;
    el.style.setProperty("--tx", "0deg");
    el.style.setProperty("--ty", "0deg");
  };

  return (
    <>
      <style jsx>{`
        /* 1. Layout Wrapper: Consistent fixed dimensions */
        .card-layout-wrapper {
          width: 18rem;
          height: 32rem;
          perspective: 1000px;
          flex-shrink: 0;
        }

        /* 2. Transform Wrapper: Handles ONLY 3D rotation */
        .card-transform-wrapper {
          --tx: 0deg;
          --ty: 0deg;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform: rotateX(var(--ty)) rotateY(var(--tx));
          transition: transform 0.1s ease;
        }

        /* 3. Visual Wrapper: Handles scaling and visual effects */
        .card-visual-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          transform: scale(1);
          transition: transform 0.2s ease-out;
          will-change: transform;
          border-radius: 0.75rem;
          overflow: hidden;
        }

        .card-layout-wrapper:hover .card-visual-wrapper {
          transform: scale(1.05);
          transition: transform 0.1s ease-in;
        }

        /* NEW: Fast Moving Lines Effect */
        .card-visual-wrapper::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          mix-blend-mode: color-dodge; /* Keep for glow */
          transition:
            opacity 0.4s ease-in-out,
            filter 0.4s ease-in-out;

          /* Fast moving diagonal lines */
          background: repeating-linear-gradient(
            -45deg,
            /* Angle for diagonal lines */ rgba(255, 255, 255, 0.08),
            /* Light white line (more visible) */ rgba(255, 255, 255, 0.08) 2px,
            /* Line thickness */ transparent 2px,
            transparent 15px /* Spacing between lines */
          );
          background-size: 30px 30px; /* Control density and movement distance */
          animation: moveAnimeLines 0.7s linear infinite; /* Faster movement */

          opacity: 0.2; /* Initial subtle opacity */
          filter: brightness(0.9) contrast(1.3);
        }

        /* Keyframes for the anime line movement */
        @keyframes moveAnimeLines {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 30px 30px;
          } /* Move by one background-size unit */
        }

        /* Enhanced glow and visibility for lines on hover */
        .card-layout-wrapper:hover .card-visual-wrapper::after {
          opacity: 0.8; /* Make lines much more visible on hover */
          filter: brightness(2.2) contrast(2.8); /* Enhanced glow on hover */
        }

        /* Gradient overlay for better text readability - Orange theme */
        .card-visual-wrapper::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            135deg,
            rgba(249, 115, 22, 0.1) 0%,
            /* Orange 500 */ rgba(251, 191, 36, 0.05) 25%,
            /* Amber 300 for a slightly different tone */ transparent 50%,
            rgba(249, 115, 22, 0.15) 100% /* Orange 500 */
          );
          border-radius: 0.75rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card-layout-wrapper:hover .card-visual-wrapper::before {
          opacity: 1;
        }

        /* Card background and border - Orange theme */
        .card-ui-content {
          position: relative;
          z-index: 3;
          width: 100%;
          height: 100%;
          border-radius: 0.75rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: linear-gradient(
            135deg,
            rgba(194, 65, 12, 0.15) 0%,
            /* Darker Orange (Orange 700) */ rgba(17, 24, 39, 0.8) 100%
          );
          border: 2px solid rgba(249, 115, 22, 0.3); /* Orange 500 border */
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        /* Fixed image container */
        .image-container {
          position: relative;
          width: 100%;
          height: 14rem;
          flex-shrink: 0;
          overflow: hidden;
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
        }

        /* Content area with consistent spacing */
        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1rem;
          min-height: 0;
        }

        /* Title with consistent height */
        .product-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: white;
          height: 3.2rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.25;
        }

        /* Description with flexible height */
        .product-description {
          font-size: 0.875rem;
          color: rgb(209, 213, 219);
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
          margin-bottom: 1rem;
        }

        /* Footer with consistent height */
        .card-footer {
          flex-shrink: 0;
          display: flex;
          justify-content: space-between;
          align-items: end;
          padding: 0 1rem 1rem;
          min-height: 5rem;
        }

        /* Price section */
        .price-section {
          display: flex;
          flex-direction: column;
        }

        .price-display {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .price-label {
          font-size: 0.75rem;
          color: rgb(156, 163, 175);
          margin-top: -0.25rem;
        }

        .stock-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .stock-dot {
          width: 0.625rem;
          height: 0.625rem;
          border-radius: 50%;
        }

        .stock-text {
          font-size: 0.75rem;
          font-weight: 500;
        }

        /* Button styling - Orange theme */
        .button-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: end;
        }

        .view-details-btn {
          background: linear-gradient(
            135deg,
            #f97316 0%,
            #ea580c 100%
          ); /* Orange 500 to Orange 600 */
          color: white;
          font-weight: 600;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px 0 rgba(249, 115, 22, 0.3); /* Orange 500 shadow */
        }

        .view-details-btn:hover {
          background: linear-gradient(
            135deg,
            #ea580c 0%,
            #c2410c 100%
          ); /* Orange 600 to Orange 700 */
          transform: translateY(-1px);
          box-shadow: 0 6px 20px 0 rgba(249, 115, 22, 0.4); /* Orange 500 shadow */
        }

        /* Quick Buy style button (optional, kept for flexibility if you want a second button) */
        .quick-buy-btn {
          background: rgba(
            249,
            115,
            22,
            0.1
          ); /* Orange 500 subtle background */
          border: 1px solid rgba(249, 115, 22, 0.3); /* Orange 500 border */
          color: rgb(
            253,
            230,
            138
          ); /* Yellow 200 for text, provides good contrast */
          font-size: 0.75rem;
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
        }

        .quick-buy-btn:hover {
          background: rgba(
            249,
            115,
            22,
            0.2
          ); /* Orange 500 slightly more opaque */
          border-color: rgba(249, 115, 22, 0.5); /* Orange 500 border */
          transform: translateY(-1px);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .card-layout-wrapper {
            width: 16rem;
            height: 28rem;
          }

          .image-container {
            height: 12rem;
          }
        }
      `}</style>

      <div
        className={`card-layout-wrapper ${className || ""}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={transformRef} className="card-transform-wrapper">
          <div className="card-visual-wrapper">
            <div className="card-ui-content">
              {/* Fixed height image container */}
              <div className="image-container">
                <Image
                  src={finalImageUrl}
                  alt={name}
                  sizes="(max-width: 768px) 16rem, 18rem"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>

              {/* Content area with consistent layout */}
              <div className="content-area">
                <h3 className="product-title">{name}</h3>

                <div
                  className="product-description"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>

              {/* Fixed footer */}
              <div className="card-footer">
                <div className="price-section">
                  <span className="price-display">{price}</span>
                  {hasVariants && (
                    <span className="price-label">Starting from</span>
                  )}
                  <div className="stock-indicator">
                    <span
                      className={`stock-dot ${isAvailable ? "bg-green-400" : "bg-gray-500"}`}
                    />
                    <span
                      className={`stock-text ${isAvailable ? "text-green-300" : "text-gray-400"}`}
                    >
                      {isAvailable ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>

                <div className="button-group">
                  {url ? (
                    <>
                      <Link
                        href={url}
                        passHref
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="view-details-btn">
                          {buttonText}
                        </button>
                      </Link>
                      {/* Uncomment if you want a second "quick buy" style button for AltProductCard */}
                      {/* {url && (
                        <button
                          className="quick-buy-btn"
                          onClick={() => window.open(url, '_blank')}
                        >
                          <ExternalLink className="inline w-3 h-3 mr-1" />
                          Quick Link
                        </button>
                      )} */}
                    </>
                  ) : (
                    <Button disabled className="bg-gray-500 cursor-not-allowed">
                      Link Missing
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
