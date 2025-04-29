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
import { Play } from 'lucide-react'

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
                <TopBar locale={locale} onSearchResults={handleSearchResults} />

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
                                                        <div
                                                            key={
                                                                result.id ||
                                                                index
                                                            }
                                                            className="p-2 border-b border-neutral-700 flex items-center justify-between"
                                                        >
                                                            <Link
                                                                href={`/${locale}/${key}/${result.id}`}
                                                            >
                                                                {result.name ||
                                                                    result.title}
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    playTrack(
                                                                        result
                                                                    )
                                                                }
                                                            >
                                                                {/* play icon */}
                                                                <Play
                                                                    size={16}
                                                                    fill="currentColor"
                                                                />
                                                            </button>
                                                        </div>
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
