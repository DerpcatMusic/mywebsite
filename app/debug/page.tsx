// app/debug/page.tsx
"use client";

import { useBrand, useMultipleBrands } from "@/hooks/use-brand";
import { useBrandContext } from "@/lib/brand-provider";

function BrandTestCard({ brandType }: { brandType: string }) {
  const { brandData, loading, error, hasData } = useBrand(brandType);

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <h3 className="text-lg font-semibold capitalize">{brandType}</h3>

      {loading && <div className="text-blue-600">Loading...</div>}

      {error && (
        <div className="rounded bg-red-50 p-3 text-red-600">
          <strong>Error:</strong> {error.message}
        </div>
      )}

      {hasData && brandData && (
        <div className="space-y-3">
          <div className="font-semibold text-green-600">
            ✅ Loaded from static cache!
          </div>

          {/* Colors */}
          <div>
            <h4 className="mb-2 font-medium">Colors:</h4>
            <div className="flex space-x-4">
              {Object.entries(brandData.colors).map(([name, color]) => (
                <div key={name} className="text-center">
                  <div
                    className="h-16 w-16 rounded border"
                    style={{ backgroundColor: color }}
                  ></div>
                  <div className="mt-1 text-sm">
                    <div className="font-medium capitalize">{name}</div>
                    <div className="text-gray-600">{color}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logo */}
          {brandData.logo && (
            <div>
              <h4 className="mb-2 font-medium">Logo:</h4>
              <img
                src={brandData.logo}
                alt={`${brandType} logo`}
                className="h-12 w-12 object-contain"
              />
            </div>
          )}

          {!brandData.logo && (
            <div className="text-gray-500">
              No logo available (using fallback data)
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BrandProviderInfo() {
  const { brands, loading, error, isLoaded } = useBrandContext();
  const brandCount = Object.keys(brands).length;

  return (
    <div className="rounded-lg bg-blue-50 p-4">
      <h3 className="mb-2 text-lg font-semibold">Brand Provider Status</h3>
      <div className="space-y-1 text-sm">
        <div>
          Status: {loading ? "Loading..." : isLoaded ? "✅ Loaded" : "❌ Error"}
        </div>
        <div>Brands Available: {brandCount}</div>
        <div>Data Source: Static cache (generated at build time)</div>
        {error && <div className="text-red-600">Error: {error}</div>}
      </div>
    </div>
  );
}

export default function DebugPage() {
  const brandTypes = ["fourthwall", "gumroad", "lemonsqueezy", "patreon"];
  const { brandsData, loadedCount, totalRequested } =
    useMultipleBrands(brandTypes);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="mb-6 text-3xl font-bold">Debug Tools</h1>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              New Brand Provider System
            </h2>
            <p className="mb-6 text-muted-foreground">
              Testing the new centralized brand provider that loads data from
              static cache (no API calls!).
            </p>

            <BrandProviderInfo />
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Individual Brand Tests
            </h2>
            <p className="mb-4 text-muted-foreground">
              Loaded {loadedCount}/{totalRequested} brands
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {brandTypes.map(brandType => (
                <BrandTestCard key={brandType} brandType={brandType} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Performance Benefits
            </h2>
            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="mb-2 font-semibold">✅ What Changed:</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  • <strong>No runtime API calls</strong> - Data loaded from
                  static files
                </li>
                <li>
                  • <strong>Build-time generation</strong> - Brand data fetched
                  once during build
                </li>
                <li>
                  • <strong>Instant loading</strong> - No loading states for
                  users
                </li>
                <li>
                  • <strong>Fallback system</strong> - Graceful degradation when
                  API fails
                </li>
                <li>
                  • <strong>Centralized provider</strong> - One source of truth
                  for all components
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Usage Commands</h2>
            <div className="space-y-2 rounded-lg bg-gray-50 p-4">
              <div>
                <strong>Generate brand data:</strong>
                <code className="mt-1 block rounded bg-black p-2 text-green-400">
                  bun run generate-brands
                </code>
              </div>
              <div>
                <strong>Force regenerate (clear cache):</strong>
                <code className="mt-1 block rounded bg-black p-2 text-green-400">
                  bun run generate-brands:force
                </code>
              </div>
              <div>
                <strong>Build with brand data:</strong>
                <code className="mt-1 block rounded bg-black p-2 text-green-400">
                  bun run build
                </code>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
