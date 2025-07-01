'use client'
import { useEffect, useRef } from 'react'
import { useAppDispatch } from '@/redux/hooks'
import { useRefreshTokenMutation } from '@/modules/auth/api'
import { setCredentials, clearCredentials } from '@/modules/auth/slice'
import { useRouter } from 'next/navigation'
import { createLogger } from '@/lib/utils/debugLogger'

// Tạo logger cho useSilentRefresh hook
const authLogger = createLogger('AUTH')

/**
 * Gọi /refresh một lần khi app load đầu tiên
 * Nếu 401 thì logout, nếu thành công thì set credentials
 */
export const useSilentRefresh = (skip = false) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [refresh] = useRefreshTokenMutation()
    const hasChecked = useRef(false)

    useEffect(() => {
        if (skip || hasChecked.current) {
            return
        }

        hasChecked.current = true

        const checkAuth = async () => {
            try {
                authLogger.log('Checking auth status with /refresh...')
                const result = await refresh().unwrap()

                if (result && result.access) {
                    authLogger.log('Auth valid, setting credentials')
                    dispatch(setCredentials({ accessToken: result.access }))
                }
            } catch (error: any) {
                authLogger.log('Auth check failed:', error)

                if (error?.status === 401) {
                    authLogger.log('401 received, logging out')
                    dispatch(clearCredentials())
                    router.push('/login')
                }
            }
        }

        checkAuth()
    }, [skip, refresh, dispatch, router])

    return null
}
