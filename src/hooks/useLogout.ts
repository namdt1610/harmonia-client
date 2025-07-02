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

    const handleLogout = async () => {
        try {
            // 1. Clear Redux state FIRST to update UI immediately
            dispatch(clearCredentials())

            // 2. Update localStorage to mark user as logged out
            localStorage.setItem('isLoggedOut', 'true')
            localStorage.removeItem('userLoggedIn')

            // 3. Call server logout endpoint to clear HTTP-only cookies
            // This is the MOST IMPORTANT step for clearing server-side tokens
            await logout().unwrap()

            console.log(
                'Server logout successful - HTTP-only cookies should be cleared'
            )
        } catch (error) {
            console.error('Server logout failed:', error)
            // Even if server logout fails, we continue with client-side cleanup
        }

        try {
            // 4. Client-side cookie cleanup as fallback (for non-HTTP-only cookies)
            const cookieNames = ['access_token', 'refresh_token']
            cookieNames.forEach((name) => {
                // Try js-cookie first
                Cookies.remove(name, { path: '/' })
                Cookies.remove(name, { path: '/', domain: 'localhost' })
                Cookies.remove(name, { path: '/', domain: '' })

                // Try document.cookie as fallback
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=localhost;`
            })
        } catch (error) {
            console.warn('Client-side cookie cleanup failed:', error)
            // This is not critical since server should have cleared HTTP-only cookies
        }

        // 5. Navigate to login page
        router.push('/login')

        // 6. Optional: Force page reload to ensure clean state
        // Uncomment if you experience any state persistence issues
        // setTimeout(() => {
        //     window.location.href = '/login'
        // }, 100)
    }

    return {
        handleLogout,
        isLoading,
    }
}
