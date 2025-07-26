// app/api/brand/route.ts
import { BRAND_DOMAINS, type BrandType } from "@/lib/brand";
import BrandDev from "brand.dev";
import { NextRequest, NextResponse } from "next/server";

// Initialize brand client on server side where env vars are available
let brandClient: BrandDev | null = null;

function getBrandClient(): BrandDev | null {
  console.log("getBrandClient called");
  console.log("API Key exists:", !!process.env.BRAND_DEV_API_KEY);
  console.log("API Key value:", process.env.BRAND_DEV_API_KEY ? `${process.env.BRAND_DEV_API_KEY.substring(0, 10)}...` : 'undefined');

  if (!brandClient && process.env.BRAND_DEV_API_KEY) {
    try {
      console.log("Initializing brand.dev client...");
      brandClient = new BrandDev({
        apiKey: process.env.BRAND_DEV_API_KEY,
      });
      console.log("Brand.dev client initialized successfully");
    } catch (error) {
      console.error("Brand.dev client initialization failed:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return null;
    }
  } else if (!process.env.BRAND_DEV_API_KEY) {
    console.error("BRAND_DEV_API_KEY environment variable is not set.");
    return null;
  }
  return brandClient;
}

export async function GET(request: NextRequest) {
  console.log("=== Brand API Route Called ===");
  const { searchParams } = new URL(request.url);
  const brandType = searchParams.get("brandType") as BrandType;
  console.log("Brand type requested:", brandType);

  if (!brandType || !BRAND_DOMAINS[brandType]) {
    console.error("Invalid brand type:", brandType);
    return NextResponse.json(
      { error: "Invalid or missing brandType parameter" },
      { status: 400 }
    );
  }

  const domain = BRAND_DOMAINS[brandType];
  console.log("Domain for brand type:", domain);

  const client = getBrandClient();

  if (!client) {
    console.error("Failed to get brand client");
    return NextResponse.json(
      {
        error: "Brand.dev client not available. Check BRAND_DEV_API_KEY environment variable.",
        brandType,
        domain,
        hasApiKey: !!process.env.BRAND_DEV_API_KEY
      },
      { status: 500 }
    );
  }

  try {
    console.log(`Fetching brand data for ${brandType} (${domain})`);
    const response = await client.brand.retrieve({ domain });
    console.log(`Brand.dev API response for ${brandType}:`, JSON.stringify(response, null, 2));

    const brand = response.brand as Record<string, unknown>;
    console.log(`Brand object:`, brand);
    console.log(`Colors array:`, brand.colors);
    console.log(`Colors array type:`, typeof brand.colors);
    console.log(`Colors array length:`, Array.isArray(brand.colors) ? brand.colors.length : 'not an array');

    if (Array.isArray(brand.colors) && brand.colors.length > 0) {
      console.log(`First color:`, brand.colors[0]);
      console.log(`First color type:`, typeof brand.colors[0]);
      console.log(`First color structure:`, JSON.stringify(brand.colors[0], null, 2));
    }

    if (!brand?.colors || !Array.isArray(brand.colors) || brand.colors.length < 3) {
      console.error("Insufficient color data");
      console.error("Colors exist:", !!brand?.colors);
      console.error("Is array:", Array.isArray(brand.colors));
      console.error("Length:", brand?.colors?.length);
      return NextResponse.json(
        {
          error: "Insufficient color data - expected at least 3 colors",
          brandType,
          domain,
          colorsFound: brand?.colors?.length || 0,
          colorsData: brand?.colors
        },
        { status: 404 }
      );
    }

    // Extract colors from brand data - handle objects with hex property
    console.log("Extracting colors...");
    const extractColor = (colorData: any, index: number) => {
      console.log(`Color ${index}:`, colorData);
      if (typeof colorData === 'object' && colorData !== null) {
        const hex = colorData.hex || colorData.value || colorData.color || colorData;
        console.log(`Extracted hex for color ${index}:`, hex);
        return String(hex);
      }
      return String(colorData);
    };

    const colors = {
      primary: extractColor(brand.colors[0], 0),
      secondary: extractColor(brand.colors[1], 1),
      accent: extractColor(brand.colors[2], 2),
    };

    console.log("Final colors object:", colors);

    // Get logo - prefer SVG, then main logo
    const logos = brand.logos as Record<string, unknown>[] | undefined;
    const logo =
      logos?.find((l: Record<string, unknown>) => l?.type === "svg")?.url ||
      logos?.[0]?.url ||
      null;

    if (!logo) {
      console.warn(`No logo found for brand type: ${brandType} (domain: ${domain}).`);
      return NextResponse.json(
        {
          error: "No logo found for this brand",
          brandType,
          domain,
          logosFound: logos?.length || 0
        },
        { status: 404 }
      );
    }

    const brandData = {
      colors,
      logo: String(logo),
      title: String(brand.title || brandType),
    };

    console.log(`Successfully fetched brand data for ${brandType}:`, brandData);

    return NextResponse.json({
      success: true,
      brandType,
      domain,
      data: brandData
    });

  } catch (error) {
    console.error(`Failed to fetch brand data for ${brandType}:`, error);
    console.error("Error type:", typeof error);
    console.error("Error constructor:", error?.constructor?.name);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack available');

    return NextResponse.json(
      {
        error: "Failed to fetch brand data",
        brandType,
        domain,
        details: error instanceof Error ? error.message : String(error),
        errorType: error?.constructor?.name || typeof error
      },
      { status: 500 }
    );
  }
}

// Optional: Add POST method if you need to batch fetch multiple brands
export async function POST(request: NextRequest) {
  try {
    const { brandTypes } = await request.json();

    if (!Array.isArray(brandTypes)) {
      return NextResponse.json(
        { error: "brandTypes must be an array" },
        { status: 400 }
      );
    }

    const results = await Promise.allSettled(
      brandTypes.map(async (brandType: BrandType) => {
        const url = new URL(request.url);
        url.searchParams.set("brandType", brandType);

        // Make internal API call
        const response = await GET(new NextRequest(url.toString()));
        const data = await response.json();

        return {
          brandType,
          success: response.ok,
          data: response.ok ? data.data : null,
          error: response.ok ? null : data.error
        };
      })
    );

    return NextResponse.json({
      success: true,
      results: results.map(result =>
        result.status === "fulfilled" ? result.value : { error: result.reason }
      )
    });

  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process batch request",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
