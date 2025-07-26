// app/products/[slug]/page.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FourthwallProduct,
  getAllFourthwallProducts,
  getFourthwallProductBySlug,
  getProductDescription,
  getProductImage,
  getProductPrice,
} from "@/lib/fourthwall";
import { ArrowLeft, ExternalLink, ShoppingCart } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const runtime = "edge";

function createSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function findProductBySlug(
  slug: string
): Promise<FourthwallProduct | null> {
  const product = await getFourthwallProductBySlug(slug).catch(() => null);
  if (product) {
    return product;
  }

  const allProducts = await getAllFourthwallProducts();
  if (allProducts.length === 0) {
    return null;
  }

  const strategies = [
    (p: FourthwallProduct) => p.slug === slug,
    (p: FourthwallProduct) => p.id === slug,
    (p: FourthwallProduct) => createSlugFromName(p.name) === slug,
  ];

  for (const strategy of strategies) {
    const found = allProducts.find(strategy);
    if (found) {
      return found;
    }
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await findProductBySlug(params.slug);
  if (!product) {
    return { title: "Product Not Found" };
  }

  const imageUrl = getProductImage(product);
  const description = getProductDescription(product).replace(/<[^>]*>?/gm, ""); // Plain text for meta

  return {
    title: `${product.name} | Your Store`,
    description: description,
    openGraph: imageUrl
      ? {
          images: [
            { url: imageUrl, width: 1200, height: 630, alt: product.name },
          ],
        }
      : null,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await findProductBySlug(params.slug);

  if (!product) {
    notFound(); // Triggers the not-found.tsx file
  }

  const mainImage = getProductImage(product);
  const price = getProductPrice(product);
  const description = getProductDescription(product);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: description.replace(/<[^>]*>?/gm, ""),
    image: mainImage,
    offers: {
      "@type": "Offer",
      priceCurrency: product.variants?.[0]?.unitPrice?.currency || "USD",
      price: product.variants?.[0]?.unitPrice?.value || 0,
      availability: product.variants?.some(v => v.unitPrice)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Store
            </Button>
          </Link>
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2">
          <Suspense
            fallback={
              <div className="aspect-square w-full animate-pulse rounded-lg bg-secondary/20" />
            }
          >
            <ProductGallery product={product} mainImage={mainImage} />
          </Suspense>
          <Suspense
            fallback={
              <div className="h-96 animate-pulse rounded-lg bg-secondary/20" />
            }
          >
            <ProductDetails
              product={product}
              price={price}
              description={description}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// --- Child Components for Suspense ---

function ProductGallery({
  product,
  mainImage,
}: {
  product: FourthwallProduct;
  mainImage: string | null;
}) {
  const additionalImages = product.images?.slice(1) || [];
  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-secondary/30 bg-secondary/20">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No Image Available
          </div>
        )}
      </div>
      {additionalImages.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {additionalImages.map((image, index) => (
            <div
              key={image.id || index}
              className="relative aspect-square overflow-hidden rounded-lg border border-secondary/30 bg-secondary/20"
            >
              <Image
                src={image.url}
                alt={`${product.name} ${index + 2}`}
                fill
                className="object-cover transition-transform duration-200 hover:scale-105"
                sizes="(max-width: 768px) 25vw, 12vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductDetails({
  product,
  price,
  description,
}: {
  product: FourthwallProduct;
  price: string;
  description: string;
}) {
  const isAvailable =
    product.variants && product.variants.some(variant => variant.unitPrice);
  const handleBuyNow = () => {
    // This client-side function requires this component to be marked with 'use client' if it were in a separate file.
    // Here it works because the parent `ProductPage` is a Server Component, but this function will only run on the client.
    const slug = product.slug || createSlugFromName(product.name);
    window.open(
      `https://[your-fourthwall-domain].com/products/${slug}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-4 text-4xl font-bold text-foreground">
          {product.name}
        </h1>
        <div className="mb-2 text-3xl font-bold text-primary">{price}</div>
        <div className="mb-6 flex items-center space-x-2">
          <div
            className={`h-2 w-2 rounded-full ${isAvailable ? "bg-green-500" : "bg-destructive"}`}
          />
          <span
            className={`text-sm ${isAvailable ? "text-green-400" : "text-destructive"}`}
          >
            {isAvailable ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
      <Card className="border-secondary/30 bg-secondary/20">
        <CardHeader>
          <CardTitle className="text-foreground">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-invert max-w-none leading-relaxed text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </CardContent>
      </Card>
      {product.variants && product.variants.length > 1 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Available Options</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {product.variants.map(variant => (
              <Badge
                key={variant.id}
                variant="secondary"
                className="border-primary/30 bg-primary/20 px-3 py-1 text-primary"
              >
                {variant.name}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}
      <div className="space-y-3">
        <Button
          onClick={handleBuyNow}
          disabled={!isAvailable}
          className="w-full bg-primary py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Buy on Fourthwall
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
        <Link href="/" passHref>
          <Button
            variant="outline"
            className="w-full border-primary py-6 text-lg text-primary hover:bg-primary/10"
            size="lg"
          >
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
