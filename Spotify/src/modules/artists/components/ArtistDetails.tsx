'use client'
import DetailHeader from '@/components/shared/DetailHeader'
import React from 'react'
import { useGetArtistByIdQuery } from '@/modules/artists/api'
import { useParams } from 'next/navigation'

export default function ArtistDetails() {
    const { id } = useParams<{ id: string }>()
    const { data: artist } = useGetArtistByIdQuery(Number(id))

    return (
        <div>
            <DetailHeader
                title={artist?.name || 'Artist'}
                coverImage={artist?.avatar || '/images/default-cover.webp'}
                type="artist"
            />
            {artist && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Top Tracks</h2>
                    {/* Ở đây có thể thêm danh sách track của artist nếu API trả về */}
                </div>
            )}
        </div>
    )
}
