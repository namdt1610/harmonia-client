import { toast } from 'sonner'
import { logger } from '@/lib/utils/logger'
import { useSchema } from '../client/useSchema'
import { z } from 'zod'
import { useTranslations } from 'next-intl'

export const useSubmit = (
    handleRegister: (
        username: string,
        email: string,
        password: string
    ) => Promise<boolean>,
    isLoading: boolean,
    error: string
) => {
    const registerSchema = useSchema()
    const t = useTranslations('RegisterPage')

    const onSubmit = async (data: z.infer<typeof registerSchema>) => {
        try {
            logger.info('[auth/register] Submitting form', JSON.stringify(data))
            logger.info('[auth/register] Calling handleRegister')
            const success = await handleRegister(
                data.username,
                data.email,
                data.password
            )
            if (success) {
                toast.success(t('registerSuccess'))
            }
        } catch (err) {
            console.error(err)
            toast.error(t('registerFailed'))
        }
        if (isLoading) {
            toast.loading(t('registerLoading'))
        }
        if (error) {
            toast.error(error)
        }
    }
    return {
        onSubmit,
    }
}
