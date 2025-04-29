'use client'
import { useState } from 'react'
import { useGetTracksQuery } from '@/modules/music/api'

export function useTracks() {
    const [searchQuery, setSearchQuery] = useState('')
    const [error, setError] = useState<string | null>(null)

    const {
        data: tracks = [],
        isLoading,
        isError,
        refetch,
    } = useGetTracksQuery(searchQuery)

    const handleSearch = async (query: string) => {
        if (!query.trim()) return

        setSearchQuery(query)
        setError(null)

        try {
            await refetch()
            if (isError) {
                setError('An error occurred while searching tracks')
            }
        } catch (err) {
            setError('An error occurred while searching tracks')
            console.error(err)
        }
    }

    return {
        tracks,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        handleSearch,
    }
}
