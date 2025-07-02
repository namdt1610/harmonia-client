'use client'
import { LoginUI } from '@/modules/auth/login/components/forms/LoginUI'
import { useLogin } from '@/modules/auth/login/hooks/server/useLogin'
import { useGoogleLogin } from '@/modules/auth/login/hooks/server/useGoogleLogin'
export default function LoginPage() {
    const { handleLogin, isLoading } = useLogin()
    const { handleGoogleLogin } = useGoogleLogin()

    return (
        <LoginUI
            handleLogin={handleLogin}
            isLoading={isLoading}
            handleGoogleLogin={handleGoogleLogin}
        />
    )
}
