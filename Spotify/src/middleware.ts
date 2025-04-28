import { NextRequest, NextResponse } from 'next/server'

const LOCALES = ['vi', 'en'] as const
const PUBLIC_PATHS = ['/login', '/register']
const DEFAULT_LOCALE = 'vi'

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl

    // Bỏ qua public pages (đã exclude static/api bằng matcher)
    if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next()

    // Kiểm tra locale có hợp lệ?
    const matchedLocale = LOCALES.find(
        (locale) =>
            pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
    )

    if (!matchedLocale) {
        // Chưa có locale => redirect tự động sang locale mặc định
        return NextResponse.redirect(
            new URL(`/${DEFAULT_LOCALE}${pathname}${search}`, request.url)
        )
    }

    // Có locale rồi => check đăng nhập
    const refreshToken = request.cookies.get('refresh_token')
    if (!refreshToken) {
        // Chưa có refresh token => redirect tới trang login
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Lúc này đã có locale và có refresh token => cho qua
    return NextResponse.next()
}

export const config = {
    matcher: [
        // Exclude static, api, favicon
        '/((?!_next/static|_next/image|favicon.ico|api).*)',
    ],
}
