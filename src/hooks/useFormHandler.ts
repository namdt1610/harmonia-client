import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

type UseFormHandlerOptions<T> = {
    schema?: z.ZodType<T>
    onSuccess?: () => void
    onError?: (e: any) => void
    toastMessages?: {
        loading?: string
        success?: string
        error?: string
    }
}

export const useFormHandler = <T>(
    submitFn: (data: T) => Promise<any>,
    options?: UseFormHandlerOptions<T>
) => {
    const [loading, setLoading] = useState(false)
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (rawData: unknown) => {
        let data: T

        try {
            setLoading(true)
            setFormErrors({})

            if (options?.schema) {
                const result = options.schema.safeParse(rawData)
                if (!result.success) {
                    const fieldErrors: Record<string, string> = {}
                    result.error.errors.forEach((e) => {
                        if (e.path.length) {
                            fieldErrors[e.path[0] as string] = e.message
                        }
                    })
                    setFormErrors(fieldErrors)
                    toast.error('Validation failed')
                    return
                }
                data = result.data
            } else {
                data = rawData as T
            }

            if (options?.toastMessages?.loading) {
                toast.loading(options.toastMessages.loading)
            }

            await submitFn(data)
            toast.success(options?.toastMessages?.success || 'Success')
            options?.onSuccess?.()
        } catch (err) {
            toast.error(options?.toastMessages?.error || 'Error')
            options?.onError?.(err)
        } finally {
            setLoading(false)
        }
    }

    return {
        handleSubmit,
        loading,
        formErrors,
    }
}
