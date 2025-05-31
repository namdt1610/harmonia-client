'use client'
import { useEffect } from 'react'
import { useAppDispatch } from '@/redux/hooks'
import { useRefreshTokenMutation } from '@/modules/auth/api'
import { setCredentials, clearCredentials } from '@/modules/auth/slice'
import { useRouter } from 'next/navigation'

/**
 ** Dùng để refresh token một cách ẩn danh, không cần giao diện
 ** Nếu token hết hạn, sẽ tự động refresh token và cập nhật lại credentials
 ** Nếu refresh token thất bại, sẽ clear credentials và redirect về trang login
 */
export function useSilentRefresh() {
    const dispatch = useAppDispatch()
    const [refresh, { isLoading }] = useRefreshTokenMutation()
    const router = useRouter()
    useEffect(() => {
        let isMounted = true
        const run = async () => {
            try {
                const res:RefreshResponse = await refresh().unwrap()
                if (isMounted && res?.user) {
                    dispatch(setCredentials({ user: res.user }))
                }
            } catch (err) {
                dispatch(clearCredentials())
                // Nếu không có refreshToken hoặc bị lỗi (mất session)
                // Có thể redirect về login ở đây nếu muốn
                router.push('/login')
            }
        }
        run()
        return () => {
            isMounted = false
        }
        // eslint-disable-next-line
    }, [dispatch, refresh])

    return { isLoading }
}
