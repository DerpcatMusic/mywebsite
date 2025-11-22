// app/layout.tsx
import CartDrawer from "@/components/CartDrawer";
import FourthwallScript from "@/components/FourthwallScript";
import Navigation from "@/components/navigation";
import PerformanceMonitor from "@/components/performance/performance-monitor";
import { ThemeProvider } from "@/components/ui/theme-provider";
import SmoothScroll from "@/components/smooth-scroll";
import { BrandProvider } from "@/lib/brand-provider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Outfit, Press_Start_2P, Space_Grotesk, VT323 } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-terminal",
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
        className={`${outfit.variable} ${spaceGrotesk.variable} ${pressStart2P.variable} ${vt323.variable} font-sans antialiased`}
      >
        <SmoothScroll>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <BrandProvider>
              <Navigation />
              {children}
              <CartDrawer />
              <FourthwallScript />
              <PerformanceMonitor />
            </BrandProvider>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
