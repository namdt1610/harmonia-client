'use client'
import { useParams } from 'next/navigation'
import { useGetPlaylistByIdQuery } from '@/modules/playlist/api'
import { Track } from '@/types'
import TrackItem from '@/modules/music/components/TrackItem'

export default function PlaylistDetailPage() {
    const params = useParams()
    const playlistId = params?.id
    const {
        data: playlist,
        isLoading,
        error,
    } = useGetPlaylistByIdQuery(playlistId)
    console.log('Tracks in playlist:', playlist)

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div className="text-destructive">Error loading playlist.</div>
    }

    if (!playlist) {
        return <div className="text-muted-foreground">Playlist not found.</div>
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">{playlist.name}</h1>
            {playlist.tracks && playlist.tracks.length > 0 ? (
                <div className="space-y-4">
                    {playlist.tracks.map((track: Track) => (
                        <TrackItem key={track.id} track={track} />
                    ))}
                </div>
            ) : (
                <div className="text-muted-foreground">
                    No tracks in this playlist.
                </div>
            )}
        </div>
    )
}
