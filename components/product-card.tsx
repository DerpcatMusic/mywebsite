// components/product-card.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Keep these for internal image carousel


interface Product {
  id: string;
  name: string;
  slug?: string;
  unitPrice?: {
    value?: number;
    currency?: string;
  };
  thumbnailImage?: { // Updated interface to match API response
    url: string;
    // Include other properties if needed, e.g., id, width, height, transformedUrl
  };
  attributes?: { // Attributes object itself can be optional
    description?: string;
  }
  // Removed the 'product' nesting for images
  // Removed the 'images' array if it's not used for display
}


interface ProductCardProps {
  product: Product;
  fourthwallCheckoutDomain: string | undefined;
  className?: string; // To allow passing snap-center class
}

const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/224x224?text=No+Image+Available';

export default function ProductCard({ product, fourthwallCheckoutDomain, className }: ProductCardProps) {

  // Log the entire product object to inspect its structure
  console.log("Product data received by ProductCard:", product);

  const imageUrl = product.thumbnailImage?.url || PLACEHOLDER_IMAGE_URL; // Use thumbnailImage URL
  const priceValue = product.unitPrice?.value?.toFixed(2) || '0.00';
  const priceCurrency = product.unitPrice?.currency || 'USD';
  const priceDisplay = product.unitPrice ? `${priceCurrency} ${priceValue}` : 'N/A';

  return (
    <Card
      key={product.id}
      className={`
        flex flex-col
        bg-secondary/20 border-secondary/30
        hover:border-purple-500 transition-all duration-300
        w-72 // Fixed width for all screen sizes (you can adjust this, e.g., w-64, w-80)
        flex-shrink-0 // Crucial: Prevents cards from shrinking in a flex container, forcing scroll
        ${className || ''} // Apply external className prop (e.g., flex-shrink-0)
      `}
    >
      <CardHeader className="p-0">
        <div className="relative w-full h-56 group">
          <Image
            src={imageUrl}
            alt={product.name}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
          />
          {/* Removed image carousel buttons */}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-xl font-bold mb-2 text-white">{product.name}</CardTitle>
        <CardDescription className="text-sm text-gray-400 line-clamp-3">
          {product.attributes?.description || 'No description available.'}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <span className="text-2xl font-extrabold text-white">
          {priceDisplay}
        </span>
        {fourthwallCheckoutDomain && product.slug ? (
          <Link href={`https://${fourthwallCheckoutDomain}/products/${product.slug}`} passHref target="_blank" rel="noopener noreferrer">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
              View Product
            </Button>
          </Link>
        ) : (
          <Button disabled className="bg-gray-500 cursor-not-allowed">
            Shop Link Missing
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}