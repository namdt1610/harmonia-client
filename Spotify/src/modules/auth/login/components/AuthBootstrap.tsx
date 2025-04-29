'use client'
import { useSilentLogin } from '@/modules/auth/login/hooks/useSilentLogin'

export function AuthBootstrap() {
    useSilentLogin()
    return null
}
