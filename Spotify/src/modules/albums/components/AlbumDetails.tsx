import DetailHeader from '@/components/shared/DetailHeader'
import TrackList from '@/modules/tracks/components/TrackList'
import React from 'react'
import { useGetAlbumByIdQuery } from '@/modules/albums/api'
import { useRouter } from 'next/router'

export default function AlbumDetails() {
    const router = useRouter()
    const { id } = router.query
    const { data: album } = useGetAlbumByIdQuery(Number(id))
    return (
        <div>
            <DetailHeader
                title="Album"
                coverImage="/images/default-cover.webp"
                type="album"
            />
            <TrackList tracks={album?.tracks || []} />
        </div>
    )
}
