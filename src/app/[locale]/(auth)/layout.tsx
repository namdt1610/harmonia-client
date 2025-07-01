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
                <div className="fixed inset-0 w-screen h-screen bg-gradient-to-b from-neutral-900 to-black flex flex-col items-center justify-center overflow-hidden">
                    <Aurora
                        colorStops={['#3A29FF', '#FF94B4', '#FF3232']}
                        blend={0.5}
                        amplitude={1.0}
                        speed={0.5}
                    />
                    <div className="absolute inset-0 flex items-center justify-center w-full h-full overflow-hidden">
                        {children}
                    </div>
                </div>
            </NextIntlClientProvider>
        </SessionProvider>
    )
}
