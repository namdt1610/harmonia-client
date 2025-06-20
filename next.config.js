// @ts-check

const withNextIntl = require('next-intl/plugin')()

/** @type {import('next').NextConfig} */
const config = {
    // async rewrites() {
    //     // return [
    //     //     // Proxy API requests to the backend
    //     //     {
    //     //         source: '/api/:path*',
    //     //         destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/:path*`,
    //     //     },
    //     // ]
    // },
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
        formats: ['image/webp'],
    },
}

module.exports = withNextIntl(config)
