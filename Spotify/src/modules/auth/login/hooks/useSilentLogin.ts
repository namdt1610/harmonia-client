// src/hooks/useSilentLogin.ts
'use client'
import { useEffect } from 'react'
import { useAppDispatch } from '@/redux/hooks' // hoặc '@/store/hooks', tuỳ cấu trúc
import { useRefreshTokenMutation } from '@/modules/auth/api'
import { setCredentials, clearAuth } from '@/modules/auth/slice'

export function useSilentLogin() {
    const dispatch = useAppDispatch()
    const [refresh, { isLoading }] = useRefreshTokenMutation()

    useEffect(() => {
        let isMounted = true
        const run = async () => {
            try {
                const res = await refresh().unwrap()
                if (isMounted && res?.accessToken) {
                    dispatch(
                        setCredentials({
                            accessToken: res.accessToken,
                            user: res.user,
                        })
                    )
                }
            } catch (err) {
                dispatch(clearAuth())
                // Nếu không có refreshToken hoặc bị lỗi (mất session)
                // Có thể redirect về login ở đây nếu muốn
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
