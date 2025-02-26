import { clsx } from 'clsx'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ReactNode } from 'react'
import Navigation from './Navigation'

const inter = Inter({ subsets: ['latin'] })

type Props = {
    children: ReactNode
    locale: string
}

export default async function BaseLayout({ children, locale }: Props) {
    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages()

    return (
        <NextIntlClientProvider messages={messages}>
            <Navigation />
            {children}
        </NextIntlClientProvider>
    )
}
