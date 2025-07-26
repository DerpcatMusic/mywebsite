"use client";

import { BRAND_DOMAINS, getBrandData, type BrandType } from "@/lib/brand";
import { useEffect, useState } from "react";

interface BrandTestResult {
  brandType: BrandType;
  loading: boolean;
  data: any;
  error: string | null;
  apiRoute?: string;
}

export default function BrandTest() {
  const [results, setResults] = useState<BrandTestResult[]>([]);
  const [testAll, setTestAll] = useState(false);
  const [envCheck, setEnvCheck] = useState<string>("");

  const testDirectAPI = async (brandType: BrandType) => {
    const domain = BRAND_DOMAINS[brandType];
    try {
      const response = await fetch(`/api/brand?brandType=${brandType}`);
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  };

  const testBrand = async (brandType: BrandType) => {
    setResults(prev =>
      prev.map(r =>
        r.brandType === brandType
          ? { ...r, loading: true, error: null }
          : r
      )
    );

    try {
      console.log(`Testing brand.dev API for ${brandType}...`);

      // Test direct API route first
      const apiResult = await testDirectAPI(brandType);
      console.log(`Direct API result for ${brandType}:`, apiResult);

      // Then test through getBrandData function
      const data = await getBrandData(brandType);

      setResults(prev =>
        prev.map(r =>
          r.brandType === brandType
            ? {
                ...r,
                loading: false,
                data,
                error: null,
                apiRoute: apiResult.success ? "✅ API Route OK" : `❌ API Route: ${apiResult.error || 'Unknown error'}`
              }
            : r
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Brand test failed for ${brandType}:`, error);

      setResults(prev =>
        prev.map(r =>
          r.brandType === brandType
            ? {
                ...r,
                loading: false,
                data: null,
                error: errorMessage,
                apiRoute: "❌ getBrandData failed"
              }
            : r
        )
      );
    }
  };

  const testAllBrands = async () => {
    setTestAll(true);
    const brandTypes = Object.keys(BRAND_DOMAINS) as BrandType[];

    for (const brandType of brandTypes) {
      await testBrand(brandType);
    }

    setTestAll(false);
  };

  useEffect(() => {
    // Initialize results
    const brandTypes = Object.keys(BRAND_DOMAINS) as BrandType[];
    setResults(
      brandTypes.map(brandType => ({
        brandType,
        loading: false,
        data: null,
        error: null,
        apiRoute: undefined,
      }))
    );
  }, []);

  const checkEnvVar = async () => {
    try {
      const response = await fetch('/api/brand?brandType=fourthwall');
      if (response.ok) {
        setEnvCheck("✅ API Key working - server can access brand.dev");
      } else {
        const error = await response.json();
        setEnvCheck(`❌ API issue: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      setEnvCheck(`❌ Network error: ${error instanceof Error ? error.message : String(error)}`);
    }
    console.log("Environment check completed");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Brand.dev API Test</h2>

      {/* Environment Check */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Environment Check</h3>
        <button
          onClick={checkEnvVar}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Check Environment
        </button>
        {envCheck && (
          <p className="mt-2 text-sm font-medium">{envCheck}</p>
        )}
        <p className="mt-2 text-sm text-gray-600">
          This tests if the server-side API can access brand.dev
        </p>
      </div>

      {/* Test All Brands */}
      <div className="mb-6">
        <button
          onClick={testAllBrands}
          disabled={testAll}
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {testAll ? "Testing All Brands..." : "Test All Brands"}
        </button>
      </div>

      {/* Individual Brand Tests */}
      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.brandType} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold capitalize">
                {result.brandType} ({BRAND_DOMAINS[result.brandType]})
              </h3>
              <button
                onClick={() => testBrand(result.brandType)}
                disabled={result.loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {result.loading ? "Testing..." : "Test"}
              </button>
            </div>

            {result.loading && (
              <div className="text-blue-600">Loading...</div>
            )}

            {result.apiRoute && (
              <div className="text-sm font-medium mb-2">
                <strong>API Route Status:</strong> {result.apiRoute}
              </div>
            )}

            {result.error && (
              <div className="text-red-600 bg-red-50 p-3 rounded">
                <strong>Error:</strong> {result.error}
              </div>
            )}

            {result.data && (
              <div className="space-y-3">
                <div className="text-green-600 font-semibold">✓ Success!</div>

                {/* Logo */}
                {result.data.logo && (
                  <div>
                    <h4 className="font-medium mb-2">Logo:</h4>
                    <div className="flex items-center space-x-4">
                      <img
                        src={result.data.logo}
                        alt={`${result.brandType} logo`}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          console.error(`Failed to load logo for ${result.brandType}:`, result.data.logo);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <a
                        href={result.data.logo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        {result.data.logo}
                      </a>
                    </div>
                  </div>
                )}

                {/* Colors */}
                {result.data.colors && (
                  <div>
                    <h4 className="font-medium mb-2">Colors:</h4>
                    <div className="flex space-x-4">
                      {Object.entries(result.data.colors).map(([name, color]) => (
                        <div key={name} className="text-center">
                          <div
                            className="w-16 h-16 rounded border"
                            style={{ backgroundColor: color as string }}
                          ></div>
                          <div className="text-sm mt-1">
                            <div className="font-medium capitalize">{name}</div>
                            <div className="text-gray-600">{color as string}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Raw Data */}
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium">Raw Data</summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            {!result.loading && !result.error && !result.data && (
              <div className="text-gray-500">No data - click Test to try</div>
            )}
          </div>
        ))}
      </div>

      {/* Manual cURL Test */}
      <div className="mt-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Manual Tests</h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">1. Test Your API Route:</h4>
            <code className="block p-3 bg-black text-green-400 rounded text-sm overflow-auto">
              curl http://localhost:3000/api/brand?brandType=fourthwall
            </code>
          </div>

          <div>
            <h4 className="font-medium mb-2">2. Test brand.dev Directly (for verification):</h4>
            <code className="block p-3 bg-black text-green-400 rounded text-sm overflow-auto">
              curl -X GET "https://api.brand.dev/v1/brand/retrieve?domain=fourthwall.com" \<br/>
              &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
              &nbsp;&nbsp;-H "Authorization: Bearer brand__3ZKyWqDqsG3STQkuWZofSDv2"
            </code>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>Expected Fix:</strong> The issue was likely that environment variables aren't accessible on the client side in Next.js.</p>
            <p><strong>Solution:</strong> Created a server-side API route at <code>/api/brand</code> that handles the brand.dev API calls with proper environment variable access.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
