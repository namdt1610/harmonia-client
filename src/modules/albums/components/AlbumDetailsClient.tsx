'use client'

import { useGetAlbumQuery } from '@/modules/albums/api'
import { AlbumDetails } from '@/modules/albums/components/AlbumDetails'
import { Album } from '@/types'
import DetailHeader from '@/components/shared/DetailHeader'

interface AlbumDetailsClientProps {
    albumId: number
    initialAlbum: Album | null
    translations: {
        album: string
    }
}

export function AlbumDetailsClient({
    albumId,
    initialAlbum,
    translations,
}: AlbumDetailsClientProps) {
    // RTK Query với initial data từ SSR
    const {
        data: album,
        isLoading,
        error,
    } = useGetAlbumQuery(albumId, {
        skip: !albumId,
        // Use SSR data as initial data for instant rendering
        ...(initialAlbum && {
            selectFromResult: ({ data, ...rest }) => ({
                data: data || initialAlbum,
                ...rest,
            }),
        }),
    })

    if (isLoading && !initialAlbum) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-neutral-400">Loading album...</div>
            </div>
        )
    }

    if (error && !initialAlbum) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-red-400">Failed to load album</div>
            </div>
        )
    }

    const albumData = album || initialAlbum

    if (!albumData) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-neutral-400">Album not found</div>
            </div>
        )
    }

    return (
        <>
            <DetailHeader
                title={albumData.title}
                subtitle={albumData.artist.name}
                coverImage={albumData.image || '/images/default-cover.webp'}
                type="album"
                description={`${albumData.tracks?.length || 0} tracks`}
            />
            <AlbumDetails album={albumData as Album} />
        </>
    )
}
