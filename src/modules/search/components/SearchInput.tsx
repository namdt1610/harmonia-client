'use client'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'

interface SearchInputProps {
    value: string
    onChange: (value: string) => void
    onSearch: () => void
}

export default function SearchInput({
    value,
    onChange,
    onSearch,
}: SearchInputProps) {
    const t = useTranslations('Search')

    return (
        <div className="relative flex-1 max-w-2xl">
            <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                size={18}
            />
            <Input
                className="pl-10 bg-neutral-800 border-neutral-700 text-white"
                placeholder={t('searchPlaceholder', {
                    fallback: 'Search by song title, artist, or album...',
                })}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                autoFocus
            />
        </div>
    )
}
