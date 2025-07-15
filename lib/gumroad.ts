// lib/gumroad.ts
import { notFound } from 'next/navigation';

export interface GumroadProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  url: string;
  preview_url: string | null;
  formatted_price: string;
  short_url: string;
}

export async function getAllGumroadProducts(): Promise<GumroadProduct[]> {
  console.log("Attempting to fetch Gumroad products...");

  const GUMROAD_API_TOKEN = process.env.GUMROAD_API_TOKEN;

  if (!GUMROAD_API_TOKEN) {
    console.error("ERROR: GUMROAD_API_TOKEN is not set in environment variables. Please check your .env.local file and restart the server.");
    return [];
  }

  const GUMROAD_API_URL = `https://api.gumroad.com/v2/products?access_token=${GUMROAD_API_TOKEN}`;
  console.log(`Fetching from: ${GUMROAD_API_URL.replace(GUMROAD_API_TOKEN, '***TOKEN_HIDDEN***')}`); // Log URL but hide token

  try {
    const response = await fetch(GUMROAD_API_URL, {
      // Consider 'no-store' if data needs to be absolutely fresh on every request
      // Otherwise, 'force-cache' for faster initial load, revalidate: 3600 for periodic updates
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get response body for more context
      console.error(`ERROR: Failed to fetch Gumroad products. Status: ${response.status} ${response.statusText}. Response Body: ${errorText}`);
      if (response.status === 401 || response.status === 403) {
        console.error("HINT: This usually means your GUMROAD_API_TOKEN is invalid or lacks necessary permissions.");
      }
      return [];
    }

    let data: any;
    try {
      data = await response.json();
      console.log("SUCCESS: Raw Gumroad API response data:", JSON.stringify(data, null, 2)); // Log raw data for inspection
    } catch (jsonError) {
      console.error("ERROR: Failed to parse Gumroad API response as JSON.", jsonError);
      return [];
    }

    if (!data || !Array.isArray(data.products)) {
      console.error("ERROR: Gumroad API response did not contain a 'products' array or was empty.", data);
      console.error("HINT: Ensure your Gumroad API token is correct and you have published products.");
      return [];
    }

    const gumroadProducts: GumroadProduct[] = data.products.map((product: any) => {
      // Add more specific logging for each product if needed, during mapping
      // console.log("Mapping Gumroad product:", product.id, product.name);

      return {
        id: product.id,
        name: product.name,
        description: product.description || 'No description available.',
        price: product.price,
        currency: product.currency,
        url: product.url,
        preview_url: product.thumbnail_url || product.preview_url || product.featured_product_thumbnail_url || null, // Common image fields
        formatted_price: product.formatted_price || `${(product.price / 100).toFixed(2)} ${product.currency}`,
        short_url: product.short_url || product.url,
      };
    });

    console.log(`SUCCESS: Fetched ${gumroadProducts.length} Gumroad products.`);
    return gumroadProducts;

  } catch (error) {
    console.error("CRITICAL ERROR: Unexpected error during Gumroad product fetch.", error);
    return [];
  }
}

// Existing helper functions (remain unchanged)
export function getGumroadProductImage(product: GumroadProduct): string | null {
  return product.preview_url;
}

export function getGumroadProductPrice(product: GumroadProduct): string {
  return `${product.price / 100} ${product.currency}`;
}

export function getGumroadProductDescription(product: GumroadProduct): string {
  return product.description;
}