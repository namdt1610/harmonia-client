'use client'
import { useGetArtistsQuery } from '@/modules/artist/api'
import FetchWrapper from '@/components/FetchWrapper'

export default function ArtistsPage() {
    const { data: artists, isLoading, isError, error } = useGetArtistsQuery()

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Artists</h1>
            <FetchWrapper
                isLoading={isLoading}
                isError={isError}
                error={error}
                data={artists}
            >
                <ul className="space-y-2">
                    {artists?.map((artist) => (
                        <li
                            key={artist.id}
                            className="p-2 bg-gray-100 rounded-md"
                        >
                            {artist.name}
                        </li>
                    ))}
                </ul>
            </FetchWrapper>
        </div>
    )
}
