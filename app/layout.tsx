import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { LayoutContent } from './layout-content'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JetGlass - Solutions Vitrées Sur Mesure',
  description: 'Spécialiste en solutions vitrées sur mesure depuis plus de 20 ans. Devis gratuit, fabrication française, installation professionnelle.',
  keywords: 'verrerie, vitrage, sur mesure, devis, installation, France, JetGlass',
  authors: [{ name: 'JetGlass' }],
  creator: 'JetGlass',
  publisher: 'JetGlass',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://jetglass.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'JetGlass - Solutions Vitrées Sur Mesure',
    description: 'Spécialiste en solutions vitrées sur mesure depuis plus de 20 ans',
    url: 'https://jetglass.com',
    siteName: 'JetGlass',
    images: [
      {
        url: '/images/JetGlass.png',
        width: 1200,
        height: 630,
        alt: 'JetGlass Logo',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JetGlass - Solutions Vitrées Sur Mesure',
    description: 'Spécialiste en solutions vitrées sur mesure depuis plus de 20 ans',
    images: ['/images/JetGlass.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  )
}
