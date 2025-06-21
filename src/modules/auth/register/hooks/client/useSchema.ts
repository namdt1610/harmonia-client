import { useTranslations } from 'next-intl'
import { z } from 'zod'

export const useSchema = () => {
    const t = useTranslations('RegisterPage.validation')
    const registerSchema = z.object({
        username: z.string().min(2, {
            message: t('usernameRequired'),
        }),
        email: z.string().email({
            message: t('emailRequired'),
        }),
        password: z.string().min(8, {
            message: t('passwordRequired'),
        }),
    })
    return registerSchema
}
