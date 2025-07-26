// hooks/use-brand.ts
"use client";

import {
    useBrandContext,
    useBrand as useProviderBrand,
    useMultipleBrands as useProviderMultipleBrands,
    type BrandData
} from '@/lib/brand-provider';

export type BrandType = 'fourthwall' | 'gumroad' | 'lemonsqueezy' | 'patreon';

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

// Convert new BrandData to legacy format for backward compatibility
function convertToLegacyFormat(brandData: BrandData | null): LegacyBrandData | null {
  if (!brandData) return null;

  return {
    colors: brandData.colors,
    logo: brandData.logo,
    title: brandData.title
  };
}

/**
 * Hook for fetching a single brand's data
 * Uses the centralized brand provider - no API calls needed!
 */
export function useBrand(brandType: BrandType) {
  const { brandData, loading, error, isLoaded, hasData } = useProviderBrand(brandType);

  // Convert to legacy format for backward compatibility
  const legacyBrandData = convertToLegacyFormat(brandData);

  return {
    brandData: legacyBrandData,
    loading,
    error: error ? new Error(error) : null,
    isLoaded,
    hasData
  };
}

/**
 * Hook for fetching multiple brands at once
 * Uses the centralized brand provider - no API calls needed!
 */
export function useMultipleBrands(brandTypes: BrandType[]) {
  const {
    brandsData,
    loading,
    error,
    isLoaded,
    hasAllBrands,
    loadedCount,
    totalRequested
  } = useProviderMultipleBrands(brandTypes);

  // Convert to legacy format for backward compatibility
  const legacyBrandsData: Record<BrandType, LegacyBrandData | null> = {};

  for (const brandType of brandTypes) {
    legacyBrandsData[brandType as BrandType] = convertToLegacyFormat(brandsData[brandType] || null);
  }

  return {
    brandsData: legacyBrandsData,
    loading,
    error: error ? new Error(error) : null,
    isLoaded,
    hasAllBrands,
    loadedCount,
    totalRequested
  };
}

/**
 * Hook to access the full brand context
 * Provides access to all brand data and context methods
 */
export function useAllBrands() {
  const context = useBrandContext();

  return {
    brands: context.brands,
    loading: context.loading,
    error: context.error ? new Error(context.error) : null,
    getBrand: context.getBrand,
    hasBrand: context.hasBrand,
    isLoaded: context.isLoaded
  };
}

/**
 * Hook to check if brand data is available without loading it
 */
export function useBrandAvailability(brandType: BrandType) {
  const { hasBrand, isLoaded } = useBrandContext();

  return {
    isAvailable: hasBrand(brandType),
    isLoaded
  };
}

/**
 * Hook for getting brand-specific CSS variables
 */
export function useBrandCSS(brandType: BrandType, prefix: string = 'brand') {
  const { brandData } = useProviderBrand(brandType);

  if (!brandData || !brandData.colors) {
    return '';
  }

  const { colors } = brandData;
  return `
    --${prefix}-primary: ${colors.primary};
    --${prefix}-secondary: ${colors.secondary};
    --${prefix}-accent: ${colors.accent};
    --${prefix}-primary-rgb: ${hexToRgb(colors.primary)};
    --${prefix}-secondary-rgb: ${hexToRgb(colors.secondary)};
    --${prefix}-accent-rgb: ${hexToRgb(colors.accent)};
  `.trim();
}

// Utility function to convert hex to RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return '0, 0, 0';
  }

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `${r}, ${g}, ${b}`;
}
