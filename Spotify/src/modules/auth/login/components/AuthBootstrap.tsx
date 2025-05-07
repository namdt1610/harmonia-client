'use client'
import { useSilentLogin } from '@/modules/auth/login/hooks/useSilentLogin'
import { useGlobalAuth } from '@/hooks/useGlobalAuth'
import { useAuthInit } from '@/hooks/useAuthInit'

export function AuthBootstrap() {
    useAuthInit()
    useGlobalAuth()
    useSilentLogin()
    return null
}
