import { z } from 'zod'
import { useTranslations } from 'next-intl'

export const useLoginSchema = () => {
    const t = useTranslations('LoginPage.validation')

    const loginSchema = z.object({
        username_or_email: z
            .string()
            .min(1, { message: t('usernameOrEmailRequired') })
            .max(20, { message: t('usernameOrEmailMaxLength') }),
        password: z
            .string()
            .min(8, { message: t('passwordRequired') })
            .max(20, { message: t('passwordMaxLength') }),
        remember_me: z.boolean().optional(),
    })

    return loginSchema
}
