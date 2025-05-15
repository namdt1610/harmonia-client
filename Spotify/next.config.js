// @ts-check

const withNextIntl = require('next-intl/plugin')()

/** @type {import('next').NextConfig} */
const config = {
    async rewrites() {
        return [
            // Tất cả request có đường dẫn bắt đầu bằng /api sẽ proxy qua backend Django của bạn
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*', // Chuyển đến đúng server Django dev
            },
        ]
    },
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
