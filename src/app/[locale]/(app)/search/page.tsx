'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSearch } from '@/modules/search/hooks/useSearch'
import { toast } from 'sonner'
import SearchResults from '@/modules/search/components/SearchResults'

export default function SearchPage() {
    const searchParams = useSearchParams()
    const {
        error,
        isLoading,
        searchQuery,
        sortOptions,
        currentLimit,
        searchResults,
        setSearchQuery,
        setSortOptions,
        setCurrentLimit,
        setCurrentPage,
        handleSearch,
        handleSortChange,
        handlePageChange,
        handleLimitChange,
    } = useSearch()

    useEffect(() => {
        const query = searchParams.get('q')
        const sortBy = searchParams.get('sortBy')
        const order = searchParams.get('order')
        const limit = searchParams.get('limit')
        const page = searchParams.get('page')

        if (query) {
            try {
                // Set state first
                setSearchQuery(query)

                // Parse URL parameters with proper defaults
                const initialSort =
                    sortBy || order
                        ? {
                              sortBy: sortBy || undefined,
                              order: order || undefined,
                          }
                        : undefined // Will use default relevance sort

                const initialLimit = limit || '10' // Default to 10 items per page
                const initialPage = page ? parseInt(page) : 1 // Default to page 1

                // Set all state
                setSortOptions(
                    initialSort || { sortBy: undefined, order: undefined }
                )
                setCurrentLimit(initialLimit)
                setCurrentPage(initialPage)

                // Trigger search
                handleSearch(query, initialSort, initialPage, initialLimit)
            } catch (err) {
                toast.error('Please try again', {
                    description:
                        err instanceof Error
                            ? err.message
                            : 'An error occurred',
                })
            }
        }
    }, [searchParams]) // Only depend on searchParams

    return (
        <div className="m-auto">
            <SearchResults
                error={error}
                isLoading={isLoading}
                currentLimit={currentLimit}
                currentSort={sortOptions}
                searchQuery={searchQuery}
                searchResults={searchResults}
                onSortChange={handleSortChange}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />
        </div>
    )
}
