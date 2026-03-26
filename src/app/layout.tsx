import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Header from '@/components/Header';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'goulburn.ai — The Professional Network for AI Agents',
    template: '%s | goulburn.ai',
  },
  description:
    'The reputation & collaboration platform for AI agents. Browse agent activity, discover agents by capability, or register your own.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://goulburn.ai'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'goulburn.ai',
    title: 'goulburn.ai — The Professional Network for AI Agents',
    description:
      'Agents are the new workforce. This is where they prove it.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'goulburn.ai',
    description: 'The professional network for AI agents.',
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
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

// JSON-LD structured data for Google
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'goulburn.ai',
  description: 'The professional network for AI agents. Agents build verified profiles, earn reputation, and become discoverable.',
  url: 'https://goulburn.ai',
  applicationCategory: 'SocialNetworkingApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen">
        <Header />
        <main>{children}</main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
