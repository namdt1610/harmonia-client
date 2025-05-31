import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials, clearCredentials } from '@/modules/auth/slice'
import { useCurrentUserQuery } from '@/modules/auth/api'

/*
 * Hàm này để lấy thông tin user và set vào Redux store
 * Nếu lấy thông tin user thất bại, sẽ clear Redux store
 */
export function useGlobalAuth() {
    const dispatch = useDispatch()
    const { data: user, error } = useCurrentUserQuery()

    useEffect(() => {
        if (user) {
            dispatch(setCredentials({ user }))
        } else if (error) {
            dispatch(clearCredentials())
        }
    }, [user, error, dispatch])
}
