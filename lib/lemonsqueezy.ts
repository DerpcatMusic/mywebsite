// lib/lemonsqueezy.ts

// --- FIX APPLIED HERE ---
// This interface is now "flat" and matches the object structure created by the mapping function below.
// It includes the fields that the component actually needs.
export interface LemonSqueezyProduct {
  id: string;
  name: string;
  description: string;
  price_formatted: string;
  buy_now_url: string;
  thumb_url: string | null;
}

const API_BASE_URL = "https://api.lemonsqueezy.com/v1";

export async function getAllLemonSqueezyProducts(): Promise<LemonSqueezyProduct[]> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    console.error("LEMONSQUEEZY_API_KEY is not set.");
    return [];
  }

  // NOTE: You must include `variants` to get pricing information for a base product.
  const url = `${API_BASE_URL}/products?include=variants`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`,
      },
      next: { revalidate: 3600 } // Revalidate cache every hour
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Lemon Squeezy API Error:", errorBody);
      return [];
    }

    const jsonResponse = await response.json();

    // Map the API response to our clean, flat LemonSqueezyProduct interface
    const products: LemonSqueezyProduct[] = jsonResponse.data.map((item: any) => {
      // Get the first variant for price details (a common pattern)
      const firstVariant = jsonResponse.included?.find(
        (variant: any) =>
          variant.type === 'variants' && variant?.relationships?.product?.data?.id === item.id
      );
      return {
        id: item.id,
        name: item.attributes.name,
        description: item.attributes.description || '',
        // Use the variant's price, as the base product doesn't have one
        price_formatted: firstVariant?.attributes.price_formatted || 'N/A',
        buy_now_url: firstVariant?.attributes.buy_now_url || '',
        thumb_url: item.attributes.thumb_url || null
      };
    });

    return products;

  } catch (error) {
    console.error("Failed to fetch Lemon Squeezy products:", error);
    return [];
  }
}

// --- FIX APPLIED HERE ---
// These helper functions now correctly access the properties of our flat product object.
export function getLemonSqueezyProductImage(product: LemonSqueezyProduct): string | null {
  return product.thumb_url;
}

export function getLemonSqueezyProductPrice(product: LemonSqueezyProduct): string {
  return product.price_formatted;
}

export function getLemonSqueezyProductDescription(product: LemonSqueezyProduct): string {
  return product.description;
}