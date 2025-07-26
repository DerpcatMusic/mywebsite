#!/usr/bin/env node

/**
 * Build-time Brand Data Generator
 * Fetches brand data from brand.dev API once during build and saves to static files
 * This eliminates runtime API calls and provides instant brand data access
 */

// Load environment variables from .env file
require('dotenv').config();

const fs = require('fs');
const path = require('path');

// Brand configuration
const BRAND_DOMAINS = {
  fourthwall: "fourthwall.com",
  gumroad: "gumroad.com",
  lemonsqueezy: "lemonsqueezy.com",
  patreon: "patreon.com",
};

// Output directory for cached brand data
const BRAND_DATA_DIR = path.join(__dirname, '../public/brand-data');
const BRAND_DATA_FILE = path.join(BRAND_DATA_DIR, 'brands.json');

/**
 * Fetch brand data from brand.dev API
 */
async function fetchBrandData(domain) {
  const apiKey = process.env.BRAND_DEV_API_KEY;

  if (!apiKey) {
    throw new Error('BRAND_DEV_API_KEY environment variable is not set');
  }

  console.log(`Fetching brand data for ${domain}...`);

  try {
    // Use node-fetch for Node.js environment
    const fetch = globalThis.fetch || (await import('node-fetch')).default;

    const response = await fetch(`https://api.brand.dev/v1/brand/retrieve?domain=${domain}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched data for ${domain}`);
    console.log(`   Brand: ${data.brand?.title || 'Unknown'}`);
    console.log(`   Colors: ${data.brand?.colors?.length || 0} found`);
    console.log(`   Logos: ${data.brand?.logos?.length || 0} found`);

    return data;
  } catch (error) {
    console.error(`❌ Failed to fetch data for ${domain}:`, error.message);
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('   Network connectivity issue - check your internet connection');
    }
    return null;
  }
}

/**
 * Extract and normalize brand data
 */
function processBrandData(rawData, brandType, domain) {
  if (!rawData || !rawData.brand) {
    return null;
  }

  const brand = rawData.brand;

  // Extract colors
  let colors = { primary: null, secondary: null, accent: null };

  if (brand.colors && Array.isArray(brand.colors) && brand.colors.length >= 3) {
    const extractColor = (colorData) => {
      if (typeof colorData === 'object' && colorData !== null) {
        // Handle different possible color object structures
        return colorData.hex || colorData.value || colorData.color || String(colorData);
      }
      return String(colorData);
    };

    colors = {
      primary: extractColor(brand.colors[0]),
      secondary: extractColor(brand.colors[1]),
      accent: extractColor(brand.colors[2]),
    };

    // Validate that we got actual hex colors
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    if (!hexPattern.test(colors.primary) || !hexPattern.test(colors.secondary) || !hexPattern.test(colors.accent)) {
      console.warn(`   ⚠️ Invalid color format detected for ${brandType}`);
      colors = { primary: null, secondary: null, accent: null };
    }
  }

  // Extract logo
  let logo = null;
  if (brand.logos && Array.isArray(brand.logos) && brand.logos.length > 0) {
    // Prefer SVG, then any available logo
    const svgLogo = brand.logos.find(l => l.type === 'svg');
    logo = svgLogo ? svgLogo.url : brand.logos[0].url;
  }

  const processedData = {
    brandType,
    domain,
    title: brand.title || brandType.charAt(0).toUpperCase() + brandType.slice(1),
    colors,
    logo,
    lastUpdated: new Date().toISOString(),
    // Only include raw data in development
    ...(process.env.NODE_ENV === 'development' && { raw: rawData })
  };

  // Validate the processed data
  const isValid = colors.primary && colors.secondary && colors.accent && logo;
  if (!isValid) {
    console.warn(`   ⚠️ Incomplete data for ${brandType}:`);
    if (!colors.primary) console.warn(`     - Missing primary color`);
    if (!colors.secondary) console.warn(`     - Missing secondary color`);
    if (!colors.accent) console.warn(`     - Missing accent color`);
    if (!logo) console.warn(`     - Missing logo`);
  }

  return processedData;
}

/**
 * Generate fallback brand data for when API fails
 */
function getFallbackBrandData(brandType, domain) {
  const fallbackColors = {
    fourthwall: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#06b6d4' },
    gumroad: { primary: '#ff90e8', secondary: '#ffa8cc', accent: '#ffb3d9' },
    lemonsqueezy: { primary: '#ffd23f', secondary: '#fccc02', accent: '#f5c842' },
    patreon: { primary: '#ff424d', secondary: '#ff5a5a', accent: '#ff7b7b' },
  };

  return {
    brandType,
    domain,
    title: brandType.charAt(0).toUpperCase() + brandType.slice(1),
    colors: fallbackColors[brandType] || { primary: '#6366f1', secondary: '#8b5cf6', accent: '#06b6d4' },
    logo: null,
    lastUpdated: new Date().toISOString(),
    fallback: true
  };
}

/**
 * Main generation function
 */
async function generateBrandData() {
  console.log('🎨 Generating brand data...\n');

  // Ensure output directory exists
  if (!fs.existsSync(BRAND_DATA_DIR)) {
    fs.mkdirSync(BRAND_DATA_DIR, { recursive: true });
  }

  const brandData = {};
  const errors = [];

  // Fetch data for each brand
  for (const [brandType, domain] of Object.entries(BRAND_DOMAINS)) {
    try {
      const rawData = await fetchBrandData(domain);

      if (rawData) {
        const processedData = processBrandData(rawData, brandType, domain);

        if (processedData && processedData.colors.primary && processedData.logo) {
          brandData[brandType] = processedData;
          console.log(`✅ ${brandType}: Colors and logo extracted successfully`);
        } else {
          console.log(`⚠️  ${brandType}: Incomplete data, using fallback`);
          brandData[brandType] = getFallbackBrandData(brandType, domain);
          errors.push(`${brandType}: Incomplete API data`);
        }
      } else {
        console.log(`❌ ${brandType}: API failed, using fallback`);
        brandData[brandType] = getFallbackBrandData(brandType, domain);
        errors.push(`${brandType}: API request failed`);
      }
    } catch (error) {
      console.error(`❌ ${brandType}: Error -`, error.message);
      brandData[brandType] = getFallbackBrandData(brandType, domain);
      errors.push(`${brandType}: ${error.message}`);
    }

    // Small delay to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Create final data structure
  const finalData = {
    brands: brandData,
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      totalBrands: Object.keys(brandData).length,
      errors: errors.length > 0 ? errors : null
    }
  };

  // Write to file
  fs.writeFileSync(BRAND_DATA_FILE, JSON.stringify(finalData, null, 2));

  // Also create individual brand files for easier imports
  for (const [brandType, data] of Object.entries(brandData)) {
    const brandFile = path.join(BRAND_DATA_DIR, `${brandType}.json`);
    fs.writeFileSync(brandFile, JSON.stringify(data, null, 2));
  }

  console.log('\n🎉 Brand data generation complete!');
  console.log(`📁 Data saved to: ${BRAND_DATA_FILE}`);
  console.log(`🔢 Total brands: ${Object.keys(brandData).length}`);

  if (errors.length > 0) {
    console.log(`⚠️  Warnings: ${errors.length}`);
    errors.forEach(error => console.log(`   - ${error}`));
  }

  // Log summary of what was generated
  console.log('\n📊 Brand Data Summary:');
  for (const [brandType, data] of Object.entries(brandData)) {
    const status = data.fallback ? '(fallback)' : '(API data)';
    const hasLogo = data.logo ? '🖼️' : '❌';
    const hasColors = data.colors.primary ? '🎨' : '❌';
    console.log(`   ${brandType}: ${hasColors} ${hasLogo} ${status}`);
  }

  return finalData;
}

// Run the generator
if (require.main === module) {
  generateBrandData()
    .then(() => {
      console.log('\n✅ Brand data generation completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Brand data generation failed:', error);
      process.exit(1);
    });
}

module.exports = { generateBrandData, BRAND_DOMAINS };
