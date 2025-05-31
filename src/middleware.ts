import { NextRequest, NextResponse } from 'next/server'
import { ROUTES as r } from '@/lib/routes'
import { jwtVerify } from 'jose'

const LOCALES = ['vi', 'en'] as const
const DEFAULT_LOCALE = 'vi'
const PUBLIC_PAGES = ['login', 'register', 'about', 'contact']
const isPublicPage = (page: string) => PUBLIC_PAGES.includes(page)

const verifyJWT = async (token: string) => {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
        const { payload } = await jwtVerify(token, secret)
        return payload
    } catch (err) {
        return null
    }
}
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

    const token = request.cookies.get('access_token')?.value
    const decoded = token ? await verifyJWT(token) : null

    // 1. Redirect nếu thiếu locale
    if (!LOCALES.some((l) => pathname.startsWith(`/${l}`))) {
        return NextResponse.redirect(
            new URL(`/${DEFAULT_LOCALE}${pathname}${searchParams}`, request.url)
        )
    }

    // 2. Nếu đã login → mà vẫn vào /login, /register → redirect về trang chính
    if (decoded && ['login', 'register'].includes(page)) {
        return NextResponse.redirect(
            new URL(`/${locale}${r.HOME}`, request.url)
        )
    }

    // 3. Trang public → next luôn
    if (isPublicPage(page)) return NextResponse.next()

    // 4. Nếu chưa login → redirect về /login
    if (!decoded) {
        return NextResponse.redirect(
            new URL(`/${locale}${r.LOGIN}`, request.url)
        )
    }

    // 5. Nếu không đủ quyền (ví dụ admin) → redirect 403
    if (pathname.includes(r.ADMIN) && decoded.role !== 'admin') {
        return NextResponse.redirect(
            new URL(`/${locale}${r.FORBIDDEN}`, request.url)
        )
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
