'use client'

import DetailHeader from '@/components/shared/DetailHeader'
import TrackList from '@/modules/tracks/components/TrackList'
import { useTranslations } from 'next-intl'
import { Album } from '@/types'

type Props = {
    album: Album
}

export const metadata = {
    title: 'Album Details',
    description: 'Album details page',
}

export const AlbumDetails = ({ album }: Props) => {
    const t = useTranslations('AlbumPage')

    return (
        <div>
            <DetailHeader
                title={t('album')}
                coverImage="/images/default-cover.webp"
                type={t('album') as 'artist' | 'album' | 'playlist' | 'track'}
            />
            <TrackList tracks={album?.tracks || []} />
        </div>
    )
}
