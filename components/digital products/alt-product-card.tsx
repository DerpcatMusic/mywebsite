// components/digital-products/alt-product-card.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GumroadProduct } from '../../lib/gumroad';
import {
  LemonSqueezyProduct,
  // --- FIX APPLIED HERE: We can still use the helpers as they now expect the correct object shape ---
  getLemonSqueezyProductImage,
  getLemonSqueezyProductPrice,
  getLemonSqueezyProductDescription
} from '../../lib/lemonsqueezy';
import {
  PatreonTier,
  getPatreonTierImage,
  getPatreonTierPrice,
  getPatreonTierDescription,
  getPatreonTierUrl,
} from '../../lib/patreon';

type AltProduct = GumroadProduct | LemonSqueezyProduct | PatreonTier;

interface AltProductCardProps {
  product: AltProduct;
  className?: string;
}

const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/288x224?text=Image+Not+Found';

export default function AltProductCard({ product, className }: AltProductCardProps) {
  // --- FIX APPLIED HERE: Type guards are updated to match the new flat structure ---
  const isGumroadProduct = (p: AltProduct): p is GumroadProduct => 'preview_url' in p;
  // Check for a property that is unique to our mapped Lemon Squeezy product
  const isLemonSqueezyProduct = (p: AltProduct): p is LemonSqueezyProduct => 'buy_now_url' in p;
  const isPatreonTier = (p: AltProduct): p is PatreonTier => 'attributes' in p && 'amount_cents' in p.attributes;

  let name: string;
  let description: string;
  let price: string;
  let url: string | null;
  let imageUrl: string | null;
  let buttonText: string;

  if (isGumroadProduct(product)) {
    name = product.name;
    description = product.description;
    price = product.formatted_price;
    url = product.short_url;
    imageUrl = product.preview_url || null;
    buttonText = 'View Product';
  } else if (isLemonSqueezyProduct(product)) {
    // --- FIX APPLIED HERE: Accessing properties on the flat object ---
    name = product.name;
    description = getLemonSqueezyProductDescription(product); // Helpers still work
    price = getLemonSqueezyProductPrice(product);
    url = product.buy_now_url; // Direct access
    imageUrl = getLemonSqueezyProductImage(product);
    buttonText = 'View Product';
  } else if (isPatreonTier(product)) {
    name = product.attributes.title;
    description = getPatreonTierDescription(product);
    price = getPatreonTierPrice(product);
    url = getPatreonTierUrl(product);
    imageUrl = getPatreonTierImage(product);
    buttonText = 'View Tier';
  } else {
    name = 'Unknown Product';
    description = 'No description available.';
    price = 'N/A';
    url = null;
    imageUrl = null;
    buttonText = 'Unavailable';
  }

  const finalImageUrl = imageUrl || PLACEHOLDER_IMAGE_URL;

  return (
    <Card
      key={product.id}
      className={`flex flex-col bg-orange-500/20 border-orange-500/30 hover:border-yellow-500 transition-all duration-300 w-72 flex-shrink-0 ${className || ''}`}
    >
      <CardHeader className="p-0">
        <div className="relative w-full h-56">
          <Image src={finalImageUrl} alt={name} sizes="33vw" fill style={{ objectFit: 'cover' }} className="rounded-t-lg" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-xl font-bold mb-2 text-white">{name}</CardTitle>
        <CardDescription
          className="text-sm text-gray-300 line-clamp-3 prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <span className="text-2xl font-extrabold text-white">{price}</span>
        {url ? (
          <Link href={url} passHref target="_blank" rel="noopener noreferrer">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
              {buttonText}
            </Button>
          </Link>
        ) : (
          <Button disabled className="bg-gray-500 cursor-not-allowed">
            Link Missing
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}