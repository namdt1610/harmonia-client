'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearch } from '@/hooks/useSearch'

interface SearchBarProps {
    onSearchResults: (results: any) => void
}

export default function SearchBar({ onSearchResults }: SearchBarProps) {
    const t = useTranslations('SearchBar')
    const [searchQuery, setSearchQuery] = useState('')
    const { handleSearch, searchResults } = useSearch()

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setSearchQuery(newValue)
        handleSearch(newValue)
        onSearchResults(searchResults)
    }

    return (
        <div className="relative ">
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
                onChange={onChange}
                aria-label={t('search', { fallback: 'Search' })}
            />
        </div>
    )
}
