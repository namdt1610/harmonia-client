import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials, clearAuth } from '@/modules/auth/slice'
import { useCurrentUserQuery } from '@/modules/auth/api'

export function useGlobalAuth() {
    const dispatch = useDispatch()
    const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('access_token') : null
    const { data: user, error } = useCurrentUserQuery(undefined, { skip: !accessToken })

    useEffect(() => {
        if (user && accessToken) {
            dispatch(setCredentials({ user, accessToken }))
        } else if (error) {
            dispatch(clearAuth())
        }
    }, [user, error, accessToken, dispatch])
}