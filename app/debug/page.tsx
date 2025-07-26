// app/debug/page.tsx
"use client";

import { useBrand, useMultipleBrands } from "@/hooks/use-brand";
import { useBrandContext } from "@/lib/brand-provider";

function BrandTestCard({ brandType }: { brandType: string }) {
  const { brandData, loading, error, hasData } = useBrand(brandType);

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <h3 className="text-lg font-semibold capitalize">{brandType}</h3>

      {loading && <div className="text-blue-600">Loading...</div>}

      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded">
          <strong>Error:</strong> {error.message}
        </div>
      )}

      {hasData && brandData && (
        <div className="space-y-3">
          <div className="text-green-600 font-semibold">✅ Loaded from static cache!</div>

          {/* Colors */}
          <div>
            <h4 className="font-medium mb-2">Colors:</h4>
            <div className="flex space-x-4">
              {Object.entries(brandData.colors).map(([name, color]) => (
                <div key={name} className="text-center">
                  <div
                    className="w-16 h-16 rounded border"
                    style={{ backgroundColor: color }}
                  ></div>
                  <div className="text-sm mt-1">
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
              <h4 className="font-medium mb-2">Logo:</h4>
              <img
                src={brandData.logo}
                alt={`${brandType} logo`}
                className="w-12 h-12 object-contain"
              />
            </div>
          )}

          {!brandData.logo && (
            <div className="text-gray-500">No logo available (using fallback data)</div>
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
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Brand Provider Status</h3>
      <div className="space-y-1 text-sm">
        <div>Status: {loading ? "Loading..." : isLoaded ? "✅ Loaded" : "❌ Error"}</div>
        <div>Brands Available: {brandCount}</div>
        <div>Data Source: Static cache (generated at build time)</div>
        {error && <div className="text-red-600">Error: {error}</div>}
      </div>
    </div>
  );
}

export default function DebugPage() {
  const brandTypes = ['fourthwall', 'gumroad', 'lemonsqueezy', 'patreon'];
  const { brandsData, loadedCount, totalRequested } = useMultipleBrands(brandTypes);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Debug Tools</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">New Brand Provider System</h2>
            <p className="text-muted-foreground mb-6">
              Testing the new centralized brand provider that loads data from static cache (no API calls!).
            </p>

            <BrandProviderInfo />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Individual Brand Tests</h2>
            <p className="text-muted-foreground mb-4">
              Loaded {loadedCount}/{totalRequested} brands
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brandTypes.map(brandType => (
                <BrandTestCard key={brandType} brandType={brandType} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Performance Benefits</h2>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">✅ What Changed:</h3>
              <ul className="space-y-1 text-sm">
                <li>• <strong>No runtime API calls</strong> - Data loaded from static files</li>
                <li>• <strong>Build-time generation</strong> - Brand data fetched once during build</li>
                <li>• <strong>Instant loading</strong> - No loading states for users</li>
                <li>• <strong>Fallback system</strong> - Graceful degradation when API fails</li>
                <li>• <strong>Centralized provider</strong> - One source of truth for all components</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Usage Commands</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div>
                <strong>Generate brand data:</strong>
                <code className="block mt-1 p-2 bg-black text-green-400 rounded">
                  bun run generate-brands
                </code>
              </div>
              <div>
                <strong>Force regenerate (clear cache):</strong>
                <code className="block mt-1 p-2 bg-black text-green-400 rounded">
                  bun run generate-brands:force
                </code>
              </div>
              <div>
                <strong>Build with brand data:</strong>
                <code className="block mt-1 p-2 bg-black text-green-400 rounded">
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
