import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { RootState } from '@/redux/store'
import {
    setIsPlaying,
    setCurrentTime,
    setDuration,
    playNext,
    playPrevious,
    playTrack,
    setQueue,
    setCurrentTrackIndex,
} from '../slice'
import { useGetTrackByIdQuery } from '@/modules/tracks/api'
import {
    useGetCurrentTrackQuery,
    useGetQueueQuery,
    useSetCurrentTrackMutation,
    useClearQueueMutation,
    useAddTrackMutation,
    useAddPlaylistMutation,
} from '@/modules/queue/api'
import { useAddFavoriteTrackMutation } from '@/modules/favorites/api'
import { toast } from 'sonner'
import { sidebarEvents } from '@/lib/utils'

export function usePlayerQueue() {
    const dispatch = useDispatch()
    const { data: currentTrackData, refetch: refetchCurrentTrack } =
        useGetCurrentTrackQuery()
    const { data: queueData, refetch: refetchQueue } = useGetQueueQuery()
    const [setCurrentTrackApi] = useSetCurrentTrackMutation()
    const [clearQueueApi] = useClearQueueMutation()
    const [addTrackToQueueApi] = useAddTrackMutation()
    const [addPlaylistToQueueApi] = useAddPlaylistMutation()
    const [addFavoriteTrackApi] = useAddFavoriteTrackMutation()

    const currentTrack = currentTrackData?.track
    const queue = queueData?.tracks || []
    const currentIndex = queueData?.current_index ?? 0
    const { data: trackData } = useGetTrackByIdQuery(currentTrack?.id || 0, {
        skip: !currentTrack,
    })

    const setCurrentTrack = async (trackId: number) => {
        await setCurrentTrackApi(trackId).unwrap()
        refetchCurrentTrack()
        refetchQueue()
    }
    const clearQueue = () => clearQueueApi()
    const addTrackToQueue = (trackId: number) => addTrackToQueueApi(trackId)
    const addPlaylistToQueue = (playlistId: number) => {
        addPlaylistToQueueApi(playlistId)
            .unwrap()
            .then(() => {
                toast.success('Playlist added to queue')
            })
            .catch((error) => {
                console.error('Failed to add playlist to queue:', error)
                toast.error('Failed to add playlist to queue')
            })
    }
    const addFavoriteTrack = (trackId: number) => addFavoriteTrackApi(trackId)

    const handleAddToFavorite = () => {
        if (!currentTrack) return
        addFavoriteTrack(currentTrack.id)
        toast.success('Added to favorite')
    }

    const handleDownload = () => {
        const url = `http://localhost:8000/api/tracks/${currentTrack?.id}/download/`
        window.open(url, '_blank')
    }

    const getCoverImage = () => {
        if (!trackData) return null
        return (
            trackData.cover ||
            (trackData.album && trackData.album.cover) ||
            trackData.album_cover ||
            null
        )
    }

    const toggleQueueVisibility = () => {
        sidebarEvents.toggleQueue()
    }

    return {
        currentTrack,
        queue,
        currentIndex,
        trackData,
        setCurrentTrack,
        clearQueue,
        addTrackToQueue,
        addPlaylistToQueue,
        addFavoriteTrack,
        handleAddToFavorite,
        handleDownload,
        getCoverImage,
        toggleQueueVisibility,
    }
}
