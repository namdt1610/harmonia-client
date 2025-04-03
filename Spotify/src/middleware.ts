import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl

    const locales = ['vi', 'en']
    if (locales.some(locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))) {
        return NextResponse.next()
    }

    if (
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/api/') ||
        pathname.startsWith('/favicon.ico')
    ) {
        return NextResponse.next()
    }

    const defaultLocale = 'vi'
    const newUrl = new URL(`/${defaultLocale}${pathname}${search}`, request.url)

    return NextResponse.redirect(newUrl)
}

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico|api).*)',
}

