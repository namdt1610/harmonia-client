'use client'
import { useState, useEffect } from 'react'
import { useLazyGlobalSearchQuery } from '@/modules/search/api'

export function useSearch() {
    const [searchQuery, setSearchQuery] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [globalSearch, { data: searchResults, isLoading }] =
        useLazyGlobalSearchQuery()

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim()) {
                handleSearch(searchQuery)
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchQuery])

    const handleSearch = async (query: string) => {
        if (!query.trim()) return

        setError(null)

        try {
            await globalSearch(query).unwrap()
        } catch (err) {
            setError('An error occurred while searching')
            console.error(err)
        }
    }

    return {
        searchResults,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        handleSearch,
    }
}
