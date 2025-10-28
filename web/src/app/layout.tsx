import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ResponsiveHeader } from '../components/ResponsiveHeader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MicroPlay Hub',
  description: 'Social platform for 60-second browser micro-games',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ResponsiveHeader />
        <main>{children}</main>
      </body>
    </html>
  )
}