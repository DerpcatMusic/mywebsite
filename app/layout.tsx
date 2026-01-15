// app/layout.tsx
import CartDrawer from "@/components/CartDrawer";
import FourthwallScript from "@/components/FourthwallScript";
import Navigation from "@/components/navigation";
import SmoothScroll from "@/components/smooth-scroll";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { BrandProvider } from "@/lib/brand-provider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Outfit, Pixelify_Sans } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixel",
  weight: ["400"], // Only importing 400 for a lighter, cleaner dotted look? Or 400-700? User said "dotted font is too bold". I'll use 400 and 500.
});

export const metadata: Metadata = {
  title: "Derpcat",
  description:
    "Derpcat's official music site featuring releases, merch, and more.",
  generator: "derpcat",
  icons: {
    icon: "/Derpcat.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body
        suppressHydrationWarning
        className={`${outfit.variable} ${pixelify.variable} bg-background font-sans text-foreground antialiased`}
      >
        <SmoothScroll>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            forcedTheme="dark" // Force Dark Mode as user wants elegant/awwwards usually implies dark
          >
            <BrandProvider>
              <Navigation />
              {children}
              <CartDrawer />
              <FourthwallScript />
            </BrandProvider>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
