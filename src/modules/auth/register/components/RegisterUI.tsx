'use client'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
import { useRegister } from '../hooks/useRegister'
import { logger } from '@/lib/utils/logger'
import { useSchema } from '../hooks/client/useSchema'

export default function RegisterForm() {
    const t = useTranslations('RegisterPage')
    const router = useRouter()
    const { handleRegister, isLoading, isError } = useRegister()
    const registerSchema = useSchema()

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    })

    function onSubmit(data: z.infer<typeof registerSchema>) {
        logger.info('[auth/register] Submitting form', JSON.stringify(data))
        logger.info('[auth/register] Calling handleRegister')
        handleRegister(data.username, data.email, data.password)
            .then((res) => {
                if (res) {
                    toast.success(t('registerSuccess'))
                }
            })
            .catch((err) => {
                console.error(err)
                toast.error(t('registerFailed'))
            })

        if (isLoading) {
            toast.loading(t('registerLoading'))
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card
                    className="shadow-lg transition-all duration-300 ease-in-out hover:scale-105 "
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
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('username')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={`${t('username')}`}
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('email')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={`${t('email')}`}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {t('emailDescription')}
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
                        <Button className="w-full" onClick={() => null}>
                            {t('title')}
                        </Button>
                        <div className="flex items-center justify-center">
                            <p className="text-center text-sm text-muted-foreground">
                                {t('alreadyHaveAccount')}
                            </p>
                            <Button
                                variant="link"
                                className="text-center text-sm text-muted-foreground hover:underline"
                                onClick={() => router.push('/login')}
                            >
                                {t('login')}
                            </Button>
                        </div>
                        <Separator />
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() =>
                                signIn('google', { callbackUrl: '/dashboard' })
                            }
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
