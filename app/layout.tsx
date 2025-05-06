import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nuzlocke Tracker',
  description: 'Para trackear los muchos nuzlocke que vendran y guardarlo para la posteridad!!',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
