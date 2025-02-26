import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function withAuth(request: NextRequest, response: NextResponse) {
    const token = await getToken({ req: request })
    const isProtected = request.nextUrl.pathname.startsWith('/dashboard')

    if (!token && isProtected) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
}
