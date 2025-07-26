// lib/brand.ts
// Backward compatibility layer for the new brand provider system
// This file maintains the old API while using the new centralized system

export {
    useBrand,
    useMultipleBrands,
    type BrandType
} from '@/hooks/use-brand';

export {
    generateBrandCSS,
    isLightColor, type BrandColors, type BrandData
} from '@/lib/brand-provider';

// Brand configuration for different product types
export const BRAND_DOMAINS = {
  fourthwall: "fourthwall.com",
  gumroad: "gumroad.com",
  lemonsqueezy: "lemonsqueezy.com",
  patreon: "patreon.com",
} as const;

// Legacy interface for backward compatibility
export interface LegacyBrandData {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logo: string | null;
  title: string;
}

// Type aliases for backward compatibility
export type BrandType = keyof typeof BRAND_DOMAINS;

/**
 * @deprecated Use useBrand hook instead
 * Legacy function for getting brand data - now uses static cache
 */
export async function getBrandData(brandType: BrandType): Promise<LegacyBrandData | null> {
  try {
    // Try to load from static file (generated at build time)
    const response = await fetch('/brand-data/brands.json');

    if (response.ok) {
      const data = await response.json();
      const brandData = data.brands?.[brandType];

      if (brandData) {
        return {
          colors: brandData.colors,
          logo: brandData.logo,
          title: brandData.title
        };
      }
    }

    console.warn(`No brand data found for ${brandType}. Using fallback.`);
    return getFallbackBrandData(brandType);
  } catch (error) {
    console.error(`Failed to fetch brand data for ${brandType}:`, error);
    return getFallbackBrandData(brandType);
  }
}

/**
 * @deprecated Use useBrand hook instead
 * Legacy cached version - now just calls getBrandData
 */
export async function getCachedBrandData(brandType: BrandType): Promise<LegacyBrandData | null> {
  return getBrandData(brandType);
}

// Fallback brand data for when API/cache fails
function getFallbackBrandData(brandType: BrandType): LegacyBrandData {
  const fallbackColors = {
    fourthwall: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#06b6d4' },
    gumroad: { primary: '#ff90e8', secondary: '#ffa8cc', accent: '#ffb3d9' },
    lemonsqueezy: { primary: '#ffd23f', secondary: '#fccc02', accent: '#f5c842' },
    patreon: { primary: '#ff424d', secondary: '#ff5a5a', accent: '#ff7b7b' },
  };

  return {
    colors: fallbackColors[brandType] || { primary: '#6366f1', secondary: '#8b5cf6', accent: '#06b6d4' },
    logo: null,
    title: brandType.charAt(0).toUpperCase() + brandType.slice(1)
  };
}

// Cache for brand data to avoid repeated API calls (legacy)
const brandCache = new Map<BrandType, LegacyBrandData | null>();

// Helper function to generate CSS variables from brand colors (re-exported from provider)
// This maintains the same interface as before
