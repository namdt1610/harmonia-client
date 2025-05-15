import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials, clearAuth } from '@/modules/auth/slice'
import { useCurrentUserQuery } from '@/modules/auth/api'

export function useGlobalAuth() {
    const dispatch = useDispatch()
    const { data: user, error } = useCurrentUserQuery()

    useEffect(() => {
        if (user) {
            dispatch(setCredentials({ user, accessToken: '' }))
        } else if (error) {
            dispatch(clearAuth())
        }
    }, [user, error, dispatch])
}
