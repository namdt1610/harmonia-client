import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { ReactNode } from 'react'
import BaseLayout from '@/components/BaseLayout'
import { routing } from '@/i18n/routing'

type Locale = (typeof routing.locales)[number]

type Props = {
    children: ReactNode
    params: { locale?: string }
}

export default async function LocaleLayout({ children, params }: Props) {
    const resolvedParams = await Promise.resolve(params)
    const locale = resolvedParams?.locale

    if (!locale || !routing.locales.includes(locale as any)) {
        notFound()
    }

    setRequestLocale(locale as Locale)

    return <BaseLayout locale={locale}>{children}</BaseLayout>
}
