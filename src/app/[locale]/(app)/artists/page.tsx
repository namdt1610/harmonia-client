'use client'
import { useGetAllArtistsQuery } from '@/modules/artists/api'
import FetchWrapper from '@/components/shared/FetchWrapper'
import { useTranslations } from 'next-intl'

export const metadata = {
    title: 'Artists',
    description: 'Artists page',
}

export const ArtistsPage = () => {
    const t = useTranslations('ArtistsPage')
    const { data: artists, isLoading, isError, error } = useGetAllArtistsQuery()

    return (
        <>
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
        </>
    )
}
