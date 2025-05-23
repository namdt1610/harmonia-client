'use client'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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
import { EyeIcon, EyeOffIcon, X } from 'lucide-react'
import { useState } from 'react'
const FormSchema = z.object({
    username_or_email: z.string().min(2, {
        message: 'Username must be at least 3 characters.',
    }),
    password: z.string().min(6, {
        message: 'Password must be at least 6 characters.',
    }),
})

export default function LoginForm() {
    const { handleLogin, isLoading, handleGoogleLogin, isGoogleLoading } =
        useLogin()
    const [showPassword, setShowPassword] = useState(false)
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
                    const locale =
                        window.location.pathname.split('/')[1] || 'vi'
                    // Force reload để Middleware thấy cookie mới
                    window.location.href = `/${locale}`
                }
            })
            .catch((err) => {
                toast.error(err?.message || 'Login failed. Please try again.')
            })
    }

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
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
                                        <div className="relative">
                                            <Input
                                                placeholder={`${t(
                                                    'username_or_email'
                                                )}`}
                                                {...field}
                                            />
                                            {!!field.value && (
                                                <Button
                                                    size="icon"
                                                    type="button"
                                                    variant="link"
                                                    onClick={() =>
                                                        field.onChange('')
                                                    }
                                                    className="absolute right-0 top-1/2 -translate-y-1/2"
                                                >
                                                    <X className="text-muted-foreground" />
                                                </Button>
                                            )}
                                        </div>
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
                                        <div className="relative flex items-center">
                                            <Input
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder={`${t('password')}`}
                                                {...field}
                                            />
                                            {!!field.value && (
                                                <div className="flex items-center justify-end absolute right-0">
                                                    {showPassword ? (
                                                        <Button
                                                            size="icon"
                                                            type="button"
                                                            variant="link"
                                                            onClick={
                                                                handleShowPassword
                                                            }
                                                        >
                                                            <EyeIcon className="text-muted-foreground" />
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="icon"
                                                            type="button"
                                                            variant="link"
                                                            onClick={
                                                                handleShowPassword
                                                            }
                                                        >
                                                            <EyeOffIcon className="text-muted-foreground" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="icon"
                                                        type="button"
                                                        variant="link"
                                                        onClick={() =>
                                                            field.onChange('')
                                                        }
                                                    >
                                                        <X className="text-muted-foreground" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
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
                            type="button"
                            variant="link"
                            className="w-full text-center text-sm text-muted-foreground hover:underline"
                            onClick={() => router.push('/forgot-password')}
                        >
                            {t('forgotPassword')}
                        </Button>
                        <Button
                            type="button"
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
