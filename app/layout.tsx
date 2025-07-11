// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Derpcat',
  description: 'Derpcat\'s official music site featuring releases, merch, and more.',
  generator: 'derpcat',
  // ADD THIS BLOCK FOR YOUR FAVICON
  icons: {
    icon: '/Derpcat.ico', // This path correctly points to your favicon in the public directory
    // You can add apple: '/apple-touch-icon.png', etc. if needed
  },
}

export default function RootLayout({
  children,
}: Readonly<{
children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
      {/* REMOVE THE FOLLOWING LINE: */}
      {/* <link rel="icon" href="/Derpcat.ico" /> */}
    </html>
  )
}