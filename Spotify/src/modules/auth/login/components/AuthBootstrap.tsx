'use client'
import { useSilentLogin } from '@/modules/auth/login/hooks/useSilentLogin'
import { useGlobalAuth } from '@/hooks/useGlobalAuth'

export function AuthBootstrap() {
    useGlobalAuth()
    useSilentLogin()
    return null
}
