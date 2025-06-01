import { ArtistDetails } from '@/modules/artists/components/ArtistDetails'
import { useTranslations } from 'next-intl'
import { Artist } from '@/types'
import { useParams } from 'next/navigation'
import { useGetArtistQuery } from '@/modules/artists/api'
import DetailHeader from '@/components/shared/DetailHeader'

export const metadata = {
    title: 'Artist Details',
    description: 'Artist details page',
}

export const ArtistPage = () => {
    const t = useTranslations('ArtistPage')
    const params = useParams()
    const id = params.id as string
    const { data: artist } = useGetArtistQuery(Number(id))
    // TODO: add top tracks, albums, related artists hooks

    return (
        <>
            <DetailHeader
                title={t('artist')}
                coverImage={artist?.avatar || '/images/default-cover.webp'}
                type="artist"
            />
            <ArtistDetails artist={artist as Artist} />
        </>
    )
}
