// app/layout.tsx
import { ThemeProvider } from "@/components/ui/theme-provider";
import { BrandProvider } from "@/lib/brand-provider";
import Navigation from "@/components/navigation"; // Import Navigation component
import PerformanceMonitor from "@/components/performance/performance-monitor";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
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
      <body className={`${quicksand.variable} font-body`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BrandProvider>
            <Navigation /> {/* Added Navigation component here */}
            {children}
            <PerformanceMonitor />
          </BrandProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
