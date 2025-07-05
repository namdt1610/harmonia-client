import { NextRequest, NextResponse } from 'next/server'
import { ROUTES as r } from '@/lib/routes'

const LOCALES = ['vi', 'en'] as const
const DEFAULT_LOCALE = 'vi'
const PUBLIC_PAGES = [
    'login',
    'register',
    'about',
    'contact',
    'forgot-password',
    'google-sync',
]
const isPublicPage = (page: string) => PUBLIC_PAGES.includes(page)
const isDev = process.env.NODE_ENV === 'development'

/**
 ** middleware.ts: Simplified middleware for hybrid auth system
 ** - Basic route protection using cookies (no strict validation)
 ** - Client-side Redux handles detailed auth state management
 ** - Prevents logout inconsistency by letting client handle auth details
 ** - Server-side logout endpoint clears HTTP-only cookies properly
 */
export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl
    const pathnameParts = pathname.split('/')
    const locale =
        LOCALES.find((loc) => pathname.startsWith(`/${loc}`)) ?? DEFAULT_LOCALE
    const page = pathnameParts[2] || ''

    if (isDev) {
        console.log('[MIDDLEWARE] ===== REQUEST DEBUG =====')
        console.log('[MIDDLEWARE] Current pathname:', pathname)
        console.log('[MIDDLEWARE] Request URL:', request.url)
        console.log('[MIDDLEWARE] Method:', request.method)
        console.log(
            '[MIDDLEWARE] User-Agent:',
            request.headers.get('user-agent')
        )
        console.log(
            '[MIDDLEWARE] Request headers referer:',
            request.headers.get('referer')
        )
        console.log('[MIDDLEWARE] Accept:', request.headers.get('accept'))
        console.log('[MIDDLEWARE] Current page:', page)
        console.log('[MIDDLEWARE] Search params:', searchParams.toString())
        console.log('[MIDDLEWARE] ========================')
    }

    // Skip middleware for static assets, API routes, and special Next.js paths
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/favicon') ||
        pathname.includes('.') ||
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml' ||
        pathname === '/' // Skip root path completely - Next.js redirects will handle
    ) {
        if (isDev) {
            console.log('[MIDDLEWARE] Skipping:', pathname)
        }
        return NextResponse.next()
    }

    // 1. Redirect if missing locale
    if (!LOCALES.some((l) => pathname.startsWith(`/${l}`))) {
        if (isDev) {
            console.log(
                '[MIDDLEWARE] Missing locale, redirecting to default locale'
            )
            console.log('[MIDDLEWARE] Original pathname:', pathname)
            console.log(
                '[MIDDLEWARE] Will redirect to:',
                `/${DEFAULT_LOCALE}${pathname}`
            )
        }
        // For non-root paths, add default locale
        const redirectPath = `/${DEFAULT_LOCALE}${pathname}`
        return NextResponse.redirect(
            new URL(`${redirectPath}${searchParams}`, request.url)
        )
    }

    // 2. Public pages → allow access regardless of auth status
    if (isPublicPage(page)) {
        if (isDev) {
            console.log('[MIDDLEWARE] Public page, allowing access')
        }
        return NextResponse.next()
    }

    // 3. Check for basic token presence (simple route protection)
    const accessToken = request.cookies.get('access_token')?.value
    const refreshToken = request.cookies.get('refresh_token')?.value
    const hasAnyToken = !!(accessToken || refreshToken)

    // 4. For auth pages (login/register) - redirect if has tokens
    if (['login', 'register'].includes(page)) {
        if (hasAnyToken) {
            if (isDev) {
                console.log(
                    '[MIDDLEWARE] Has tokens but on auth page, redirecting to home'
                )
            }
            return NextResponse.redirect(
                new URL(`/${locale}${r.HOME}`, request.url)
            )
        }

        if (isDev) {
            console.log('[MIDDLEWARE] No tokens on auth page, allowing access')
        }
        return NextResponse.next()
    }

    // 5. For protected routes - require at least one token
    if (!hasAnyToken) {
        if (isDev) {
            console.log(
                '[MIDDLEWARE] No tokens for protected route, redirecting to login'
            )
        }
        return NextResponse.redirect(
            new URL(`/${locale}${r.LOGIN}`, request.url)
        )
    }

    // 6. Has tokens and accessing protected route → allow access
    // Let client-side handle detailed auth validation and state management
    if (isDev) {
        console.log(
            '[MIDDLEWARE] Has tokens, allowing access to protected route'
        )
    }
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon (favicon files)
         * - Files with extensions
         */
        '/((?!api/|_next/static|_next/image|favicon|.*\\.[^/]+$).*)',
    ],
}
