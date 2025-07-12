// lib/fourthwall.ts
const FOURTHWALL_API_URL = process.env.NEXT_PUBLIC_FOURTHWALL_API_URL;
const FOURTHWALL_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_FW_STOREFRONT_TOKEN;
const FOURTHWALL_COLLECTION_SLUG = process.env.NEXT_PUBLIC_FW_COLLECTION;

interface FourthwallProduct {
  id: string;
  name: string;
  slug?: string; // Made optional
  unitPrice?: { // Made optional
    value?: number; // Value can be optional too
    currency?: string; // Currency can be optional too
  };
  thumbnailImage?: { // Added thumbnailImage based on API response
    url: string; // Assuming url is always a string if thumbnailImage exists
    // Include other properties if needed, e.g., id, width, height, transformedUrl
  };
  images?: any[]; // Keep images as any[] or refine based on actual data if needed
  attributes?: { // Attributes object itself can be optional
    description?: string;
  }
}

export async function getAllFourthwallProducts(): Promise<FourthwallProduct[]> {
  if (!FOURTHWALL_API_URL || !FOURTHWALL_STOREFRONT_TOKEN) {
    console.error("Fourthwall API URL or Storefront Token is not set. Check your .env.local file.");
    return [];
  }

  try {
    let allProducts: FourthwallProduct[] = [];

    if (FOURTHWALL_COLLECTION_SLUG) {
      const productsRes = await fetch(`${FOURTHWALL_API_URL}/collections/${FOURTHWALL_COLLECTION_SLUG}/products?storefront_token=${FOURTHWALL_STOREFRONT_TOKEN}`);
      if (!productsRes.ok) {
        const errorText = await productsRes.text();
        // Log the full error response for better debugging
        console.error(`Failed to fetch products for collection "${FOURTHWALL_COLLECTION_SLUG}": ${productsRes.status} ${errorText}. Please check the collection slug in your .env.local file.`);
        return [];
      }
      const productsData = await productsRes.json();
      allProducts = productsData.results || [];
    } else {
      // Fallback: If no specific collection slug, try to fetch from all collections
      // (This part assumes a structure where /collections returns slugs that can be used)
      const collectionsRes = await fetch(`${FOURTHWALL_API_URL}/collections?storefront_token=${FOURTHWALL_STOREFRONT_TOKEN}`);
      if (!collectionsRes.ok) {
        const errorText = await collectionsRes.text();
        throw new Error(`Failed to fetch collections: ${collectionsRes.status} ${errorText}`);
      }
      const collectionsData = await collectionsRes.json();
      const collections: { slug: string; id: string; name: string }[] = collectionsData.results || [];

      // Fetch products from each collection
      for (const collection of collections) {
        const productsRes = await fetch(`${FOURTHWALL_API_URL}/collections/${collection.slug}/products?storefront_token=${FOURTHWALL_STOREFRONT_TOKEN}`);
        if (!productsRes.ok) {
          console.warn(`Failed to fetch products for collection ${collection.slug}: ${productsRes.status}`);
          continue; // Continue to next collection if one fails
        }
        const productsData = await productsRes.json();
        allProducts = allProducts.concat(productsData.results || []);
      }
    }

    return allProducts;
  } catch (error) {
    console.error("Error fetching Fourthwall products:", error);
    return [];
  }
}