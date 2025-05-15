'use client'
import { clsx } from 'clsx'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { ReactNode, useState } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { usePlayTrack } from '@/modules/music/hooks/usePlayTrack'

import TopBar from './TopBar'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSibebar'
import PlayerBar from '@/modules/player/components/PlayerBar'
import TrackItem from '@/modules/music/components/TrackItem'

const inter = Inter({ subsets: ['latin'] })

type Props = {
    children: ReactNode
    locale: string
    messages: any
}

interface SearchResults {
    albums: any[]
    artists: any[]
    playlists: any[]
    tracks: any[]
}

export default function BaseLayout({ children, locale, messages }: Props) {
    const [searchResults, setSearchResults] = useState<SearchResults | null>(
        null
    )

    const handleSearchResults = (results: SearchResults) => {
        setSearchResults(results)
    }

    const { playTrack } = usePlayTrack()

    return (
        <NextIntlClientProvider
            timeZone="Asia/Ho_Chi_Minh"
            locale={locale}
            messages={messages}
        >
            {/* <Navigation /> */}
            <div
                className={clsx(
                    'h-screen flex flex-col bg-black text-white',
                    inter.className
                )}
            >
                {/* TopBar */}
                <TopBar onSearchResults={handleSearchResults} />

                {/* Main content */}
                <main className="flex-1 overflow-hidden flex flex-row">
                    <LeftSidebar locale={locale} />

                    <div className="flex-1 overflow-auto">
                        {searchResults ? (
                            Object.values(searchResults).every(
                                (value) =>
                                    Array.isArray(value) && value.length === 0
                            ) ? (
                                <div className="p-4 text-center text-neutral-400">
                                    No results found. Try searching for
                                    something else.
                                </div>
                            ) : (
                                <div className="p-4">
                                    {Object.entries(searchResults).map(
                                        ([key, results]) => (
                                            <div key={key} className="mb-6">
                                                <h3 className="text-lg font-bold capitalize mb-2">
                                                    {key}
                                                </h3>
                                                {results.map(
                                                    (
                                                        result: any,
                                                        index: any
                                                    ) => (
                                                        <TrackItem
                                                            key={
                                                                result.id ||
                                                                index
                                                            }
                                                            track={result}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            )
                        ) : (
                            children
                        )}
                    </div>

                    <RightSidebar locale={locale} />
                </main>

                {/* Player bar */}
                    <PlayerBar />
            </div>
        </NextIntlClientProvider>
    )
}
