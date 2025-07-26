"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface BrandData {
  brandType: string;
  domain: string;
  title: string;
  colors: BrandColors;
  logo: string | null;
  lastUpdated: string;
  fallback?: boolean;
}

export interface BrandDataMap {
  [key: string]: BrandData;
}

interface BrandContextType {
  brands: BrandDataMap;
  loading: boolean;
  error: string | null;
  getBrand: (brandType: string) => BrandData | null;
  hasBrand: (brandType: string) => boolean;
  isLoaded: boolean;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

interface BrandProviderProps {
  children: React.ReactNode;
  fallbackData?: BrandDataMap;
}

export function BrandProvider({ children, fallbackData = {} }: BrandProviderProps) {
  const [brands, setBrands] = useState<BrandDataMap>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize fallbackData to prevent infinite loops
  const stableFallbackData = React.useMemo(() => fallbackData, [JSON.stringify(fallbackData)]);

  useEffect(() => {
    async function loadBrandData() {
      try {
        setLoading(true);
        setError(null);

        // Try to load from static file first (generated at build time)
        const response = await fetch('/brand-data/brands.json');

        if (response.ok) {
          const data = await response.json();

          if (data.brands) {
            setBrands(data.brands);
            console.log('✅ Brand data loaded successfully from static cache');
            console.log(`📊 Loaded ${Object.keys(data.brands).length} brands`);

            // Log metadata if available
            if (data.metadata) {
              console.log(`🕐 Generated at: ${data.metadata.generatedAt}`);
              if (data.metadata.errors) {
                console.warn('⚠️ Some brands using fallback data:', data.metadata.errors);
              }
            }
          } else {
            throw new Error('Invalid brand data format');
          }
        } else {
          // Fallback to runtime API if static file doesn't exist
          console.warn('📁 Static brand data not found, falling back to runtime loading...');
          await loadBrandDataFromAPI();
        }
      } catch (err) {
        console.error('❌ Failed to load brand data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');

        // Use fallback data if provided
        if (Object.keys(stableFallbackData).length > 0) {
          setBrands(stableFallbackData);
          console.log('🔄 Using fallback brand data');
        }
      } finally {
        setLoading(false);
      }
    }

    loadBrandData();
  }, [stableFallbackData]);

  // Fallback to runtime API loading (only used if static data fails)
  async function loadBrandDataFromAPI() {
    const brandTypes = ['fourthwall', 'gumroad', 'lemonsqueezy', 'patreon'];
    const loadedBrands: BrandDataMap = {};

    for (const brandType of brandTypes) {
      try {
        const response = await fetch(`/api/brand?brandType=${brandType}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            loadedBrands[brandType] = {
              ...result.data,
              brandType,
              domain: result.domain,
              lastUpdated: new Date().toISOString()
            };
          }
        }
      } catch (err) {
        console.warn(`Failed to load ${brandType} from API:`, err);
      }
    }

    setBrands(loadedBrands);
  }

  const getBrand = (brandType: string): BrandData | null => {
    return brands[brandType] || null;
  };

  const hasBrand = (brandType: string): boolean => {
    return brandType in brands && brands[brandType] !== null;
  };

  const contextValue: BrandContextType = {
    brands,
    loading,
    error,
    getBrand,
    hasBrand,
    isLoaded: !loading && error === null
  };

  return (
    <BrandContext.Provider value={contextValue}>
      {children}
    </BrandContext.Provider>
  );
}

// Hook to use brand context
export function useBrandContext(): BrandContextType {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrandContext must be used within a BrandProvider');
  }
  return context;
}

// Convenience hook for getting a specific brand
export function useBrand(brandType: string) {
  const { getBrand, loading, error, isLoaded } = useBrandContext();
  const brandData = getBrand(brandType);

  return {
    brandData,
    loading,
    error,
    isLoaded,
    hasData: brandData !== null
  };
}

// Convenience hook for getting multiple brands
export function useMultipleBrands(brandTypes: string[]) {
  const { brands, loading, error, isLoaded } = useBrandContext();

  const brandsData = brandTypes.reduce((acc, brandType) => {
    acc[brandType] = brands[brandType] || null;
    return acc;
  }, {} as BrandDataMap);

  const hasAllBrands = brandTypes.every(brandType => brands[brandType] !== null);
  const loadedCount = brandTypes.filter(brandType => brands[brandType] !== null).length;

  return {
    brandsData,
    loading,
    error,
    isLoaded,
    hasAllBrands,
    loadedCount,
    totalRequested: brandTypes.length
  };
}

// Helper functions for brand data
export function generateBrandCSS(brandData: BrandData | null, prefix: string = 'brand'): string {
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

// Helper to determine if a color is light or dark (for text contrast)
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex).split(', ').map(Number);
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  return luminance > 0.5;
}

// Default fallback brand data
export const DEFAULT_BRAND_DATA: BrandDataMap = {
  fourthwall: {
    brandType: 'fourthwall',
    domain: 'fourthwall.com',
    title: 'Fourthwall',
    colors: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#06b6d4' },
    logo: null,
    lastUpdated: new Date().toISOString(),
    fallback: true
  },
  gumroad: {
    brandType: 'gumroad',
    domain: 'gumroad.com',
    title: 'Gumroad',
    colors: { primary: '#ff90e8', secondary: '#ffa8cc', accent: '#ffb3d9' },
    logo: null,
    lastUpdated: new Date().toISOString(),
    fallback: true
  },
  lemonsqueezy: {
    brandType: 'lemonsqueezy',
    domain: 'lemonsqueezy.com',
    title: 'Lemon Squeezy',
    colors: { primary: '#ffd23f', secondary: '#fccc02', accent: '#f5c842' },
    logo: null,
    lastUpdated: new Date().toISOString(),
    fallback: true
  },
  patreon: {
    brandType: 'patreon',
    domain: 'patreon.com',
    title: 'Patreon',
    colors: { primary: '#ff424d', secondary: '#ff5a5a', accent: '#ff7b7b' },
    logo: null,
    lastUpdated: new Date().toISOString(),
    fallback: true
  }
};
