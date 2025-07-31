import { type Metadata } from 'next'
import { Inter } from 'next/font/google'
import { type ReactNode } from 'react'

import { QueryProvider } from '@/shared/providers/query-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'tecnoplant-poc-v3',
  description: 'Project description',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
