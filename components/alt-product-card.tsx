// components/alt-product-card.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  GumroadProduct,
  getGumroadProductImage,
  getGumroadProductPrice,
  getGumroadProductDescription
} from '../lib/gumroad';
import {
  LemonSqueezyProduct,
  getLemonSqueezyProductImage,
  getLemonSqueezyProductPrice,
  getLemonSqueezyProductDescription
} from '../lib/lemonsqueezy';

// Define a union type for the product prop
type AltProduct = GumroadProduct | LemonSqueezyProduct;

interface AltProductCardProps {
  product: AltProduct;
  className?: string;
}

const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/224x224?text=No+Image+Available';

export default function AltProductCard({ product, className }: AltProductCardProps) {
  // Helper functions to get product details based on type
  const getImageUrl = (prod: AltProduct): string | null => {
    if ('preview_url' in prod) {
      return getGumroadProductImage(prod);
    } else if ('large_thumb_url' in prod) {
      return getLemonSqueezyProductImage(prod);
    }
    return null;
  };

  const getPriceDisplay = (prod: AltProduct): string => {
    if ('preview_url' in prod) {
      return getGumroadProductPrice(prod);
    } else if ('large_thumb_url' in prod) {
      return getLemonSqueezyProductPrice(prod);
    }
    return 'N/A';
  };

  const getDescription = (prod: AltProduct): string => {
    if ('preview_url' in prod) {
      return getGumroadProductDescription(prod);
    } else if ('large_thumb_url' in prod) {
      return getLemonSqueezyProductDescription(prod);
    }
    return '';
  };

  const getProductUrl = (prod: AltProduct): string | null => {
     if ('url' in prod) {
       return prod.url;
     }
     return null;
  };

  const imageUrl = getImageUrl(product) || PLACEHOLDER_IMAGE_URL;
  const priceDisplay = getPriceDisplay(product);
  const description = getDescription(product);
  const productUrl = getProductUrl(product);

  return (
    <Card
      key={product.id}
      className={`
        flex flex-col
        bg-orange-500/20 border-orange-500/30
        hover:border-yellow-500 transition-all duration-300
        w-72
        flex-shrink-0
        ${className || ''}
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
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-xl font-bold mb-2 text-white">{product.name}</CardTitle>
        <CardDescription
          className="text-sm text-gray-300 line-clamp-3 prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <span className="text-2xl font-extrabold text-white">
          {priceDisplay}
        </span>
        {productUrl ? (
          <Link href={productUrl} passHref target="_blank" rel="noopener noreferrer">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
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
