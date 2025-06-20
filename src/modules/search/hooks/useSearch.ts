'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useLazyGlobalSearchQuery } from '@/modules/search/api'

// Default search options
const DEFAULT_SORT_OPTIONS = {
    sortBy: undefined, // relevance by default
    order: undefined,
}
const DEFAULT_LIMIT = '10'
const DEFAULT_PAGE = 1

export function useSearch() {
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE)
    const [sortOptions, setSortOptions] = useState<{
        sortBy?: string
        order?: string
    }>(DEFAULT_SORT_OPTIONS)
    const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT)
    const [error, setError] = useState<string | null>(null)
    const [globalSearch, { data: searchResults, isLoading }] =
        useLazyGlobalSearchQuery()

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Use ref to track if we should skip the effect
    const skipEffectRef = useRef(false)

    // Helper function to update URL
    const updateURL = (updates: {
        sortBy?: string
        order?: string
        limit?: string
        page?: string
    }) => {
        const params = new URLSearchParams(searchParams.toString())

        // Update parameters
        Object.entries(updates).forEach(([key, value]) => {
            if (value && value !== 'undefined') {
                params.set(key, value)
            } else {
                params.delete(key)
            }
        })

        // Always keep the search query
        if (searchQuery) {
            params.set('q', searchQuery)
        }

        skipEffectRef.current = true // Skip effect when updating URL
        router.push(`${pathname}?${params.toString()}`)
        setTimeout(() => {
            skipEffectRef.current = false
        }, 100)
    }

    /**
     * Dùng useCallback để lưu lại hàm search với sort options, pagination và limit
     * @param query - The search query
     * @param options - Sort options (defaults to relevance if not provided)
     * @param page - Page number
     * @param limit - Items per page
     */
    const handleSearch = useCallback(
        async (
            query: string,
            options?: { sortBy?: string; order?: string },
            page: number = DEFAULT_PAGE,
            limit?: string
        ) => {
            if (!query.trim()) return

            setError(null)

            // Use default options if none provided
            const searchOptions = options || DEFAULT_SORT_OPTIONS

            try {
                skipEffectRef.current = true // Skip effect when manually calling search
                await globalSearch({
                    q: query,
                    page,
                    page_size: parseInt(limit || currentLimit),
                    ...searchOptions,
                }).unwrap()
            } catch (err) {
                throw new Error('An error occurred while searching')
            } finally {
                skipEffectRef.current = false
            }
        },
        [globalSearch, currentLimit]
    )

    /**
     * Handle sort change - trigger new search with sort params
     */
    const handleSortChange = useCallback(
        (sortBy?: string, order?: string) => {
            const newSortOptions = { sortBy, order }
            setSortOptions(newSortOptions)
            setCurrentPage(1) // Reset to first page when sorting

            // Update URL first
            updateURL({
                sortBy: sortBy,
                order: order,
                page: '1',
            })

            if (searchQuery.trim()) {
                handleSearch(searchQuery, newSortOptions, 1, currentLimit)
            }
        },
        [searchQuery, currentLimit]
    )

    /**
     * Handle page change - trigger new search for specific page
     */
    const handlePageChange = useCallback(
        (page: number) => {
            setCurrentPage(page)

            // Update URL first
            updateURL({ page: page.toString() })

            if (searchQuery.trim()) {
                handleSearch(searchQuery, sortOptions, page, currentLimit)
            }
        },
        [searchQuery, sortOptions, currentLimit]
    )

    /**
     * Handle limit change - trigger new search with new limit
     */
    const handleLimitChange = useCallback(
        (limit: string) => {
            setCurrentLimit(limit)
            setCurrentPage(1) // Reset to first page when changing limit

            // Update URL first
            updateURL({
                limit: limit,
                page: '1',
            })

            if (searchQuery.trim()) {
                handleSearch(searchQuery, sortOptions, 1, limit)
            }
        },
        [searchQuery, sortOptions]
    )

    // Remove handleSearch from dependencies to prevent loop
    useEffect(() => {
        if (skipEffectRef.current) return // Skip if manually triggered

        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim()) {
                setCurrentPage(1) // Reset to first page on new search
                globalSearch({
                    q: searchQuery,
                    page: 1,
                    page_size: parseInt(currentLimit),
                    ...sortOptions,
                })
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchQuery, sortOptions, currentLimit, globalSearch])

    return {
        error,
        isLoading,
        sortOptions,
        currentPage,
        currentLimit,
        searchQuery,
        searchResults,
        setSearchQuery,
        setSortOptions,
        setCurrentLimit,
        setCurrentPage,
        handleSearch,
        handleSortChange,
        handlePageChange,
        handleLimitChange,
    }
}
