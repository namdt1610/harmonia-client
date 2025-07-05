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

    // Debug logging - moved to useEffect to prevent state updates during render
    useEffect(() => {
        console.log('MOUNT SearchPage component mounted')
        console.log('HOOK useSearch hook initialized:', {
            searchQuery,
            isLoading,
            error,
            hasResults: !!searchResults,
        })
    }, [searchQuery, isLoading, error, searchResults])

    useEffect(() => {
        const query = searchParams.get('q')
        const sortBy = searchParams.get('sortBy')
        const order = searchParams.get('order')
        const limit = searchParams.get('limit')
        const page = searchParams.get('page')

        console.log('SEARCH Search page URL params:', {
            query,
            sortBy,
            order,
            limit,
            page,
        })

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

                console.log('PARSE Search params parsed:', {
                    query,
                    initialSort,
                    initialPage,
                    initialLimit,
                })

                // Set all state
                setSortOptions(
                    initialSort || { sortBy: undefined, order: undefined }
                )
                setCurrentLimit(initialLimit)
                setCurrentPage(initialPage)

                // Trigger search
                console.log('TRIGGER Triggering search...')
                handleSearch(query, initialSort, initialPage, initialLimit)
            } catch (err) {
                console.error('ERROR Search page error:', err)
                toast.error('Please try again', {
                    description:
                        err instanceof Error
                            ? err.message
                            : 'An error occurred',
                })
            }
        }
    }, [searchParams]) // Chỉ depend vào searchParams để tránh infinite loop

    // Debug search results
    useEffect(() => {
        console.log('STATE Search page state:', {
            searchQuery,
            isLoading,
            error,
            searchResults,
            hasResults: !!searchResults,
        })
    }, [searchQuery, isLoading, error, searchResults])

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
