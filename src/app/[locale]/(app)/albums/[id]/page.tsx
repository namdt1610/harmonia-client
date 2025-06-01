import { useGetAlbumQuery } from '@/modules/albums/api'
import { AlbumDetails } from '@/modules/albums/components/AlbumDetails'
import { Album } from '@/types'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import DetailHeader from '@/components/shared/DetailHeader'

export const metadata = {
    title: 'Album',
    description: 'Album page',
}

export const AlbumDetailPage = () => {
    const t = useTranslations('AlbumPage')
    const params = useParams()
    const id = params.id as string
    const { data: album } = useGetAlbumQuery(Number(id))

    return (
        <>
            <DetailHeader
                title={t('album')}
                coverImage={album?.cover || '/images/default-cover.webp'}
                type={t('album') as 'artist' | 'album' | 'playlist' | 'track'}
            />
            <AlbumDetails album={album as Album} />
        </>
    )
}
