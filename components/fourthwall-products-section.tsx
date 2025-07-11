// components/fourthwall-products-section.tsx
'use client'; // This component must be a Client Component

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getAllFourthwallProducts } from '@/lib/fourthwall';
import ProductCard from './product-card';

interface Product {
  id: string;
  name: string;
  slug?: string;
  unitPrice?: {
    value?: number;
    currency?: string;
  };
  product?: {
    images?: { url: string }[];
  };
  attributes?: {
    description?: string;
  }
}

const FOURTHWALL_CHECKOUT_DOMAIN = process.env.NEXT_PUBLIC_FW_CHECKOUT;

export default function FourthwallProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref for the scrollable container - This is specifically for the desktop horizontal scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Data fetching logic (remains the same)
  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetchedProducts = await getAllFourthwallProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError("Failed to load products.");
        console.error("Error fetching products in client component:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // --- Drag to Scroll Handlers (Re-added for Desktop View) ---
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    isDragging.current = true;
    scrollContainerRef.current.classList.add('active-dragging');
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isDragging.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.remove('active-dragging');
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.remove('active-dragging');
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);
  // --- End Drag to Scroll Handlers ---

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="container mx-auto px-4 text-center text-xl text-gray-400">Loading products...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="container mx-auto px-4 text-center text-xl text-red-400">{error}</div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Official Merchandise
        </h2>
        {products.length === 0 ? (
          <p className="text-center text-xl text-gray-400">
            No products found. Please check your Fourthwall configuration and API token.
          </p>
        ) : (
          <>
            {/* DESKTOP/LARGER SCREENS: Original Horizontal Scroll Layout */}
            {/* This div will be hidden on screens smaller than 'md' (e.g., mobile) */}
            <div
              ref={scrollContainerRef}
              className="hidden md:flex overflow-x-auto pb-4 gap-8 scrollbar-hide snap-x snap-mandatory cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={(e) => handleMouseDown(e as any as React.MouseEvent<HTMLDivElement>)}
              onTouchMove={(e) => handleMouseMove(e as any as React.MouseEvent<HTMLDivElement>)}
              onTouchEnd={handleMouseUp}
              onTouchCancel={handleMouseLeave}
              // --- Original FADE EFFECT ---
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              }}
              // --- END FADE EFFECT ---
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  fourthwallCheckoutDomain={FOURTHWALL_CHECKOUT_DOMAIN}
                  className="snap-center"
                />
              ))}
            </div>

            {/* MOBILE VIEW: 2x3 Grid Layout (or 6x1 if preferred as fallback) */}
            {/* This div will be hidden on screens 'md' and larger */}
            <div
              className="grid grid-cols-2 gap-4 md:hidden" // grid-cols-2 for 2 cards width, md:hidden ensures it only shows on small screens
            >
              {/* Only render the first 6 products for the 2x3 grid */}
              {products.slice(0, 6).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  fourthwallCheckoutDomain={FOURTHWALL_CHECKOUT_DOMAIN}
                  // No snap-center needed as it's a grid, not horizontally scrolling
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}