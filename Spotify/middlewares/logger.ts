import { NextRequest, NextResponse } from 'next/server'

export async function withLogging(
    request: NextRequest,
    response: NextResponse
) {
    console.log(`🔍 Request: ${request.method} ${request.nextUrl.pathname}`)
}
