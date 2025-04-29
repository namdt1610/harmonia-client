'use client'
import { useSearch } from '@/modules/search/hooks/useSearch'
import { SearchUI } from '@/modules/search/components'

export default function SearchPage() {
    const {
        searchResults,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        handleSearch,
    } = useSearch()

    return (
        <SearchUI
            searchResults={searchResults}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            isLoading={isLoading}
            error={error}
        />
    )
}
