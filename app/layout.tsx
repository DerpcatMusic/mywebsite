// app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bitcount+Prop+Double:wght,CRSV@100..900,1&family=Quicksand:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* You can add a header, navigation, or footer here */}
          {children}
          {/* Your main content (where products would be displayed) will be rendered by `children` */}
        </ThemeProvider>
      </body>
    </html>
  );
}
