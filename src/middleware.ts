import { NextRequest, NextResponse } from 'next/server'
import { ROUTES as r } from '@/lib/routes'

const LOCALES = ['vi', 'en'] as const
const DEFAULT_LOCALE = 'vi'
const PUBLIC_PAGES = ['login', 'register', 'about', 'contact']
const isPublicPage = (page: string) => PUBLIC_PAGES.includes(page)

/**
 ** middleware.ts: Chạy ở Edge Middleware (Next.js backend, trước SSR/CSR)
 ** Middleware để xử lý locale và redirect
 ** Nếu không có locale, redirect sang locale mặc định
 ** Nếu là /vi/login hay /en/register, v.v. thì cho phép public
 ** Các trang khác thì kiểm tra token
 ** @request.nextUrl: là đặc sản của Next.js middleware
 ** nó tích sẵn url, giúp bạn phân tích URL một cách tiện lợi, thay vì phải parse string thủ công như ngày xưa.
 ** @pathname: là phần path của URL
 ** @searchParams: là phần query của URL, ví dụ: /?page=1&limit=10
 ** @pathnameParts: là phần path của URL được tách thành một mảng
 ** @locale: là locale của URL
 ** @page: là phần path của URL
 ** @token: là token của user
 */
export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl
    const pathnameParts = pathname.split('/')
    const locale =
        LOCALES.find((loc) => pathname.startsWith(`/${loc}`)) ?? DEFAULT_LOCALE
    const page = pathnameParts[2] || ''

    console.log('Current pathname:', pathname)
    console.log('Current page:', page)

    const token = request.cookies.get('access_token')?.value
    console.log('Access token from cookie:', token)

    // 1. Redirect nếu thiếu locale
    if (!LOCALES.some((l) => pathname.startsWith(`/${l}`))) {
        console.log('Missing locale, redirecting to default locale')
        return NextResponse.redirect(
            new URL(`/${DEFAULT_LOCALE}${pathname}${searchParams}`, request.url)
        )
    }

    // 2. Nếu đã login → mà vẫn vào /login, /register → redirect về trang chính
    if (token && ['login', 'register'].includes(page)) {
        console.log('Already logged in, redirecting to home')
        return NextResponse.redirect(
            new URL(`/${locale}${r.HOME}`, request.url)
        )
    }

    // 3. Trang public → next luôn
    if (isPublicPage(page)) {
        console.log('Public page, allowing access')
        return NextResponse.next()
    }

    // 4. Nếu chưa login → redirect về /login
    if (!token) {
        console.log('No token, redirecting to login')
        return NextResponse.redirect(
            new URL(`/${locale}${r.LOGIN}`, request.url)
        )
    }

    console.log('Access granted')
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
