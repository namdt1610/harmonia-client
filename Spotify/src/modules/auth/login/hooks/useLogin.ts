import { useLoginMutation, useGoogleLoginMutation } from '@/modules/auth/api'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/modules/auth/slice'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const useLogin = () => {
    const [login, { isLoading, isError, isSuccess }] = useLoginMutation()
    const [googleLogin, { isLoading: isGoogleLoading }] =
        useGoogleLoginMutation()
    const dispatch = useDispatch()
    const router = useRouter()

    const handleLogin = async (username_or_email: string, password: string) => {
        try {
            const result = await login({ username_or_email, password }).unwrap()
            dispatch(
                setCredentials({
                    accessToken: result.access,
                    user: result.user,
                })
            )
            router.push('/')
            return result
        } catch (error: any) {
            throw error
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
