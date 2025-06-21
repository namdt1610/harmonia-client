import { signIn } from 'next-auth/react'
import { logger } from '@/lib/utils/logger'

export const useGoogleLogin = () => {
    /*
     * Chỉ cần gọi hàm signIn('google', { callbackUrl })
     * Nó sẽ redirect người dùng qua Google để đăng nhập
     * Sau khi thành công, Google sẽ redirect lại trang callback của bạn (mặc định là /api/auth/callback/google)
     * NextAuth sẽ xử lý token, session, rồi redirect về callbackUrl (ví dụ /)
     * Không cần phải await hay xử lý response sau signIn vì nó redirect luôn rồi
     */
    const handleGoogleLogin = async (): Promise<void> => {
        try {
            logger.info('[auth/google] Calling API')
            logger.info('[auth/google] Redirecting to Google')
            await signIn('google', { callbackUrl: '/google-sync/' })
        } catch (error) {
            logger.error('[auth/google] Unexpected error:', error)
        }
    }

    return {
        handleGoogleLogin,
    }
}
