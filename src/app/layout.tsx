import './globals.css'
import { ReactNode } from 'react'
import { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'sonner'

import { Providers } from '@/components/shared/Providers'
import { getMessages } from 'next-intl/server'

type Props = {
    children: ReactNode
    params: { locale: string }
}

export const metadata: Metadata = {
    title: {
        default: 'Harmonia',
        template: '%s | Harmonia',
    },
    description:
        'Enterprise-grade music streaming platform with advanced features',
    keywords: ['music', 'streaming', 'audio', 'playlist', 'enterprise'],
    authors: [{ name: 'Harmonia Team' }],
    creator: 'Harmonia Team',
    publisher: 'Harmonia',
    icons: {
        icon: '/favicon.svg',
        shortcut: '/favicon.svg',
        apple: '/favicon.svg',
    },
    metadataBase: process.env.NEXT_PUBLIC_APP_URL
        ? new URL(process.env.NEXT_PUBLIC_APP_URL)
        : undefined,
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: process.env.NEXT_PUBLIC_APP_URL,
        siteName: 'Harmonia',
        title: 'Harmonia - Enterprise Music Streaming',
        description:
            'Enterprise-grade music streaming platform with advanced features',
        images: [
            {
                url: '/images/default-cover.webp',
                width: 1200,
                height: 630,
                alt: 'Harmonia Music Platform',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Harmonia - Enterprise Music Streaming',
        description:
            'Enterprise-grade music streaming platform with advanced features',
        images: ['/images/default-cover.webp'],
    },
    robots: {
        index: process.env.NODE_ENV === 'production',
        follow: process.env.NODE_ENV === 'production',
        googleBot: {
            index: process.env.NODE_ENV === 'production',
            follow: process.env.NODE_ENV === 'production',
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
}

export default async function RootLayout({ children, params }: Props) {
    const locale = params?.locale || 'en'
    const messages = await getMessages({ locale })

    return (
        <html lang={locale} className="dark" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} />
                <link
                    rel="dns-prefetch"
                    href={process.env.NEXT_PUBLIC_API_URL}
                />
            </head>
            <body className="min-h-screen bg-background font-sans antialiased">
                <Providers locale={locale} messages={messages}>
                    {children}
                </Providers>

                {/* Toast notifications */}
                <Toaster
                    position="top-center"
                    richColors
                    expand
                    visibleToasts={5}
                    duration={4000}
                />

                {/* Analytics (only in production) */}
                {process.env.NODE_ENV === 'production' && (
                    <>
                        <Analytics />
                        <SpeedInsights />
                    </>
                )}
            </body>
        </html>
    )
}
