// app/products/[slug]/page.tsx
import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, ShoppingCart } from 'lucide-react';
import {
  getFourthwallProductBySlug,
  getAllFourthwallProducts,
  getProductPrice,
  getProductImage,
  getProductDescription,
  FourthwallProduct
} from '@/lib/fourthwall';

export const runtime = 'edge';

function createSlugFromName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function findProductBySlug(slug: string): Promise<FourthwallProduct | null> {
  let product = await getFourthwallProductBySlug(slug).catch(() => null);
  if (product) return product;

  const allProducts = await getAllFourthwallProducts();
  if (allProducts.length === 0) return null;
  
  const strategies = [
    (p: FourthwallProduct) => p.slug === slug,
    (p: FourthwallProduct) => p.id === slug,
    (p: FourthwallProduct) => createSlugFromName(p.name) === slug,
  ];

  for (const strategy of strategies) {
    const found = allProducts.find(strategy);
    if (found) return found;
  }
  return null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await findProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found' };

  const imageUrl = getProductImage(product);
  const description = getProductDescription(product).replace(/<[^>]*>?/gm, ''); // Plain text for meta

  return {
    title: `${product.name} | Your Store`,
    description: description,
    openGraph: imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: product.name }] } : null,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await findProductBySlug(params.slug);

  if (!product) {
    notFound(); // Triggers the not-found.tsx file
  }

  const mainImage = getProductImage(product);
  const price = getProductPrice(product);
  const description = getProductDescription(product);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: description.replace(/<[^>]*>?/gm, ''),
    image: mainImage,
    offers: {
      '@type': 'Offer',
      priceCurrency: product.variants?.[0]?.unitPrice?.currency || 'USD',
      price: product.variants?.[0]?.unitPrice?.value || 0,
      availability: product.variants?.some(v => v.unitPrice) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Store
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          <Suspense fallback={<div className="aspect-square w-full bg-secondary/20 rounded-lg animate-pulse" />}>
            <ProductGallery product={product} mainImage={mainImage} />
          </Suspense>
          <Suspense fallback={<div className="h-96 bg-secondary/20 rounded-lg animate-pulse" />}>
            <ProductDetails product={product} price={price} description={description} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// --- Child Components for Suspense ---

function ProductGallery({ product, mainImage }: { product: FourthwallProduct; mainImage: string | null }) {
  const additionalImages = product.images.slice(1);
  return (
    <div className="space-y-4">
      <div className="aspect-square w-full relative overflow-hidden rounded-lg bg-secondary/20 border border-secondary/30">
        {mainImage ? (
          <Image src={mainImage} alt={product.name} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="(max-width: 1024px) 100vw, 50vw" priority />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
        )}
      </div>
      {additionalImages.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {additionalImages.map((image, index) => (
            <div key={image.id || index} className="aspect-square relative overflow-hidden rounded-lg bg-secondary/20 border border-secondary/30">
              <Image src={image.url} alt={`${product.name} ${index + 2}`} fill className="object-cover hover:scale-105 transition-transform duration-200" sizes="(max-width: 768px) 25vw, 12vw" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductDetails({ product, price, description }: { product: FourthwallProduct; price: string; description: string }) {
  const isAvailable = product.variants && product.variants.some(variant => variant.unitPrice);
  const handleBuyNow = () => {
    // This client-side function requires this component to be marked with 'use client' if it were in a separate file.
    // Here it works because the parent `ProductPage` is a Server Component, but this function will only run on the client.
    const slug = product.slug || createSlugFromName(product.name);
    window.open(`https://[your-fourthwall-domain].com/products/${slug}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
        <div className="text-3xl font-bold text-purple-400 mb-2">{price}</div>
        <div className="flex items-center space-x-2 mb-6">
          <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`text-sm ${isAvailable ? 'text-green-400' : 'text-red-400'}`}>{isAvailable ? 'In Stock' : 'Out of Stock'}</span>
        </div>
      </div>
      <Card className="bg-secondary/20 border-secondary/30">
        <CardHeader><CardTitle className="text-white">Description</CardTitle></CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />
        </CardContent>
      </Card>
      {product.variants && product.variants.length > 1 && (
        <Card className="bg-secondary/20 border-secondary/30">
          <CardHeader><CardTitle className="text-white">Available Options</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <Badge key={variant.id} variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30 px-3 py-1">
                {variant.name}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}
      <div className="space-y-3">
        <Button onClick={handleBuyNow} disabled={!isAvailable} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold" size="lg">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Buy on Fourthwall
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
        <Link href="/" passHref>
          <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600/10 py-6 text-lg" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}