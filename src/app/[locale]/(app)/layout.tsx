import { notFound } from 'next/navigation'
import { setRequestLocale, getMessages } from 'next-intl/server'
import { ReactNode } from 'react'
import BaseLayout from '@/components/layouts/BaseLayout'
import { routing } from '@/i18n/routing'

type Locale = (typeof routing.locales)[number]
type Params = { locale?: string }
type Props = { children: ReactNode; params: Params }

/**
 * Kiểm tra xem locale có hợp lệ không
 * @param locale - Locale cần kiểm tra
 * @returns true nếu locale hợp lệ, false nếu không
 */
const isValidLocale = (locale: string): locale is Locale => {
    return routing.locales.includes(locale as Locale)
}

export default async function LocaleLayout({ children, params }: Props) {
    const locale = params?.locale

    if (!locale || !isValidLocale(locale)) {
        notFound()
    }

    try {
        setRequestLocale(locale)
    } catch (err) {
        console.error('Locale error:', err)
        notFound()
    }

    const messages = await getMessages()

    return (
        <BaseLayout messages={messages} locale={locale}>
            {children}
        </BaseLayout>
    )
}
