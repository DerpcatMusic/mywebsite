// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Derpcat',
  description: 'Derpcat\'s official music site featuring releases, merch, and more.',
  generator: 'derpcat',
  icons: {
    icon: '/Derpcat.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {/* You can add a header, navigation, or footer here */}
        {children}
        {/* Your main content (where products would be displayed) will be rendered by `children` */}
      </body>
    </html>
  )
}