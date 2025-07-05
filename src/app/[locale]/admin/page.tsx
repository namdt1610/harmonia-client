'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function AdminPage() {
    const router = useRouter()
    const params = useParams()
    const locale = params.locale as string

    useEffect(() => {
        router.replace(`/${locale}/admin/dashboard`)
    }, [router, locale])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">
                    Redirecting to dashboard...
                </p>
            </div>
        </div>
    )
}
