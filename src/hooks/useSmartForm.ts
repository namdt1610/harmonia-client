import { useForm, FieldValues, DefaultValues } from 'react-hook-form'
import { ZodType } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useCallback } from 'react'

type UseSmartFormOptions<T> = {
    schema: ZodType<T>
    defaultValues?: Partial<T>
    onSubmit: (data: T) => Promise<boolean>
    onSuccess?: () => void
    onError?: () => void
    toastMessages?: {
        success?: string
        error?: string
    }
}

export function useSmartForm<T extends FieldValues>({
    schema,
    defaultValues,
    onSubmit,
    onSuccess,
    onError,
    toastMessages,
}: UseSmartFormOptions<T>) {
    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    })

    const handleSmartSubmit = useCallback(
        async (data: T) => {
            try {
                const success = await onSubmit(data)
                if (success) {
                    toast.success(toastMessages?.success || 'Success')
                    onSuccess?.()
                } else {
                    toast.error(toastMessages?.error || 'Failed')
                    onError?.()
                }
            } catch (err) {
                toast.error(toastMessages?.error || 'Something went wrong')
                onError?.()
                console.error(err)
            }
        },
        [onSubmit, onSuccess, onError, toastMessages]
    )

    return { form, handleSubmit: handleSmartSubmit }
}

/** Use example Design Pattern + Functional Abstraction + Hook-driven Architecture
 const { form, handleSubmit } = useSmartForm({
    schema: loginSchema,
    defaultValues: {
        username_or_email: '',
        password: '',
        remember_me: false,
    },
    onSubmit: async (data) => {
        logger.info('[auth/login] Submitting login', JSON.stringify(data))
        return await handleLogin(data.username_or_email, data.password)
    },
    onSuccess: () => {
        toast.success(t('loginSuccess'))
        router.replace(`/${locale}${r.HOME}`)
    },
    toastMessages: {
        error: t('loginFailed'),
    },
})
 */
