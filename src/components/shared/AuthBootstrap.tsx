'use client'
import { useSilentRefresh } from '@/hooks/useSilentRefresh'
import { useGlobalAuth } from '@/hooks/useGlobalAuth'

export function AuthBootstrap() {
    useGlobalAuth()
    useSilentRefresh()
    return null
}
