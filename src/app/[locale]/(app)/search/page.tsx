'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSearch } from '@/modules/search/hooks/useSearch'
import { SearchUI } from '@/modules/search/components'
import SearchInput from '@/modules/search/components/SearchInput'
import { toast } from 'sonner'

export default function SearchPage() {
    const searchParams = useSearchParams()
    const {
        searchResults,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        handleSearch,
    } = useSearch()

    useEffect(() => {
        const query = searchParams.get('q')
        if (query) {
            setSearchQuery(query)
            handleSearch(query).catch((err) => {
                toast.error('Please try again', {
                    description: err.message,
                })
            })
        }
    }, [searchParams, setSearchQuery, handleSearch])

    return (
        <div className="container mx-auto py-8 px-4">
            {/* <div className="flex gap-2 mb-8 items-center justify-center">
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSearch={() => handleSearch(searchQuery)}
                />
            </div> */}
            <SearchUI
                searchResults={searchResults}
                searchQuery={searchQuery}
                isLoading={isLoading}
                error={error}
            />
        </div>
    )
}
