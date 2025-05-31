'use client'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { ROUTES as r } from '@/lib/routes'
import { useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useCurrentLocale } from '@/lib/utils'
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Form,
    Separator,
} from '@/components/ui/_index'
import { toast } from 'sonner'

const forgotPasswordSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
})

export const ForgotPasswordForm = () => {
    const router = useRouter()
    const locale = useCurrentLocale()
    const t = useTranslations('ForgotPasswordPage')
    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    })

    const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
        // TODO: Gửi request quên mật khẩu
        toast.success(t('sent'))
        // Có thể chuyển hướng về trang login hoặc thông báo thành công
    }

    const goToLogin = () => {
        router.push(r.LOGIN)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card
                    className="shadow-lg transition-all duration-300 ease-in-out hover:scale-105"
                    style={{ width: '500px' }}
                >
                    <CardHeader>
                        <CardTitle className="text-center text-lg">
                            {t('title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm mb-1"
                            >
                                {t('email')}
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...form.register('email')}
                                className="w-full px-3 py-2 border rounded"
                                autoComplete="email"
                            />
                        </div>
                        <Button
                            aria-label="Send"
                            className="w-full"
                            type="submit"
                        >
                            {t('send')}
                        </Button>
                        <Button
                            aria-label="Back to login"
                            type="button"
                            variant="link"
                            className="w-full text-center text-sm text-muted-foreground hover:underline"
                            onClick={goToLogin}
                        >
                            {t('backToLogin')}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
