# Brand Integration System

This system automatically fetches and applies brand colors and logos for different platforms
(Fourthwall, Gumroad, LemonSqueezy, Patreon) using the Brand.dev API.

## Setup

1. **Install Brand.dev package** (already installed):

   ```bash
   npm install brand.dev
   ```

2. **Add API Key to environment**: Add your Brand.dev API key to your `.env` file:

   ```env
   BRAND_DEV_API_KEY=your_api_key_here
   ```

3. **Get your API key**:
   - Sign up at [developer.brand.dev](https://developer.brand.dev)
   - Copy your API key from the dashboard

4. **Important**:
   - The system will NOT show fallback colors or logos
   - Cards will only render when real brand data is successfully fetched
   - Check browser console for any API errors

## Usage

### Using the Hook (Recommended)

```tsx
import { useBrand } from "../hooks/use-brand";

function MyComponent() {
  const { brandData, loading, error } = useBrand("fourthwall");

  if (loading) return <div>Loading brand data...</div>;
  if (error) return <div>Error loading brand: {error.message}</div>;

  return (
    <div style={{ color: brandData?.colors.primary }}>
      {brandData?.logo && <img src={brandData.logo} alt="Brand logo" />}
      <h1>{brandData?.title}</h1>
    </div>
  );
}
```

### Using Multiple Brands

```tsx
import { useMultipleBrands } from "../hooks/use-brand";

function MultiPlatformComponent() {
  const { brandsData, loading } = useMultipleBrands([
    "fourthwall",
    "gumroad",
    "lemonsqueezy",
    "patreon",
  ]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {Object.entries(brandsData).map(([brandType, brandData]) => (
        <div key={brandType} style={{ borderColor: brandData?.colors.primary }}>
          {brandData?.logo && <img src={brandData.logo} alt={`${brandType} logo`} />}
          <span>{brandData?.title}</span>
        </div>
      ))}
    </div>
  );
}
```

### Direct API Usage

```tsx
import { getBrandData, getCachedBrandData } from "../lib/brand";

// Get fresh data
const brandData = await getBrandData("fourthwall");

// Get cached data (recommended for better performance)
const cachedBrandData = await getCachedBrandData("gumroad");
```

## Brand Data Structure

```typescript
interface BrandData {
  colors: {
    primary: string; // Main brand color
    secondary: string; // Secondary brand color
    accent: string; // Accent/tertiary color
  };
  logo: string; // Logo URL (required - no fallbacks)
  title: string; // Brand name/title
}
```

## Supported Platforms

- **Fourthwall** (`fourthwall`): Purple theme
- **Gumroad** (`gumroad`): Pink theme
- **LemonSqueezy** (`lemonsqueezy`): Yellow/Orange theme
- **Patreon** (`patreon`): Red/Orange theme

## CSS Integration

The system provides CSS variables for easy styling:

```tsx
import { generateBrandCSS } from "../lib/brand";

// Generate CSS variables
const cssVars = generateBrandCSS(brandData, "brand");
// Outputs:
// --brand-primary: #9333ea;
// --brand-secondary: #7c3aed;
// --brand-accent: #8b5cf6;
// --brand-primary-rgb: 147, 51, 234;
// --brand-secondary-rgb: 124, 58, 237;
// --brand-accent-rgb: 139, 92, 246;
```

Use in styled-jsx:

```tsx
<style jsx>{`
  .my-component {
    ${generateBrandCSS(brandData)}
    background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%);
    border: 1px solid rgba(var(--brand-primary-rgb), 0.3);
  }
`}</style>
```

## No Fallback System

This system does NOT use fallback colors or logos. Cards will only render when:

- Brand.dev API is accessible and configured
- API returns valid brand data with at least 3 colors
- API returns a valid logo URL
- If any requirement fails, the card will not render

Check browser console for specific error messages if cards don't appear.

## Performance

- **Caching**: Brand data is automatically cached to prevent repeated API calls
- **Lazy Loading**: Brands are only fetched when needed
- **Error Handling**: Graceful fallbacks ensure the UI always works

## Examples in the Codebase

- **ProductCard**: Shows Fourthwall branding with logo overlay
- **AltProductCard**: Shows dynamic branding based on product platform
- Both components demonstrate the logo overlay in the top-left corner and dynamic color theming

## Troubleshooting

1. **Cards not rendering at all**:
   - Check your API key in `.env` file
   - Ensure `BRAND_DEV_API_KEY` is set correctly
   - Check browser console for API errors

2. **"Brand.dev client not available" error**:
   - API key is missing or invalid
   - Check environment variable setup

3. **"Insufficient color data" error**:
   - Brand.dev returned less than 3 colors for the domain
   - This is a data issue on Brand.dev's side

4. **"No logo found" error**:
   - Brand.dev has no logo data for the domain
   - Check if the company has logo data available on Brand.dev

5. **API connection errors**:
   - Check network connectivity
   - Verify Brand.dev service status
   - Check for rate limiting (429 errors)

6. **Logo images appearing as black squares**:
   - CORS issues with logo URLs
   - Invalid or broken logo URLs from API
   - Check browser console for image loading errors

## API Rate Limits & Performance

Brand.dev has rate limits. The caching system helps minimize API calls:

- Data is cached in memory per brand type
- Only one API call per brand type per session
- For production applications, consider:
  - Pre-fetching brand data at build time
  - Using a server-side cache (Redis, etc.)
  - Implementing your own brand data storage

## LemonSqueezy Image Quality

The system now fetches `large_thumb_url` first, then falls back to `thumb_url` for better image
quality.

## Brand Logo Debugging

If logos appear as black squares:

1. Check browser console for CORS errors
2. Verify logo URLs are accessible
3. Test logo URLs directly in browser
4. Some SVG logos may have styling issues - check for fill/stroke attributes
