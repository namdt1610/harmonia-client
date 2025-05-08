import { useLoginMutation, useGoogleLoginMutation } from '@/modules/auth/api'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/modules/auth/slice'
import { signIn } from 'next-auth/react'
export const useLogin = () => {
    const [login, { isLoading, isError, isSuccess }] = useLoginMutation()
    const [googleLogin, { isLoading: isGoogleLoading }] =
        useGoogleLoginMutation()
    const dispatch = useDispatch()

    const handleLogin = async (username_or_email: string, password: string) => {
        try {
            const result = await login({ username_or_email, password }).unwrap()
            dispatch(
                setCredentials({
                    accessToken: result.access,
                    user: result.user,
                })
            )
            sessionStorage.setItem('access_token', result.access)
            return result
        } catch (error: any) {
            // Có thể lấy error.data.detail nếu backend trả về
            throw error // Cho phép hàm cha biết là lỗi (optional)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            signIn('google', { callbackUrl: '/dashboard' })

            const result = await googleLogin().unwrap()
            dispatch(
                setCredentials({
                    accessToken: result.access,
                    user: result.user,
                })
            )
            sessionStorage.setItem('access_token', result.access)
            return result
        } catch (error: any) {
            throw error
        }
    }

    return {
        handleLogin,
        handleGoogleLogin,
        isLoading,
        isError,
        isSuccess,
        isGoogleLoading,
    }
}
