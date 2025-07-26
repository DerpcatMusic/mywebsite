# Theme Toggle Setup Documentation

This documentation explains how the theme toggle functionality is implemented in your Next.js
application.

## Overview

The theme system uses `next-themes` library with custom animated transitions. It supports light/dark
mode switching with various animation effects.

## Files Structure

```
mywebsite/
├── app/
│   └── layout.tsx                           # Root layout with ThemeProvider
├── components/
│   ├── ui/
│   │   ├── theme-provider.tsx               # Theme provider wrapper
│   │   ├── theme-toggle-button.tsx          # Main theme toggle component
│   │   └── theme-animations.ts              # Animation configurations
│   └── navigation.tsx                       # Example usage in navigation
```

## Installation & Dependencies

The following dependencies are required (already installed in your project):

```json
{
  "next-themes": "latest",
  "lucide-react": "^0.454.0"
}
```

## Setup Instructions

### 1. Root Layout Configuration

Your `app/layout.tsx` has been configured with the ThemeProvider:

```tsx
import { ThemeProvider } from "@/components/ui/theme-provider";

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Using the Theme Toggle Button

Import and use the component anywhere in your application:

```tsx
import ThemeToggleButton from "@/components/ui/theme-toggle-button"

// Basic usage
<ThemeToggleButton />

// With custom props
<ThemeToggleButton
  variant="circle-blur"
  start="top-left"
  showLabel={false}
/>
```

## Component Props

| Prop        | Description                    | Type                                                                               | Default Value   |
| ----------- | ------------------------------ | ---------------------------------------------------------------------------------- | --------------- |
| `variant`   | Animation type                 | `"circle"` \| `"circle-blur"` \| `"polygon"` \| `"gif"`                            | `"circle-blur"` |
| `start`     | Animation starting point       | `"top-left"` \| `"top-right"` \| `"bottom-left"` \| `"bottom-right"` \| `"center"` | `"top-left"`    |
| `url`       | GIF URL (only for gif variant) | `string`                                                                           | `""`            |
| `showLabel` | Show debug labels (dev only)   | `boolean`                                                                          | `false`         |

## Animation Variants

### 1. Circle (`variant="circle"`)

- Simple circular reveal animation
- Works with all `start` positions
- Clean, minimal transition

### 2. Circle Blur (`variant="circle-blur"`)

- Circular reveal with blur effect
- Smooth, modern appearance
- Works with all `start` positions

### 3. Polygon (`variant="polygon"`)

- Geometric diamond-shaped transition
- Dramatic, angular effect
- `start` position affects animation direction

### 4. GIF (`variant="gif"`)

- Custom animation using provided GIF
- Requires `url` prop with GIF URL
- Unique, personalized transitions

## Animation Start Positions

- `"top-left"`: Animation originates from top-left corner
- `"top-right"`: Animation originates from top-right corner
- `"bottom-left"`: Animation originates from bottom-left corner
- `"bottom-right"`: Animation originates from bottom-right corner
- `"center"`: Animation originates from center (works with circle variants)

## Usage Examples

### Navigation Bar

```tsx
// Desktop navigation
<div className="flex items-center space-x-4">
  <ThemeToggleButton variant="circle-blur" start="top-left" />
  <Link href="/about">About</Link>
</div>

// Mobile navigation
<div className="flex flex-col space-y-4">
  <ThemeToggleButton variant="circle" start="center" />
</div>
```

### Header Component

```tsx
export function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <Logo />
      <div className="flex items-center space-x-4">
        <Navigation />
        <ThemeToggleButton variant="polygon" start="top-right" />
      </div>
    </header>
  );
}
```

### Footer Component

```tsx
export function Footer() {
  return (
    <footer className="p-4">
      <div className="flex justify-center">
        <ThemeToggleButton variant="circle-blur" start="bottom-left" />
      </div>
    </footer>
  );
}
```

## CSS Variables & Theming

The component works with Tailwind CSS dark mode classes. Ensure your `tailwind.config.js` includes:

```js
module.exports = {
  darkMode: "class",
  // ... other config
};
```

## Browser Support

- Modern browsers with View Transition API support get animated transitions
- Fallback provided for browsers without View Transition API
- Graceful degradation ensures functionality across all browsers

## Troubleshooting

### Theme not persisting

- Ensure `suppressHydrationWarning` is set on `<html>` element
- Check that ThemeProvider is properly wrapping your app

### Animations not working

- Verify View Transition API support in browser
- Check console for CSS errors
- Ensure theme-animations.ts is properly imported

### Icons not displaying

- Confirm `lucide-react` is installed
- Check for CSS conflicts affecting icon sizing

## Advanced Customization

### Custom Animation

To create custom animations, modify `theme-animations.ts`:

```ts
export const createAnimation = (variant: AnimationVariant, start: AnimationStart, url?: string) => {
  // Add your custom variant logic here
  if (variant === "your-custom-variant") {
    return {
      name: `custom-${start}`,
      css: `/* Your custom CSS */`,
    };
  }
  // ... existing logic
};
```

### Custom Styling

Override default button styles:

```tsx
<ThemeToggleButton variant="circle" className="custom-theme-toggle" />
```

```css
.custom-theme-toggle {
  /* Your custom styles */
}
```

## Performance Notes

- Animations use CSS View Transitions for optimal performance
- No JavaScript animations, leveraging browser optimizations
- Minimal bundle size impact
- Server-side rendering friendly

## Accessibility

- Proper ARIA labels included
- Keyboard navigation support
- Screen reader compatible
- Focus management handled automatically

## Integration with Existing Components

The theme toggle has been integrated into your navigation component (`components/navigation.tsx`) as
an example. You can follow the same pattern for other components in your application.
