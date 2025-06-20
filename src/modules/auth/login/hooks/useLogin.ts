import { signIn } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/modules/auth/slice'
import { useLoginMutation } from '@/modules/auth/api'
import { isFetchBaseQueryError } from '@/lib/apiError'
import { LoginResponse } from '../../types'
import { logger } from '@/lib/utils/logger'

export const useLogin = () => {
    const [login, { isLoading, isError, isSuccess }] = useLoginMutation()
    const dispatch = useDispatch()

    /*
     * Hàm này đã try/catch, nên không cần try/catch ở component
     * Promise nghĩa là hàm này sẽ trả về một Promise, Promise là một object có 3 trạng thái: pending, fulfilled, rejected
     * pending: hàm này đang chạy
     * fulfilled: hàm này đã hoàn thành
     * rejected: hàm này đã bị lỗi
     * Promise có 2 method: then và catch
     * then: dùng để xử lý kết quả của hàm sau khi nó hoàn thành
     * catch: dùng để xử lý lỗi của hàm sau khi nó bị lỗi
     */
    const handleLogin = async (
        username_or_email: string,
        password: string
    ): Promise<boolean> => {
        try {
            logger.info('[auth/login] Calling API')
            logger.info('[auth/login] Username or email:', username_or_email)
            const result: LoginResponse = await login({
                username_or_email,
                password,
            }).unwrap()
            logger.info('[auth/login] Login successful')
            // Store user info in Redux
            logger.info('[auth/login] Storing user info in Redux')
            dispatch(
                setCredentials({
                    user: result.user,
                    accessToken: result.access,
                })
            )

            // Reset isLoggedOut flag
            logger.info('[auth/login] Resetting isLoggedOut flag')
            localStorage.removeItem('isLoggedOut')

            // The access token will be automatically handled by the browser
            // since it's set as an HTTP-only cookie by the backend

            return true
        } catch (error) {
            if (isFetchBaseQueryError(error)) {
                logger.error(
                    '[auth/login] Login failed:',
                    error.data || error.status
                )
            } else {
                logger.error('[auth/login] Unexpected error:', error)
            }
            return false
        }
    }

    /*
     * Chỉ cần gọi hàm signIn('google', { callbackUrl })
     * Nó sẽ redirect người dùng qua Google để đăng nhập
     * Sau khi thành công, Google sẽ redirect lại trang callback của bạn (mặc định là /api/auth/callback/google)
     * NextAuth sẽ xử lý token, session, rồi redirect về callbackUrl (ví dụ /)
     * Không cần phải await hay xử lý response sau signIn vì nó redirect luôn rồi
     */
    const handleGoogleLogin = (): void => {
        logger.info('[auth/google] Calling API')
        logger.info('[auth/google] Redirecting to Google')
        signIn('google', { callbackUrl: '/google-sync/' })
    }

    return {
        handleLogin,
        handleGoogleLogin,
        isLoading,
        isError,
        isSuccess,
    }
}
