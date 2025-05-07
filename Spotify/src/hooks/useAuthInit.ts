import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/modules/auth/slice'

export function useAuthInit() {
    const dispatch = useDispatch()
    useEffect(() => {
        const accessToken = sessionStorage.getItem('access_token')
        if (accessToken) {
            dispatch(setCredentials({ accessToken, user: null }))
        }
    }, [dispatch])
}
