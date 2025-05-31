'use client'

import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'

export function Providers({
    children,
    locale,
    messages,
}: {
    children: React.ReactNode
    locale: string
    messages: any
}) {
    console.log('Providers:', locale, messages)
    return (
        <SessionProvider>
            <NextIntlClientProvider messages={messages} locale={locale}>
                {children}
            </NextIntlClientProvider>
        </SessionProvider>
    )
}
