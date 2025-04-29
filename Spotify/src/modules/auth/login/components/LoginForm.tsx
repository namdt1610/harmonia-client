'use client'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { set, z } from 'zod'
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
import GoogleIcon from '@/components/GoogleIcon'
import { Separator } from '../../../../components/ui/separator'
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
    const { handleLogin, isLoading } = useLogin()
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
        // toast('You submitted the following values:', {
        //     description: (
        //         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //             <code className="text-white">
        //                 {JSON.stringify(data, null, 2)}
        //             </code>
        //         </pre>
        //     ),
        // })

        handleLogin(data.username_or_email, data.password)
            .then((res) => {
                if (res) {
                    toast.success('Login successful!')
                    setTimeout(() => {
                        router.push('/')
                    }, 1000)
                }
            })
            .catch((err) => {
                console.log(err)
                toast.error(err.message || 'Login failed. Please try again.')
            })

        if (isLoading) {
            toast.loading('Logging in...')
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card
                    className="w-96 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 "
                    style={{ height: '550px' }}
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
                        <Button className="w-full" onClick={() => null}>
                            {t('title')}
                        </Button>
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
