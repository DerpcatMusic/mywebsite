// lib/fourthwall.ts
import { z } from "zod";

// Environment variables validation
const envSchema = z.object({
  NEXT_PUBLIC_FOURTHWALL_API_URL: z.string().url(),
  NEXT_PUBLIC_FW_STOREFRONT_TOKEN: z.string().min(1),
  NEXT_PUBLIC_FW_COLLECTION: z.string().optional(),
});

function getEnvVars() {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_FOURTHWALL_API_URL: process.env.NEXT_PUBLIC_FOURTHWALL_API_URL,
    NEXT_PUBLIC_FW_STOREFRONT_TOKEN:
      process.env.NEXT_PUBLIC_FW_STOREFRONT_TOKEN,
    NEXT_PUBLIC_FW_COLLECTION: process.env.NEXT_PUBLIC_FW_COLLECTION,
  });

  if (!result.success) {
    throw new Error(
      `Invalid environment variables: ${result.error.flatten().fieldErrors}`
    );
  }

  return result.data;
}

// API Response Schemas
const imageSchema = z.object({
  url: z.string().url(),
  id: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  transformedUrl: z.string().url().optional(),
});

const moneySchema = z.object({
  value: z.number(),
  currency: z.string().default("USD"),
});

const productVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  unitPrice: moneySchema.optional().nullable(),
  attributes: z
    .object({
      description: z.string().optional().nullable(),
      color: z
        .object({
          name: z.string(),
          swatch: z.string().optional(),
        })
        .optional()
        .nullable(),
      size: z
        .object({
          name: z.string(),
        })
        .optional()
        .nullable(),
    })
    .passthrough() // Allow additional attributes
    .optional()
    .nullable(),
  stock: z
    .object({
      type: z.string().optional(),
      inStock: z.number().optional(),
    })
    .optional()
    .nullable(),
  weight: z
    .object({
      value: z.number(),
      unit: z.string(),
    })
    .optional()
    .nullable(),
  dimensions: z
    .object({
      length: z.number(),
      width: z.number(),
      height: z.number(),
      unit: z.string(),
    })
    .optional()
    .nullable(),
  images: z.array(imageSchema).optional().nullable(),
  thumbnailImage: imageSchema.optional().nullable(),
});

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  // Ensure images is never undefined, only null or array
  images: z
    .array(imageSchema)
    .nullable()
    .default([])
    .transform(val => (val === null ? [] : val)),
  thumbnailImage: imageSchema.optional().nullable(),
  variants: z.array(productVariantSchema).default([]),
});

const apiResponseSchema = z.object({
  results: z.array(productSchema),
  count: z.number().optional(),
  next: z.string().optional(),
  previous: z.string().optional(),
});

const collectionSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
});

const collectionsResponseSchema = z.object({
  results: z.array(collectionSchema),
});

// Types
export type FourthwallProduct = z.infer<typeof productSchema>;
export type FourthwallCollection = z.infer<typeof collectionSchema>;

// API Error class
class FourthwallAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: string
  ) {
    super(message);
    this.name = "FourthwallAPIError";
  }
}

// Base API client
class FourthwallClient {
  private baseURL: string;
  private token: string;

  constructor() {
    const env = getEnvVars();
    this.baseURL = env.NEXT_PUBLIC_FOURTHWALL_API_URL;
    this.token = env.NEXT_PUBLIC_FW_STOREFRONT_TOKEN;
  }

  private async makeRequest<T>(
    endpoint: string,
    schema: z.ZodSchema<T>
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const fullUrl = url.includes("?")
      ? `${url}&storefront_token=${this.token}`
      : `${url}?storefront_token=${this.token}`;

    try {
      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new FourthwallAPIError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          errorText
        );
      }

      const data = await response.json();
      const result = schema.safeParse(data);

      if (!result.success) {
        throw new FourthwallAPIError(
          `Invalid API response format: ${result.error.message}`
        );
      }

      return result.data;
    } catch (error) {
      if (error instanceof FourthwallAPIError) {
        throw error;
      }
      throw new FourthwallAPIError(
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async getCollections(): Promise<FourthwallCollection[]> {
    const response = await this.makeRequest(
      "/collections",
      collectionsResponseSchema
    );
    return response.results;
  }

  async getProductsFromCollection(slug: string): Promise<FourthwallProduct[]> {
    const response = await this.makeRequest(
      `/collections/${slug}/products`,
      apiResponseSchema
    );
    return response.results;
  }

  async getProductBySlug(slug: string): Promise<FourthwallProduct | null> {
    try {
      const response = await this.makeRequest(
        `/products?slug=${slug}`,
        apiResponseSchema
      );
      // The API might return an array even for a single slug, so return the first item
      return response.results.length > 0 ? response.results[0] : null;
    } catch (_error) {
      // Error fetching product by slug
      return null;
    }
  }
}

export async function getFourthwallProductBySlug(
  slug: string
): Promise<FourthwallProduct | null> {
  try {
    const client = new FourthwallClient();
    return await client.getProductBySlug(slug);
  } catch (_error) {
    // Error in getFourthwallProductBySlug
    return null;
  }
}

export async function getAllFourthwallProducts(): Promise<FourthwallProduct[]> {
  try {
    const client = new FourthwallClient();
    const env = getEnvVars();

    const collectionSlug = env.NEXT_PUBLIC_FW_COLLECTION;
    if (!collectionSlug || collectionSlug === "all-products") {
      // Fetching products from ALL collections
      const collections = await client.getCollections();

      if (collections.length === 0) {
        // No collections found in the store
        return [];
      }

      const allProducts: FourthwallProduct[] = [];
      const results = await Promise.allSettled(
        collections.map(collection =>
          client.getProductsFromCollection(collection.slug)
        )
      );

      results.forEach(result => {
        if (result.status === "fulfilled") {
          // Temporarily gather all products, including potential duplicates
          allProducts.push(...result.value);
        }
      });

      // Use a Map to ensure each product ID is represented only once.
      const uniqueProductsMap = new Map<string, FourthwallProduct>();
      allProducts.forEach(product => {
        uniqueProductsMap.set(product.id, product);
      });

      // Convert the Map's values back into an array of unique products.
      const uniqueProducts = Array.from(uniqueProductsMap.values());
      // Fetched products from all collections

      return uniqueProducts;
    } else {
      // Fetching products from specific collection
      return await client.getProductsFromCollection(collectionSlug);
    }
  } catch (error) {
    if (error instanceof FourthwallAPIError) {
      // Fourthwall API Error
    } else {
      // Unexpected error
    }
    return [];
  }
}

// Utility functions (No changes needed here)
export function getProductPrice(product: FourthwallProduct): string {
  const firstVariant = product.variants?.[0];
  if (!firstVariant?.unitPrice?.value) {
    return "Price not available";
  }
  const currency = firstVariant.unitPrice.currency || "USD";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });
  return formatter.format(firstVariant.unitPrice.value);
}

export function getProductImage(product: FourthwallProduct): string | null {
  return (
    product.thumbnailImage?.url ||
    (product.images && product.images.length > 0
      ? product.images[0]?.url
      : null) ||
    null
  );
}

export function getProductDescription(product: FourthwallProduct): string {
  const firstVariant = product.variants?.[0];
  const mainDescription = product.description;
  const variantDescription = firstVariant?.attributes?.description;
  return mainDescription || variantDescription || "No description available";
}
