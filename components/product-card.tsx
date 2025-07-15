// components/product-card.tsx
'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import {
  FourthwallProduct,
  getProductImage,
  getProductPrice,
  getProductDescription
} from '../lib/fourthwall';

interface ProductCardProps {
  product: FourthwallProduct;
  fourthwallCheckoutDomain: string | undefined;
}

const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/288x288/1a1a1a/6b46c1?text=No+Image';

function createSlugFromName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function ProductCard({ product, fourthwallCheckoutDomain }: ProductCardProps) {
  const transformRef = useRef<HTMLDivElement>(null);

  const imageUrl = getProductImage(product) || PLACEHOLDER_IMAGE_URL;
  const priceDisplay = getProductPrice(product);
  const description = getProductDescription(product);
  const productSlug = product.slug || createSlugFromName(product.name);
  const productUrl = `/products/${productSlug}`;
  const hasVariants = product.variants && product.variants.length > 0;
  const isAvailable = hasVariants && product.variants.some(variant => variant.unitPrice);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = transformRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;
    
    const ty = (y - h / 2) / 25 * -1;
    const tx = (x - w / 2) / 20;

    el.style.setProperty('--tx', `${tx}deg`);
    el.style.setProperty('--ty', `${ty}deg`);
  };

  const handleMouseLeave = () => {
    const el = transformRef.current;
    if (!el) return;
    el.style.setProperty('--tx', '0deg');
    el.style.setProperty('--ty', '0deg');
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
          --tx: 0deg; --ty: 0deg;
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
        
        .card-visual-wrapper::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          mix-blend-mode: color-dodge;
          transition: opacity .4s ease-in-out, filter .4s ease-in-out;
          
          background-image: url("https://assets.codepen.io/13471/sparkles.gif");
          background-position: 50% 50%;
          background-size: 180%;

          opacity: 0.2;
          filter: brightness(0.9) contrast(1.3);
        }

        /* 
          MODIFICATION: Reduced the glow effect on hover.
          - Lowered opacity from 1 to 0.6
          - Reduced brightness from 2.5 to 1.6
          - Reduced contrast from 3 to 1.8
          This creates a more subtle and less overwhelming "glow".
        */
        .card-layout-wrapper:hover .card-visual-wrapper::after {
          opacity: 0.6;
          filter: brightness(1.6) contrast(1.8);
        }

        /* Gradient overlay for better text readability */
        .card-visual-wrapper::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            135deg,
            rgba(147, 51, 234, 0.1) 0%,
            rgba(79, 70, 229, 0.05) 25%,
            transparent 50%,
            rgba(147, 51, 234, 0.15) 100%
          );
          border-radius: 0.75rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card-layout-wrapper:hover .card-visual-wrapper::before {
          opacity: 1;
        }

        .card-ui-content {
          position: relative;
          z-index: 3;
          width: 100%;
          height: 100%;
          border-radius: 0.75rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, 
            rgba(88, 28, 135, 0.15) 0%, 
            rgba(17, 24, 39, 0.8) 100%
          );
          border: 2px solid rgba(147, 51, 234, 0.3);
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
          font-size: 1.25rem; /* 20px */
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

        /* Button styling */
        .button-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: end;
        }

        .view-details-btn {
          background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
          color: white;
          font-weight: 600;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px 0 rgba(147, 51, 234, 0.3);
        }

        .view-details-btn:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px 0 rgba(147, 51, 234, 0.4);
        }

        .quick-buy-btn {
          background: rgba(147, 51, 234, 0.1);
          border: 1px solid rgba(147, 51, 234, 0.3);
          color: rgb(196, 181, 253);
          font-size: 0.75rem;
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
        }

        .quick-buy-btn:hover {
          background: rgba(147, 51, 234, 0.2);
          border-color: rgba(147, 51, 234, 0.5);
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
        className="card-layout-wrapper"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={transformRef} className="card-transform-wrapper">
          <div className="card-visual-wrapper">
            <div className="card-ui-content">
              {/* Fixed height image container */}
              <div className="image-container">
                <Image 
                  src={imageUrl} 
                  alt={product.name} 
                  sizes="(max-width: 768px) 16rem, 18rem"
                  fill 
                  style={{ objectFit: 'cover' }} 
                  priority 
                />
              </div>

              {/* Content area with consistent layout */}
              <div className="content-area">
                <h3 className="product-title">
                  {product.name}
                </h3>
                
                <div 
                  className="product-description" 
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>

              {/* Fixed footer */}
              <div className="card-footer">
                <div className="price-section">
                  <span className="price-display">{priceDisplay}</span>
                  {hasVariants && product.variants.length > 1 && (
                    <span className="price-label">Starting from</span>
                  )}
                  <div className="stock-indicator">
                    <span className={`stock-dot ${isAvailable ? 'bg-green-400' : 'bg-gray-500'}`} />
                    <span className={`stock-text ${isAvailable ? 'text-green-300' : 'text-gray-400'}`}>
                      {isAvailable ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                
                <div className="button-group">
                  <Link href={productUrl} passHref>
                    <button className="view-details-btn">
                      View Details
                    </button>
                  </Link>
                  {fourthwallCheckoutDomain && (
                    <button 
                      className="quick-buy-btn"
                      onClick={() => window.open(`https://${fourthwallCheckoutDomain}/products/${productSlug}`, '_blank')}
                    >
                      <ExternalLink className="inline w-3 h-3 mr-1" /> 
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