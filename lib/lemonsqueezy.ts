// lib/lemonsqueezy.ts

// Placeholder type for Lemon Squeezy product
export interface LemonSqueezyProduct {
  id: string;
  name: string;
  description: string;
  price: string; // Lemon Squeezy price might be a string
  currency: string;
  url: string; // Assuming API provides a direct URL or it can be constructed
  large_thumb_url: string | null; // Assuming this field exists in attributes
  // Add other relevant fields from Lemon Squeezy API as needed
}

const API_BASE_URL = "https://api.lemonsqueezy.com/v1";

export async function getAllLemonSqueezyProducts(): Promise<LemonSqueezyProduct[]> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID; // Optional: filter by store ID

  if (!apiKey) {
    console.error("LEMONSQUEEZY_API_KEY is not set.");
    // Return empty array or throw an error, depending on desired behavior
    return [];
  }

  let url = `${API_BASE_URL}/products`;
  if (storeId) {
    url = `${url}?filter[store_id]=${storeId}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      // Attempt to read error body if available
      let errorBody = 'Unknown error';
      try {
        errorBody = await response.text();
      } catch (e) {
        // Ignore parsing errors
      }
      console.error(`Lemon Squeezy API error: ${response.status} ${response.statusText}`, errorBody);
      // Return empty array or throw a more specific error
      return [];
    }

    const data = await response.json();

    // Map API response to LemonSqueezyProduct interface
    // NOTE: The exact field names for price, currency, url, and large_thumb_url
    // might need adjustment based on the full API response structure.
    const products: LemonSqueezyProduct[] = data.data.map((item: any) => ({
      id: item.id,
      name: item.attributes.name,
      description: item.attributes.description || '', // description can be null
      price: item.attributes.price || 'N/A', // Assuming price is in attributes
      currency: item.attributes.currency || '', // Assuming currency is in attributes
      url: item.attributes.url || `https://your-store-url.lemonsqueezy.com/buy/${item.attributes.slug}` || '', // Assuming url or slug for construction
      large_thumb_url: item.attributes.large_thumb_url || null, // Assuming large_thumb_url is in attributes
    }));

    return products;

  } catch (error) {
    console.error("Error fetching Lemon Squeezy products:", error);
    // Return empty array or throw error
    return [];
  }
}

// Helper functions (already defined, keeping for completeness)
export function getLemonSqueezyProductImage(product: LemonSqueezyProduct): string | null {
  return product.large_thumb_url;
}

export function getLemonSqueezyProductPrice(product: LemonSqueezyProduct): string {
  return product.price;
}

export function getLemonSqueezyProductDescription(product: LemonSqueezyProduct): string {
  return product.description;
}