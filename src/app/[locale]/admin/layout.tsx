'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAppSelector } from '@/redux/hooks'
import { useGlobalAuth } from '@/hooks/useGlobalAuth'
import AdminSidebar from '@/modules/admin/components/AdminSidebar'
import AdminHeader from '@/modules/admin/components/AdminHeader'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const params = useParams()
    const locale = params.locale as string
    const { user, isLoggedIn } = useAppSelector((state) => state.auth)
    const [isClient, setIsClient] = useState(false)

    // Use the global auth system instead of a separate query
    const { isLoading, currentUser, error } = useGlobalAuth()

    // Ensure we only access localStorage on the client
    useEffect(() => {
        setIsClient(true)
    }, [])

    // Debug logging - only on client
    useEffect(() => {
        if (!isClient) return

        console.log('Admin Layout Debug:', {
            isLoggedIn,
            user,
            is_superuser: user?.is_superuser,
            userString: JSON.stringify(user),
            currentUser,
            error,
            isLoading,
            localStorage: {
                userLoggedIn: localStorage.getItem('userLoggedIn'),
                isLoggedOut: localStorage.getItem('isLoggedOut'),
            },
        })
    }, [isClient, isLoggedIn, user, currentUser, error, isLoading])

    // Only redirect if we're sure the user doesn't have access
    // Wait for both loading to complete AND Redux state to be properly set
    useEffect(() => {
        if (!isClient) return // Don't redirect during SSR

        // Don't redirect while still loading or if we don't have user data yet
        if (isLoading) {
            console.log('Admin Layout: Still loading, waiting...')
            return
        }

        // If there was an error fetching user data, user is not authenticated
        if (error) {
            console.log('Admin Layout: Auth error, redirecting to home')
            router.push(`/${locale}`)
            return
        }

        // Only redirect if we're certain about the auth state
        // Check both Redux state and currentUser from API
        const hasValidUser = user || currentUser
        const isSuperUser = user?.is_superuser || currentUser?.is_superuser

        if (!isLoggedIn && !currentUser) {
            console.log('Admin Layout: No auth data, redirecting to home')
            router.push(`/${locale}`)
            return
        }

        if (hasValidUser && !isSuperUser) {
            console.log('Admin Layout: User not superuser, redirecting to home')
            router.push(`/${locale}`)
            return
        }

        if (isLoggedIn && hasValidUser && isSuperUser) {
            console.log('Admin Layout: Admin access granted!')
        }
    }, [
        isClient,
        isLoggedIn,
        user,
        currentUser,
        error,
        isLoading,
        router,
        locale,
    ])

    // Show loading while checking auth or during SSR hydration
    if (!isClient || isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">
                        {!isClient
                            ? 'Loading...'
                            : 'Checking admin privileges...'}
                    </p>
                </div>
            </div>
        )
    }

    // Show error state
    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-destructive">
                        Authentication Error
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Unable to verify your credentials
                    </p>
                    <div className="mt-4 text-sm text-muted-foreground">
                        Please try logging in again
                    </div>
                </div>
            </div>
        )
    }

    // Check final access permissions
    const hasValidUser = user || currentUser
    const isSuperUser = user?.is_superuser || currentUser?.is_superuser

    if (!isLoggedIn && !currentUser) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-destructive">
                        Access Denied
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        You need to be logged in to access this area
                    </p>
                </div>
            </div>
        )
    }

    if (hasValidUser && !isSuperUser) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-destructive">
                        Access Denied
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        You don't have admin privileges
                    </p>
                    <div className="mt-4 text-sm text-muted-foreground">
                        Debug: isLoggedIn={String(isLoggedIn)}, is_superuser=
                        {String(isSuperUser)}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-background">
            <AdminSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-auto">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
