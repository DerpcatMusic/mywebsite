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
    <section className="py-16 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center mb-12 text-purple-400">
          Official Merchandise
        </h2>
        {products.length === 0 ? (
          <p className="text-center text-xl text-gray-400">
            No products found. Please check your Fourthwall configuration and API token.
          </p>
        ) : (
          <>
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto pb-4 gap-8"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
              }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  fourthwallCheckoutDomain={FOURTHWALL_CHECKOUT_DOMAIN}
                  className="flex-shrink-0"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}