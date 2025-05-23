import { NextRequest, NextResponse } from 'next/server'

const LOCALES = ['vi', 'en'] as const
const DEFAULT_LOCALE = 'vi'

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl

    // Kiểm tra locale ở đầu path
    const matchedLocale = LOCALES.find(
        (locale) =>
            pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
    )

    if (!matchedLocale) {
        // Nếu chưa có locale, redirect sang locale mặc định
        return NextResponse.redirect(
            new URL(`/${DEFAULT_LOCALE}${pathname}${search}`, request.url)
        )
    }

    // Đã có locale, check nếu là /vi/login hay /en/register, v.v.
    const pageName = pathname.split('/')[2] // ['', locale, pageName, ...]
    if (['login', 'register'].includes(pageName)) {
        // Các trang này cho phép public, không kiểm tra token
        return NextResponse.next()
    }

    // Các trang khác phải check đăng nhập
    const accessToken = request.cookies.get('access_token')?.value
    if (!accessToken) {
        return NextResponse.redirect(
            new URL(`/${matchedLocale}/login`, request.url)
        )
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        // Exclude static, api, favicon
        '/((?!_next/static|_next/image|favicon.ico|api).*)',
    ],
}
