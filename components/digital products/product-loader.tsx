// components/digital-products/product-loader.tsx

import { getAllGumroadProducts } from '@/lib/gumroad';
import { getAllLemonSqueezyProducts } from '@/lib/lemonsqueezy';
import { getAllPatreonTiers } from '@/lib/patreon';
import AltProductsSection from './alt-products-section'; // Your existing client component

// This is a Server Component by default (no 'use client')
// It can be an async function
export default async function ProductLoader() {
  // All fetching happens here, securely on the server.
  // The GUMROAD_API_TOKEN is available here.
  const [gumroadResult, lemonsqueezyResult, patreonResult] = await Promise.allSettled([
    getAllGumroadProducts(),
    getAllLemonSqueezyProducts(),
    getAllPatreonTiers(),
  ]);

  // Handle results and potential errors from fetching
  const gumroadProducts = gumroadResult.status === 'fulfilled' ? gumroadResult.value : [];
  if (gumroadResult.status === 'rejected') {
    console.error("Failed to load Gumroad products:", gumroadResult.reason);
  }

  const lemonsqueezyProducts = lemonsqueezyResult.status === 'fulfilled' ? lemonsqueezyResult.value : [];
  if (lemonsqueezyResult.status === 'rejected') {
    console.error("Failed to load Lemon Squeezy products:", lemonsqueezyResult.reason);
  }
  
  const patreonTiers = patreonResult.status === 'fulfilled' ? patreonResult.value : [];
  if (patreonResult.status === 'rejected') {
    console.error("Failed to load Patreon tiers:", patreonResult.reason);
  }

  const allFetchedProducts = [...gumroadProducts, ...lemonsqueezyProducts, ...patreonTiers];

  // Pass the fetched data as a prop to the client component.
  // The client component will only handle displaying the data.
  return <AltProductsSection initialProducts={allFetchedProducts} />;
}