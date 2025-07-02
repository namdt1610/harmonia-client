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
        console.log('[MIDDLEWARE] Current pathname:', pathname)
        console.log('[MIDDLEWARE] Current page:', page)
    }

    // 1. Redirect if missing locale
    if (!LOCALES.some((l) => pathname.startsWith(`/${l}`))) {
        if (isDev) {
            console.log(
                '[MIDDLEWARE] Missing locale, redirecting to default locale'
            )
        }
        return NextResponse.redirect(
            new URL(`/${DEFAULT_LOCALE}${pathname}${searchParams}`, request.url)
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
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
