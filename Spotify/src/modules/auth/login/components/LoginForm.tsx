'use client'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import GoogleIcon from '@/components/shared/GoogleIcon'
import { Separator } from '@/components/ui/separator'
import { useLogin } from '@/modules/auth/login/hooks/useLogin'
import { useRouter } from 'next/navigation'

const FormSchema = z.object({
    username_or_email: z.string().min(2, {
        message: 'Username must be at least 2 characters.',
    }),
    password: z.string().min(6, {
        message: 'Password must be at least 6 characters.',
    }),
})

export default function LoginForm() {
    const {
        handleLogin,
        isLoading,
        isError,
        isSuccess,
        handleGoogleLogin,
        isGoogleLoading,
    } = useLogin()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username_or_email: '',
            password: '',
        },
    })
    const router = useRouter()
    const t = useTranslations('LoginPage')

    function onSubmit(data: z.infer<typeof FormSchema>) {
        handleLogin(data.username_or_email, data.password)
            .then((res) => {
                console.log('handleLogin res:', res)
                if (res) {
                    toast.success('Login successful!')
                    // const locale =
                    //     window.location.pathname.split('/')[1] || 'vi'
                    // // Force reload để Middleware thấy cookie mới
                    // window.location.href = `/${locale}`
                }
            })
            .catch((err) => {
                toast.error(err?.message || 'Login failed. Please try again.')
            })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card
                    className=" shadow-lg transition-all duration-300 ease-in-out hover:scale-105 "
                    style={{ width: '500px' }}
                >
                    <CardHeader>
                        <CardTitle className="text-center text-lg">
                            {t('title')}
                        </CardTitle>
                        <button onClick={() => router.push('/')}>
                            Test Go Home
                        </button>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        <FormField
                            control={form.control}
                            name="username_or_email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('username_or_email')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={`${t(
                                                'username_or_email'
                                            )}`}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {t('usernameDescription')}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('password')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder={`${t('password')}`}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {t('passwordDescription')}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className="w-full"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? t('auth.loading') : t('title')}
                        </Button>
                        <Button
                            variant="link"
                            className="w-full text-center text-sm text-muted-foreground hover:underline"
                            onClick={() => router.push('/forgot-password')}
                        >
                            {t('forgotPassword')}
                        </Button>
                        <Button
                            variant="link"
                            className="w-full text-center text-sm text-muted-foreground hover:underline"
                            onClick={() => router.push('/register')}
                        >
                            {t('register')}
                        </Button>
                        <Separator />
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading}
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
