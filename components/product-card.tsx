// components/product-card.tsx - Final version
'use client';
import React from 'react';
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
  className?: string;
}

const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/288x288/1a1a1a/6b46c1?text=No+Image';

// Helper function to create a slug from product name
function createSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function ProductCard({ product, fourthwallCheckoutDomain, className }: ProductCardProps) {
  const imageUrl = getProductImage(product) || PLACEHOLDER_IMAGE_URL;
  const priceDisplay = getProductPrice(product);
  const description = getProductDescription(product);
  
  // Create a reliable slug - use the product's slug or generate one from the name
  const productSlug = product.slug || createSlugFromName(product.name);
  const productUrl = `/products/${productSlug}`;
  
  // Check if product has variants and is available
  const hasVariants = product.variants && product.variants.length > 0;
  const isAvailable = hasVariants && product.variants.some(variant => variant.unitPrice);

  return (
    <Card
      className={`
        flex flex-col
        bg-secondary/20 border-secondary/30
        hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10
        transition-all duration-300
        w-72 h-full
        flex-shrink-0
        group
        ${className || ''}
      `}
    >
      <CardHeader className="p-0">
        <div className="relative w-full h-56 overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl}
            alt={product.name}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            style={{ objectFit: 'cover' }}
            className="group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-xl font-bold mb-2 text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
          {product.name}
        </CardTitle>
        
        <CardDescription
          className="text-sm text-gray-400 line-clamp-3 prose dark:prose-invert prose-sm"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        
        {/* Variants preview */}
        {hasVariants && product.variants.length > 1 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">
              {product.variants.length} variant{product.variants.length > 1 ? 's' : ''} available
            </p>
            <div className="flex flex-wrap gap-1 max-h-8 overflow-hidden">
              {product.variants.slice(0, 3).map((variant) => (
                <Badge 
                  key={variant.id}
                  variant="outline"
                  className="text-xs px-2 py-0 border-purple-500/30 text-purple-300"
                >
                  {variant.name}
                </Badge>
              ))}
              {product.variants.length > 3 && (
                <Badge 
                  variant="outline"
                  className="text-xs px-2 py-0 border-purple-500/30 text-purple-300"
                >
                  +{product.variants.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-start p-4 pt-0">
        {/* Left side: Price and Stock */}
        <div className="flex flex-col">
          <span className="text-2xl font-extrabold text-white">
            {priceDisplay}
          </span>
          {hasVariants && product.variants.length > 1 && (
            <span className="text-xs text-gray-500 -mt-1">
              Starting from
            </span>
          )}
          {/* Stock Status Indicator */}
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`
                w-2.5 h-2.5 rounded-full
                ${isAvailable ? 'bg-green-500' : 'bg-gray-500'}
              `}
            />
            <span
              className={`
                text-xs font-medium
                ${isAvailable ? 'text-green-400' : 'text-gray-400'}
              `}
            >
              {isAvailable ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
        
        {/* Right side: Buttons */}
        <div className="flex flex-col gap-2">
          <Link href={productUrl} passHref>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              size="sm"
            >
              View Details
            </Button>
          </Link>
          
          {/* Quick buy button for external link - CORRECTED URL */}
          {fourthwallCheckoutDomain && (
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-600/10 text-xs"
              onClick={() => window.open(`https://${fourthwallCheckoutDomain}/products/${productSlug}`, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Quick Buy
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}