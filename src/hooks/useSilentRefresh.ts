'use client'
import { useEffect, useRef } from 'react'
import { useAppDispatch } from '@/redux/hooks'
import { useRefreshTokenMutation } from '@/modules/auth/api'
import { setCredentials, clearCredentials } from '@/modules/auth/slice'
import { useRouter } from 'next/navigation'

/**
 ** Dùng để refresh token một cách ẩn danh, không cần giao diện
 ** Nếu token hết hạn, sẽ tự động refresh token và cập nhật lại credentials
 ** Nếu refresh token thất bại, sẽ clear credentials và redirect về trang login
 */
export const useSilentRefresh = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [refresh] = useRefreshTokenMutation()
    const isMounted = useRef(false)

    useEffect(() => {
        console.log('useSilentRefresh mounted')
        isMounted.current = true
        return () => {
            console.log('useSilentRefresh unmounted')
            isMounted.current = false
        }
    }, [])

    const refreshToken = async () => {
        console.log('Attempting to refresh token...')
        try {
            const res: RefreshResponse = await refresh().unwrap()
            console.log('Token refresh successful:', res)
            if (isMounted.current && res?.user) {
                console.log('Setting credentials in Redux store:', res.user)
                dispatch(setCredentials({ user: res.user }))
            } else {
                console.log(
                    'Not setting credentials - component unmounted or no user data'
                )
            }
        } catch (err) {
            console.error('Token refresh failed:', err)
            console.log('Clearing credentials and redirecting to login')
            dispatch(clearCredentials())
            router.push('/login')
        }
    }

    return refreshToken
}
