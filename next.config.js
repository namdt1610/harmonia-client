// @ts-check

const withNextIntl = require('next-intl/plugin')()

/** @type {import('next').NextConfig} */
const config = {
    // Performance optimizations
    experimental: {
        optimizeCss: true,
        scrollRestoration: true,
        turbo: {
            rules: {
                '*.svg': {
                    loaders: ['@svgr/webpack'],
                    as: '*.js',
                },
            },
        },
    },

    // Compression and optimization
    compress: true,
    poweredByHeader: false,

    // Security headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), payment=()',
                    },
                ],
            },
        ]
    },

    // Image optimization
    images: {
        domains: [
            'localhost',
            '127.0.0.1',
            'i.scdn.co',
            'dailymix-images.scdn.co',
            'mosaic.scdn.co',
            'lineup-images.scdn.co',
            'thisis-images.scdn.co',
            'seeded-session-images.scdn.co',
            'seed-mix-image.spotifycdn.com',
            'charts-images.scdn.co',
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: true,
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
    },

    // Bundle analysis
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Bundle analyzer
        if (process.env.ANALYZE === 'true') {
            try {
                const {
                    BundleAnalyzerPlugin,
                } = require('webpack-bundle-analyzer')
                config.plugins.push(
                    new BundleAnalyzerPlugin({
                        analyzerMode: 'static',
                        openAnalyzer: false,
                    })
                )
            } catch (e) {
                console.warn(
                    'webpack-bundle-analyzer not installed. Install it with: npm install --save-dev webpack-bundle-analyzer'
                )
            }
        }

        // Optimize for production
        if (!dev && !isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    default: false,
                    vendors: false,
                    // Vendor chunk
                    vendor: {
                        name: 'vendor',
                        chunks: 'all',
                        test: /node_modules/,
                        priority: 20,
                    },
                    // Common chunk
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        priority: 10,
                        reuseExistingChunk: true,
                        enforce: true,
                    },
                },
            }
        }

        // SVG optimization
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        })

        return config
    },

    // Environment variables validation
    env: {
        NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
        NEXT_PUBLIC_BUILD_ID: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    },

    // Redirects for SEO
    async redirects() {
        return [
            {
                source: '/home',
                destination: '/',
                permanent: true,
            },
        ]
    },

    // API rewrites for development
    async rewrites() {
        if (process.env.NODE_ENV === 'development') {
            return [
                {
                    source: '/api/:path*',
                    destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/:path*`,
                },
            ]
        }
        return []
    },

    // Output configuration
    output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

    // TypeScript configuration
    typescript: {
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors. Only enable in emergency situations.
        ignoreBuildErrors: false,
    },

    // ESLint configuration
    eslint: {
        // Don't run ESLint during builds in production (CI should handle this)
        ignoreDuringBuilds: process.env.NODE_ENV === 'production',
    },

    // Logging
    logging: {
        fetches: {
            fullUrl: process.env.NODE_ENV === 'development',
        },
    },
}

module.exports = withNextIntl(config)
