'use client'

import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { clearCredentials } from '@/modules/auth/slice'
import { useLogoutMutation } from '@/modules/auth/api'
import Cookies from 'js-cookie'

export const useLogout = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [logout, { isLoading }] = useLogoutMutation()

    const clearAllCookies = () => {
        // Clear cookies with all possible combinations
        const cookieNames = ['access_token', 'refresh_token']
        const paths = ['/', '']
        const domains = [undefined, 'localhost', '']
        const sameSiteOptions = ['Lax', 'Strict', 'None'] as const

        // First try using js-cookie
        cookieNames.forEach((name) => {
            paths.forEach((path) => {
                domains.forEach((domain) => {
                    sameSiteOptions.forEach((sameSite) => {
                        // Try with secure true and false
                        Cookies.remove(name, {
                            path,
                            domain,
                            sameSite,
                            secure: true,
                        })
                        Cookies.remove(name, {
                            path,
                            domain,
                            sameSite,
                            secure: false,
                        })
                    })
                })
            })
        })

        // Then try using document.cookie with all combinations
        cookieNames.forEach((name) => {
            paths.forEach((path) => {
                domains.forEach((domain) => {
                    const domainStr = domain ? `domain=${domain};` : ''
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; ${domainStr}`
                })
            })
        })

        // Finally, try to clear all cookies
        document.cookie.split(';').forEach(function (c) {
            document.cookie = c
                .replace(/^ +/, '')
                .replace(
                    /=.*/,
                    '=;expires=' + new Date().toUTCString() + ';path=/'
                )
        })
    }

    const handleLogout = async () => {
        try {
            // Clear Redux store first
            dispatch(clearCredentials())

            // Clear all cookies before API call
            clearAllCookies()

            // Clear localStorage and sessionStorage
            localStorage.clear()
            sessionStorage.clear()

            // Call logout API
            await logout().unwrap()

            // Clear cookies again after API call
            clearAllCookies()

            // Force clear localStorage and sessionStorage again
            localStorage.clear()
            sessionStorage.clear()

            // Thêm đoạn xóa cookie bằng document.cookie với các option phổ biến
            const cookieNames = ['access_token', 'refresh_token']
            const paths = ['/', '']
            const domains = [
                undefined,
                'localhost',
                window.location.hostname,
                '',
            ]
            cookieNames.forEach((name) => {
                paths.forEach((path) => {
                    domains.forEach((domain) => {
                        let cookieStr = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`
                        if (domain) cookieStr += ` domain=${domain};`
                        document.cookie = cookieStr
                    })
                })
            })

            // Add a flag to prevent any refresh attempts
            localStorage.setItem('isLoggedOut', 'true')

            // Use window.location.href for redirect to ensure full page reload
            window.location.href = '/login'
        } catch (error) {
            console.error('Logout failed:', error)
            // Even if server logout fails, clear all frontend data
            dispatch(clearCredentials())

            // Force clear all cookies
            clearAllCookies()

            // Force clear localStorage and sessionStorage
            localStorage.clear()
            sessionStorage.clear()

            // Thêm đoạn xóa cookie bằng document.cookie với các option phổ biến
            const cookieNames = ['access_token', 'refresh_token']
            const paths = ['/', '']
            const domains = [
                undefined,
                'localhost',
                window.location.hostname,
                '',
            ]
            cookieNames.forEach((name) => {
                paths.forEach((path) => {
                    domains.forEach((domain) => {
                        let cookieStr = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`
                        if (domain) cookieStr += ` domain=${domain};`
                        document.cookie = cookieStr
                    })
                })
            })

            // Add a flag to prevent any refresh attempts
            localStorage.setItem('isLoggedOut', 'true')

            // Force redirect to login page
            window.location.href = '/login'
        }
    }

    return {
        logout: handleLogout,
        isLoggingOut: isLoading,
    }
}
