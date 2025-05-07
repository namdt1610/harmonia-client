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
}

module.exports = withNextIntl(config)
