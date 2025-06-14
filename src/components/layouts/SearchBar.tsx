'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

export default function SearchBar() {
    const t = useTranslations('SearchBar')
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()
    const pathname = usePathname()
    const locale = pathname?.split('/')[1] || 'en'

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim()) {
                router.push(
                    `/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`
                )
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [searchQuery, router, locale])

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={20} className="text-neutral-400" />
            </div>
            <input
                type="text"
                className="bg-neutral-800 text-white rounded-full pl-10 pr-4 py-2 w-[500px] focus:w-[520px] transition-all duration-200 outline-none focus:ring-2 focus:ring-white"
                placeholder={t('searchPlaceholder', {
                    fallback: 'What do you want to listen to?',
                })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={t('search', { fallback: 'Search' })}
            />
        </div>
    )
}
