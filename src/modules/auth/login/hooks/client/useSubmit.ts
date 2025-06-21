'use client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useLoginSchema } from './useLoginSchema'
import { z } from 'zod'
import { useCurrentLocale } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { ROUTES as r } from '@/lib/routes'
import { logger } from '@/lib/utils/logger'
export const useSubmit = (
    handleLogin: (
        username_or_email: string,
        password: string
    ) => Promise<boolean>
) => {
    const loginSchema = useLoginSchema()
    const router = useRouter()
    const locale = useCurrentLocale()
    const t = useTranslations('LoginPage')

    // Logic
    /*
     * .then là method của Promise, dùng để xử lý kết quả của hàm sau khi nó hoàn thành
     * .then bắt từng lỗi cụ thể của promise, nếu không bắt được thì sẽ bị lỗi
     * => dùng async/await, try/catch để tránh lỗi
     * dùng arrow để tránh hoisting (dùng function declaration thì sẽ bị hoisting)
     */
    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        try {
            logger.info('[auth/login] Submitting form', JSON.stringify(data))
            logger.info('[auth/login] Calling handleLogin')
            const success = toast.promise(
                handleLogin(data.username_or_email, data.password),
                {
                    loading: t('loginLoading'),
                    success: t('loginSuccess'),
                    error: t('loginFailed'),
                }
            )
            if (success) {
                toast.success(t('loginSuccess'))
                router.replace(`/${locale}${r.HOME}`)
            } else {
                toast.error(t('loginFailed'))
            }
        } catch (err) {
            console.error(err)
            toast.error(t('loginFailed'))
        }
    }
    return {
        onSubmit,
    }
}
