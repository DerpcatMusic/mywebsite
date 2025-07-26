// components/product-card.tsx
"use client";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { useBrand } from "../hooks/use-brand";
import { generateBrandCSS } from "../lib/brand";
import {
    FourthwallProduct,
    getProductDescription,
    getProductImage,
    getProductPrice,
} from "../lib/fourthwall";

interface ProductCardProps {
  product: FourthwallProduct;
  fourthwallCheckoutDomain: string | undefined;
}

const PLACEHOLDER_IMAGE_URL =
  "https://via.placeholder.com/288x288/1a1a1a/6b46c1?text=No+Image";

function createSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductCard({
  product,
  fourthwallCheckoutDomain,
}: ProductCardProps) {
  const transformRef = useRef<HTMLDivElement>(null);
  const { brandData } = useBrand("fourthwall");

  const imageUrl = getProductImage(product) || PLACEHOLDER_IMAGE_URL;
  const priceDisplay = getProductPrice(product);
  const description = getProductDescription(product);
  const productSlug = product.slug || createSlugFromName(product.name);
  const productUrl = `/products/${productSlug}`;
  const hasVariants = product.variants && product.variants.length > 0;
  const isAvailable =
    hasVariants && product.variants.some(variant => variant.unitPrice);

  // Use fallback colors if brand data is not available
  const fallbackColors = {
    primary: "#9333ea",
    secondary: "#7c3aed",
    accent: "#8b5cf6",
  };

  const useBrandData = brandData || {
    colors: fallbackColors,
    logo: null,
    title: "Fourthwall",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = transformRef.current;
    if (!el) {
      return;
    }
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
    if (!el) {
      return;
    }
    el.style.setProperty("--tx", "0deg");
    el.style.setProperty("--ty", "0deg");
  };

  return (
    <>
      <style jsx>{`
        .card-wrapper {
          width: 18rem;
          height: 32rem;
          perspective: 1000px;
          flex-shrink: 0;
          opacity: 1;
          padding: 4px;
          border-radius: 14px;
          ${generateBrandCSS(useBrandData)}
          background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%);
        }

        .card-transform {
          --tx: 0deg;
          --ty: 0deg;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform: rotateX(var(--ty)) rotateY(var(--tx));
          transition: transform 0.1s ease;
        }

        .card-visual {
          position: relative;
          width: 100%;
          height: 100%;
          transform: scale(1);
          transition: transform 0.2s ease-out;
          border-radius: 12px;
          overflow: hidden;
        }

        .card-wrapper:hover .card-visual {
          transform: scale(1.05);
          transition: transform 0.1s ease-in;
        }

        .sparkles-layer {
          position: absolute;
          inset: 0;
          z-index: 2;
          filter: contrast:(1.5)
          pointer-events: none;
          background-image: url("https://assets.codepen.io/13471/sparkles.gif");
          background-position: 50% 50%;
          background-size: 180%;
          border-radius: 0.75rem;
          opacity: 0.4;
          transition: opacity 0.4s ease-in-out;
        }

        .card-wrapper:hover .sparkles-layer {
          opacity: 1;
        }

        .gradient-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            135deg,
            rgba(var(--brand-accent-rgb), 0.05) 0%,
            transparent 50%,
            rgba(var(--brand-primary-rgb), 0.08) 100%
          );
          border-radius: 0.75rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card-wrapper:hover .gradient-overlay {
          opacity: 1;
        }

        .card-content {
          position: relative;
          z-index: 3;
          width: 100%;
          height: 100%;
          border-radius: 0.75rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: color-mix(in srgb, var(--brand-primary) 8%, #1a1a1a 92%);
          border: none;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 4px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 14rem;
          flex-shrink: 0;
          overflow: hidden;
          background: color-mix(in srgb, var(--brand-primary) 12%, #0f0f0f 88%);
          z-index: 4;
        }

        .brand-logo {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          width: 2.5rem;
          height: 2.5rem;
          z-index: 5;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(8px);
          border-radius: 0.5rem;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--brand-primary);
        }

        .brand-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: brightness(1.1);
        }

        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1rem;
          min-height: 0;
          z-index: 4;
        }

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

        .product-description {
          font-size: 0.875rem;
          color: rgb(209, 213, 219);
          flex: 1;
          line-height: 1.4;
          margin-bottom: 1rem;
          position: relative;
          max-height: 4.2rem;
          overflow: hidden;
          cursor: default;
          transition: max-height 0.3s ease;
          -webkit-mask-image: linear-gradient(
            to bottom,
            black 60%,
            transparent 100%
          );
          mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
        }

        .product-description:hover {
          max-height: 8rem;
          overflow-y: auto;
          -webkit-mask-image: none;
          mask-image: none;
        }

        .description-content {
          transition: all 0.3s ease;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-description:hover .description-content {
          display: block;
          -webkit-line-clamp: none;
          overflow: visible;
        }

        .product-description::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }

        .product-description:hover::-webkit-scrollbar {
          width: 4px;
        }

        .product-description:hover::-webkit-scrollbar-track {
          background: rgba(147, 51, 234, 0.1);
          border-radius: 2px;
        }

        .product-description:hover::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 2px;
        }

        .product-description:hover::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }

        .card-footer {
          flex-shrink: 0;
          display: flex;
          justify-content: space-between;
          align-items: end;
          padding: 0 1rem 1rem;
          min-height: 5rem;
          z-index: 4;
        }

        .price-section {
          display: flex;
          flex-direction: column;
        }

        .price-display {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          letter-spacing: -0.025em;
          font-feature-settings: "kern" 1;
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

        .button-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: end;
        }

        .view-details-btn {
          background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%);
          color: white;
          font-weight: 700;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px 0 rgba(var(--brand-primary-rgb), 0.4);
          letter-spacing: -0.025em;
        }

        .view-details-btn:hover {
          background: linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-accent) 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px 0 rgba(var(--brand-primary-rgb), 0.6);
        }

        .quick-buy-btn {
          background: rgba(var(--brand-primary-rgb), 0.15);
          border: 2px solid var(--brand-secondary);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          gap: 0.25rem;
          letter-spacing: -0.025em;
        }

        .quick-buy-btn:hover {
          background: rgba(var(--brand-primary-rgb), 0.25);
          border-color: var(--brand-primary);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .card-wrapper {
            width: 16rem;
            height: 24rem; /* Reduced height for mobile */
          }

          .image-container {
            height: 10rem; /* Reduced image container height for mobile */
          }

          .product-description {
            display: none; /* Hide the description for mobile view */
          }

          .content-area {
            padding-bottom: 0.5rem; /* Adjust padding after removing description */
          }

          .card-footer {
            padding-top: 0; /* Remove top padding for footer as description is gone */
            min-height: auto; /* Allow footer to shrink */
          }
        }
      `}</style>

      <div
        className="card-wrapper"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={transformRef} className="card-transform">
          <div className="card-visual">
            <div className="sparkles-layer" />
            <div className="gradient-overlay" />

            <div className="card-content">
              <div className="image-container">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  sizes="(max-width: 768px) 16rem, 18rem"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
                {useBrandData.logo && (
                  <div className="brand-logo">
                    <Image
                      src={useBrandData.logo}
                      alt="Fourthwall"
                      width={24}
                      height={24}
                      className="h-6 w-6"
                    />
                  </div>
                )}
              </div>

              <div className="content-area">
                <h3 className="product-title font-title">{product.name}</h3>

                {/* The product-description div will be hidden by CSS on mobile */}
                <div className="product-description">
                  <div
                    className="description-content"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </div>
              </div>

              <div className="card-footer">
                <div className="price-section">
                  <span className="price-display font-title">{priceDisplay}</span>
                  {hasVariants && product.variants.length > 1 && (
                    <span className="price-label font-body">Starting from</span>
                  )}
                  <div className="stock-indicator">
                    <span
                      className={`stock-dot ${isAvailable ? "bg-green-400" : "bg-gray-500"}`}
                    />
                    <span
                      className={`stock-text font-body ${isAvailable ? "text-green-300" : "text-gray-400"}`}
                    >
                      {isAvailable ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>

                <div className="button-group">
                  <Link href={productUrl} passHref>
                    <button className="view-details-btn font-body">View Details</button>
                  </Link>
                  {fourthwallCheckoutDomain && (
                    <button
                      className="quick-buy-btn font-body"
                      onClick={() =>
                        window.open(
                          `https://${fourthwallCheckoutDomain}/products/${productSlug}`,
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink className="h-3 w-3" />
                      Quick Buy
                    </button>
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
