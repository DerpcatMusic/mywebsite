import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Derpcat',
  description: 'Derpcat\'s official music site featuring releases, merch, and more.',
  generator: 'derpcat',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
        <link rel="icon" href="/Derpcat.ico" /> {/* Ensure your favicon is in the public directory */}
    </html>
  )
}
