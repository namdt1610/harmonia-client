import { notFound } from 'next/navigation'
import { setRequestLocale, getMessages } from 'next-intl/server'
import { ReactNode } from 'react'
import BaseLayout from '@/components/layouts/BaseLayout'
import { routing } from '@/i18n/routing'

type Locale = (typeof routing.locales)[number] // Định nghĩa kiểu chính xác

type Props = {
    children: ReactNode
    params: { locale?: string }
}

export default async function LocaleLayout({ children, params }: Props) {
    const resolvedParams = await Promise.resolve(params) // Đảm bảo params đã resolve
    const locale = resolvedParams?.locale
    const messages = await getMessages();

    if (!locale || !routing.locales.includes(locale as any)) {
        notFound()
    }

    setRequestLocale(locale as Locale)

    return <BaseLayout messages={messages} locale={locale}>{children}</BaseLayout>
}
