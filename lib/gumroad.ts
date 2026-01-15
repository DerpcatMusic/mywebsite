// lib/gumroad.ts

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
  // Attempting to fetch Gumroad products

  const GUMROAD_API_TOKEN = process.env.GUMROAD_API_TOKEN;

  if (!GUMROAD_API_TOKEN) {
    // ERROR: GUMROAD_API_TOKEN is not set in environment variables
    return [];
  }

  const GUMROAD_API_URL = `https://api.gumroad.com/v2/products?access_token=${GUMROAD_API_TOKEN}`;
  // Fetching from Gumroad API

  try {
    const response = await fetch(GUMROAD_API_URL, {
      // Consider 'no-store' if data needs to be absolutely fresh on every request
      // Otherwise, 'force-cache' for faster initial load, revalidate: 3600 for periodic updates
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      const _errorText = await response.text(); // Get response body for more context
      // ERROR: Failed to fetch Gumroad products
      if (response.status === 401 || response.status === 403) {
        // HINT: This usually means your GUMROAD_API_TOKEN is invalid or lacks necessary permissions
      }
      return [];
    }

    let data: { products?: unknown[] };
    try {
      data = await response.json();
      // SUCCESS: Raw Gumroad API response data received
    } catch (_jsonError) {
      // ERROR: Failed to parse Gumroad API response as JSON
      return [];
    }

    if (!data || !Array.isArray(data.products)) {
      // ERROR: Gumroad API response did not contain a 'products' array or was empty
      // HINT: Ensure your Gumroad API token is correct and you have published products
      return [];
    }

    const gumroadProducts: GumroadProduct[] = data.products
      .map((product: Record<string, unknown>) => {
        // Validate that we have required fields
        if (!product.id || !product.name) {
          return null;
        }

        // Get the best available URL
        const url = String(product.short_url || product.url || "");
        if (!url || !url.startsWith("http")) {
          // Skip products with invalid URLs to prevent 404 errors
          return null;
        }

        // Get the best available image
        const previewUrl =
          String(product.thumbnail_url || "") ||
          String(product.preview_url || "") ||
          String(product.cover_url || "") ||
          null;

        // Parse price correctly (Gumroad returns price in cents)
        const priceInCents = Number(product.price || 0);
        const priceInDollars = priceInCents / 100;

        return {
          id: String(product.id),
          name: String(product.name),
          description:
            String(product.description || "") || "No description available.",
          price: priceInCents,
          currency: String(product.currency || "USD"),
          url: url,
          preview_url: previewUrl,
          formatted_price:
            String(product.formatted_price || "") ||
            `$${priceInDollars.toFixed(2)}`,
          short_url: url,
        };
      })
      .filter((p): p is GumroadProduct => p !== null);

    // SUCCESS: Fetched Gumroad products
    return gumroadProducts;
  } catch (_error) {
    // CRITICAL ERROR: Unexpected error during Gumroad product fetch
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
