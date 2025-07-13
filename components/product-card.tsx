// components/product-card.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/224x224?text=No+Image+Available';

export default function ProductCard({ product, fourthwallCheckoutDomain, className }: ProductCardProps) {
  const imageUrl = getProductImage(product) || PLACEHOLDER_IMAGE_URL; 
  const priceDisplay = getProductPrice(product); 
  const description = getProductDescription(product);

  return (
    <Card
      key={product.id}
      className={`
        flex flex-col
        bg-secondary/20 border-secondary/30
        hover:border-purple-500 transition-all duration-300
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
        {/* --- START OF FIX --- */}
        {/*
          Instead of rendering the description as a text child, we use dangerouslySetInnerHTML.
          This tells React to parse the string as HTML. This is safe because the content
          is coming from your own trusted Fourthwall store.
        */}
        <CardDescription
          className="text-sm text-gray-400 line-clamp-3 prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        {/* --- END OF FIX --- */}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <span className="text-2xl font-extrabold text-white">
          {priceDisplay}
        </span>
        {product.slug ? (
          <Link href={`/products/${product.slug}`} passHref>
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