'use client'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { ROUTES as r } from '@/lib/routes'
import { useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'

// Hooks
import GoogleIcon from '@/components/shared/GoogleIcon'
import { useLogin } from '@/modules/auth/login/hooks/useLogin'
import { useRouter } from 'next/navigation'
import { useLoginSchema } from '../../hooks/useLoginSchema'
import { useCurrentLocale } from '@/lib/utils'

// Components
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
import { UsernameField } from '../fields/UsernameField'
import { PasswordField } from '../fields/PasswordField'
import { RememberMeCheckbox } from '../fields/RememberMeCheckbox'
import { logger } from '@/lib/utils/logger'
export const LoginForm = () => {
    // Initial
    const router = useRouter()
    const locale = useCurrentLocale()
    const t = useTranslations('LoginPage')
    const loginSchema = useLoginSchema()
    const { handleLogin, isLoading, handleGoogleLogin } = useLogin()

    // Form
    /*
     * z.infer dùng để lấy ra kiểu TypeScript tương ứng từ một schema Zod.
     * zodResolver dùng để chuyển đổi dữ liệu từ form sang schema Zod.
     */
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username_or_email: '',
            password: '',
            remember_me: false,
        },
    })

    // Logic
    /*
     * .then là method của Promise, dùng để xử lý kết quả của hàm sau khi nó hoàn thành
     * .then bắt từng lỗi cụ thể của promise, nếu không bắt được thì sẽ bị lỗi
     * => dùng async/await, try/catch để tránh lỗi
     * dùng arrow để tránh hoisting (dùng function declaration thì sẽ bị hoisting)
     */
    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        const success = await handleLogin(data.username_or_email, data.password)

        if (success) {
            toast.success(t('loginSuccess'))
            router.replace(`/${locale}${r.HOME}`)
        } else {
            toast.error(t('loginFailed'))
        }
    }

    const goToRegister = () => {
        logger.info('[auth/login] Redirecting to register')
        router.push(r.REGISTER)
    }

    const goToForgotPassword = () => {
        logger.info('[auth/login] Redirecting to forgot password')
        router.push(r.FORGOT_PASSWORD)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card
                    className=" shadow-lg transition-all duration-300 ease-in-out hover:scale-105 "
                    style={{ width: '500px' }}
                >
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">
                            {t('title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        {/* Username or Email section */}
                        <UsernameField control={form.control} />

                        {/* Password section */}
                        <PasswordField control={form.control} />

                        {/* Remember me section */}
                        <RememberMeCheckbox control={form.control} />

                        {/* Submit button and links */}
                        <Button
                            aria-label="Login"
                            className="w-full"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? t('auth.loading') : t('title')}
                        </Button>
                        <Button
                            aria-label="Forgot password"
                            type="button"
                            variant="link"
                            className="w-full text-center text-sm text-muted-foreground hover:underline"
                            onClick={goToForgotPassword}
                        >
                            {t('forgotPassword')}
                        </Button>
                        <Button
                            aria-label="Register"
                            type="button"
                            variant="link"
                            className="w-full text-center text-sm text-muted-foreground hover:underline"
                            onClick={goToRegister}
                        >
                            {t('register')}
                        </Button>
                        <Separator />
                        <Button
                            type="button"
                            aria-label="Google sign in"
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            <GoogleIcon />
                            {t('googleSignIn')}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
