'use client'

import { Artist } from '@/types'
import { useTranslations } from 'next-intl'

type Props = {
    artist: Artist
}

export const ArtistDetails = ({ artist }: Props) => {
    const t = useTranslations('ArtistPage')

    return (
        <>
            {artist && (
                <>
                    <h2 className="text-2xl font-bold mb-4">{t('artist')}</h2>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-semibold">{artist.name}</h3>
                        {artist.genres && artist.genres.length > 0 && (
                            <p className="text-sm text-gray-500">
                                {t('genres')}: {artist.genres.join(', ')}
                            </p>
                        )}
                    </div>
                </>
            )}
        </>
    )
}
