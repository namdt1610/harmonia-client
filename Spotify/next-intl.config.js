// next-intl.config.js
/**
 * @type {import('next-intl').Config}
 */
const config = {
    locales: ['en', 'vi'],
    defaultLocale: 'vi',
    pages: {
        '*': ['HomePage'],
    },
    localePrefix: 'as-needed',
    localeDetection: false,
}

export default config
