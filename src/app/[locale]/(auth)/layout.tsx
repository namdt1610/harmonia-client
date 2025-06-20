import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl'
import Aurora from '@/blocks/Backgrounds/Aurora/Aurora'
import { SessionProvider } from 'next-auth/react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const locale = useLocale()
    const messages = useMessages()
    return (
        <SessionProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
                <div className="w-screen h-screen bg-gradient-to-b from-neutral-900 to-black items-center flex flex-col">
                    <Aurora
                        colorStops={['#3A29FF', '#FF94B4', '#FF3232']}
                        blend={0.5}
                        amplitude={1.0}
                        speed={0.5}
                    />
                    <div className="absolute flex items-center justify-center w-full h-screen">
                        {children}
                    </div>
                </div>
            </NextIntlClientProvider>
        </SessionProvider>
    )
}
