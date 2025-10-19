import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://joke-engine.com'),
  title: 'Joke Engine - AI Comedy Generator | Roasts, Puns, Riddles & Stories',
  description: 'Free AI-powered joke generator creating hilarious roasts, clever puns, brain teasers, and funny stories. Instant comedy content with Google sign-in. No registration required.',
  keywords: 'joke generator, AI comedy, roasts generator, puns generator, riddles generator, funny stories, comedy AI, humor generator, joke maker, comedy content',
  authors: [{ name: 'The Joke Engine Team' }],
  creator: 'The Joke Engine',
  publisher: 'The Joke Engine',
  robots: 'index, follow',
  openGraph: {
    title: 'Joke Engine - AI Comedy Generator | Roasts, Puns, Riddles & Stories',
    description: 'Free AI-powered joke generator creating hilarious roasts, clever puns, brain teasers, and funny stories. Instant comedy content.',
    url: 'https://joke-engine.com',
    siteName: 'Joke Engine',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Joke Engine - AI Comedy Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joke Engine - AI Comedy Generator',
    description: 'Free AI-powered joke generator creating hilarious roasts, clever puns, brain teasers, and funny stories.',
    images: ['/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://joke-engine.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Joke Engine",
    "description": "Free AI-powered joke generator creating hilarious roasts, clever puns, brain teasers, and funny stories",
    "url": "https://joke-engine.com",
    "applicationCategory": "Entertainment",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "AI Roast Generator",
      "Puns Generator", 
      "Riddles Generator",
      "Funny Stories Generator",
      "Google Sign-in",
      "User Statistics"
    ],
    "author": {
      "@type": "Organization",
      "name": "The Joke Engine Team"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "The Joke Engine"
    }
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        {/* Force cache clear - canonical URL fix 2025-10-18 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
