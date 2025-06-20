import { useTranslations } from 'next-intl'

interface SearchHeaderProps {
    searchQuery: string
    currentSort: { sortBy?: string; order?: string }
}

export default function SearchHeader({
    searchQuery,
    currentSort,
}: SearchHeaderProps) {
    const t = useTranslations('SearchResults')

    return (
        <div>
            <h1 className="text-2xl font-bold mb-2">
                {t('title', { fallback: 'Search results' })}
            </h1>
            {searchQuery && (
                <p className="text-neutral-400 text-sm">
                    {t('searchingFor', { fallback: 'Searching for' })}: &ldquo;
                    {searchQuery}&rdquo;
                    {!currentSort.sortBy && (
                        <span className="ml-2 text-xs bg-neutral-800 px-2 py-1 rounded">
                            {t('defaultSort', {
                                fallback: 'Sorted by relevance (default)',
                            })}
                        </span>
                    )}
                </p>
            )}
            <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-4">
                    {t('discoverMusic', { fallback: 'Discover Music' })}
                </h2>
                <p className="text-neutral-400 max-w-md mx-auto">
                    Search for your favorite tracks, artists, albums, and
                    playlists. Find your next favorite song with our powerful
                    search engine.
                </p>
            </div>
        </div>
    )
}
