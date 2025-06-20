'use client'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Track } from '@/types'
import React from 'react'
import { useSearchControls } from '../hooks/useSearchControls'
import SearchControlBar from './SearchControlBar'
import SearchPagination from './SearchPagination'
import SearchHeader from './SearchHeader'
import SearchResultsSection from './SearchResultsSection'

interface SearchResults {
    tracks: Track[]
    artists: any[]
    albums: any[]
    playlists: any[]
    total_results: number
    page: number
    total_pages: number
}

interface SearchResultsProps {
    searchResults: SearchResults | null
    searchQuery: string
    isLoading: boolean
    error: string | null
    onSortChange: (sortBy?: string, order?: string) => void
    onPageChange: (page: number) => void
    onLimitChange: (limit: string) => void
    currentSort: { sortBy?: string; order?: string }
    currentLimit: string
}

export default function SearchResults({
    searchResults,
    searchQuery,
    isLoading,
    error,
    onSortChange,
    onPageChange,
    onLimitChange,
    currentSort,
    currentLimit,
}: SearchResultsProps) {
    const t = useTranslations('SearchResults')

    // Use custom hook for search controls logic
    const {
        sortOptionsList,
        limitOptionsList,
        getCurrentSortValue,
        getCurrentLimitValue,
        handleSortChange,
        handleLimitChange,
        handlePageChange,
    } = useSearchControls({
        currentSort,
        currentLimit,
        onSortChange,
        onLimitChange,
        onPageChange,
    })

    // Early returns for loading and error states
    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto py-8 px-4">
                <p className="text-destructive text-center mb-4">{error}</p>
            </div>
        )
    }

    // No results state
    if (searchResults?.total_results === 0) {
        return (
            <div className="container mx-auto py-8 px-4">
                <SearchHeader
                    searchQuery={searchQuery}
                    currentSort={currentSort}
                />
                <p className="text-center text-neutral-400 mt-8">
                    {t('noResults', { fallback: 'No results found' })}
                </p>
            </div>
        )
    }

    // Check if we have any results (tracks, artists, albums, or playlists)
    const hasResults =
        searchResults &&
        ((searchResults.tracks && searchResults.tracks.length > 0) ||
            (searchResults.artists && searchResults.artists.length > 0) ||
            (searchResults.albums && searchResults.albums.length > 0) ||
            (searchResults.playlists && searchResults.playlists.length > 0))

    return (
        <div className="container mx-auto py-8 px-4 mb-96">
            {/* Header */}
            <SearchHeader searchQuery={searchQuery} currentSort={currentSort} />

            {hasResults && (
                <>
                    {/* Control Bar */}
                    <div className="my-6">
                        <SearchControlBar
                            sortOptionsList={sortOptionsList}
                            limitOptionsList={limitOptionsList}
                            currentSortValue={getCurrentSortValue}
                            currentLimitValue={getCurrentLimitValue}
                            onSortChange={handleSortChange}
                            onLimitChange={handleLimitChange}
                        />
                    </div>

                    {/* Search Results Sections */}
                    <div className="space-y-6">
                        <SearchResultsSection
                            title={t('tracks', { fallback: 'Tracks' })}
                            items={searchResults.tracks || []}
                            type="tracks"
                        />

                        <SearchResultsSection
                            title={t('artists', { fallback: 'Artists' })}
                            items={searchResults.artists || []}
                            type="artists"
                        />

                        <SearchResultsSection
                            title={t('albums', { fallback: 'Albums' })}
                            items={searchResults.albums || []}
                            type="albums"
                        />

                        <SearchResultsSection
                            title={t('playlists', { fallback: 'Playlists' })}
                            items={searchResults.playlists || []}
                            type="playlists"
                        />
                    </div>

                    {/* Pagination */}
                    <SearchPagination
                        currentPage={searchResults.page}
                        totalPages={searchResults.total_pages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    )
}
