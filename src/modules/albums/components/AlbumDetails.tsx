'use client'
import DetailHeader from '@/components/shared/DetailHeader'
import TrackList from '@/modules/tracks/components/TrackList'
import React from 'react'
import { useGetAlbumByIdQuery } from '@/modules/albums/api'
import { useParams } from 'next/navigation'

export default function AlbumDetails() {
    const params = useParams()
    const id = params.id as string
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
