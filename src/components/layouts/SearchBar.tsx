'use client'

import { useState, useRef } from 'react'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Input } from '../ui/input'

export default function SearchBar() {
    const t = useTranslations('SearchBar')
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchQuery(value)

        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        // Set new timeout
        if (value.trim().length >= 2) {
            timeoutRef.current = setTimeout(() => {
                router.push(`/vi/search?q=${encodeURIComponent(value.trim())}`)
            }, 300)
        }
    }

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={20} className="text-neutral-400" />
            </div>
            <Input
                type="text"
                className="bg-neutral-800 text-white rounded-full pl-10 pr-4 py-2 w-[500px] focus:w-[520px] transition-all duration-200 outline-none focus:ring-2 focus:ring-white"
                placeholder={t('searchPlaceholder', {
                    fallback: 'What do you want to listen to?',
                })}
                value={searchQuery}
                onChange={handleInputChange}
                aria-label={t('search', { fallback: 'Search' })}
            />
        </div>
    )
}
