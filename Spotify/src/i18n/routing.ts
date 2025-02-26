import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
    locales: ['en', 'vi', 'de'],
    defaultLocale: 'vi',
    pathnames: {
        '/': '/',
        '/pathnames': {
            en: '/pathnames',
            vi: '/đường dẫn',
            de: '/pfadnamen',
        },
    },
})

export type Pathnames = keyof typeof routing.pathnames
export type Locale = (typeof routing.locales)[number]

export const { Link, getPathname, redirect, usePathname, useRouter } =
    createNavigation(routing)
