'use client'
import { clsx } from 'clsx'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { ReactNode, useState } from 'react'

import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSibebar'
import TopBar from './TopBar'
import PlayerBar from '../app/features/player/components/PlayerBar'

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

    console.log('BaseLayout', searchResults)

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {/* <Navigation /> */}
            <div
                className={clsx(
                    'h-screen flex flex-col bg-black text-white',
                    inter.className
                )}
            >
                {/* TopBar */}
                <header>
                    <TopBar
                        locale={locale}
                        onSearchResults={handleSearchResults}
                    />
                </header>

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
                                                            className="p-2 border-b border-neutral-700"
                                                        >
                                                            {result.name}
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
