'use client'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { ROUTES as r } from '@/lib/routes'
import { useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Form,
    Input,
} from '@/components/ui/_index'
import { toast } from 'sonner'
import { logger } from '@/lib/utils/logger'
import { useState } from 'react'

const forgotPasswordSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
})

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>

export const ForgotPasswordForm = () => {
    const router = useRouter()
    const t = useTranslations('ForgotPasswordPage')
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    })

    const onSubmit = async (data: ForgotPasswordData) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                toast.success(t('sent'))
                logger.info(
                    '[auth/forgot-password] Password reset email sent successfully'
                )
                // Redirect to login page after successful request
                setTimeout(() => {
                    router.push(r.LOGIN)
                }, 2000)
            } else {
                const errorData = await response.json()
                toast.error(errorData.message || t('error'))
                logger.error(
                    '[auth/forgot-password] Failed to send reset email:',
                    errorData
                )
            }
        } catch (error) {
            toast.error(t('networkError'))
            logger.error('[auth/forgot-password] Network error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const goToLogin = () => {
        logger.info('[auth/forgot-password] Redirecting to login')
        router.push(r.LOGIN)
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">{t('title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <div>
                                <Input
                                    {...form.register('email')}
                                    type="email"
                                    placeholder={t('emailPlaceholder')}
                                    disabled={isLoading}
                                />
                                {form.formState.errors.email && (
                                    <p className="text-sm text-destructive mt-1">
                                        {form.formState.errors.email.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? t('sending') : t('sendResetLink')}
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full"
                                onClick={goToLogin}
                                disabled={isLoading}
                            >
                                {t('backToLogin')}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
