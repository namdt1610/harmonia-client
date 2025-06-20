import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    useDeletePlaylistMutation,
    useRemoveTrackFromPlaylistMutation,
    useUpdatePlaylistMutation,
} from '@/modules/playlists/api'
import { usePlayerQueue } from '@/modules/player/hooks/usePlayerQueue'

export const usePlaylistDetail = (playlistId: number) => {
    const router = useRouter()
    const { addPlaylistToQueue } = usePlayerQueue()
    const [removePlaylist] = useDeletePlaylistMutation()
    const [removeTrackFromPlaylist] = useRemoveTrackFromPlaylistMutation()
    const [updatePlaylist] = useUpdatePlaylistMutation()

    // Modal states
    const [isDeletePlaylistDialogOpen, setIsDeletePlaylistDialogOpen] =
        useState(false)
    const [isRemoveTrackDialogOpen, setIsRemoveTrackDialogOpen] =
        useState(false)
    const [isEditPlaylistDialogOpen, setIsEditPlaylistDialogOpen] =
        useState(false)
    const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null)

    const handlePlay = () => {
        addPlaylistToQueue(playlistId)
    }

    const handleEdit = () => {
        setIsEditPlaylistDialogOpen(true)
    }

    const handleUpdatePlaylist = async (newName: string) => {
        try {
            await updatePlaylist({
                id: playlistId,
                name: newName,
            } as { id: number; name: string }).unwrap()
            setIsEditPlaylistDialogOpen(false)
            toast.success('Playlist updated successfully')
        } catch (error: any) {
            console.error('Error updating playlist:', error)
            toast.error('Failed to update playlist')
        }
    }

    const handlePlaylistDelete = async () => {
        try {
            await removePlaylist(playlistId)
            setIsDeletePlaylistDialogOpen(false)
            toast.success('Playlist deleted')
            router.push('/playlists')
        } catch (error: any) {
            toast.error('Failed to delete playlist')
        }
    }

    const handleRemoveTrackFromPlaylist = async () => {
        if (!selectedTrackId) return

        try {
            await removeTrackFromPlaylist({
                playlistId,
                trackId: selectedTrackId,
            }).unwrap()
            setIsRemoveTrackDialogOpen(false)
            setSelectedTrackId(null)
            toast.success('Track removed')
        } catch (error: any) {
            console.error('Error removing track:', error)

            if (error.status === 404) {
                toast.error('Remove track feature is currently unavailable')
            } else {
                toast.error('Failed to remove track')
            }
        }
    }

    const openRemoveTrackDialog = (trackId: number) => {
        setSelectedTrackId(trackId)
        setIsRemoveTrackDialogOpen(true)
    }

    const closeRemoveTrackDialog = () => {
        setIsRemoveTrackDialogOpen(false)
        setSelectedTrackId(null)
    }

    const closeEditPlaylistDialog = () => {
        setIsEditPlaylistDialogOpen(false)
    }

    return {
        // States
        isDeletePlaylistDialogOpen,
        isRemoveTrackDialogOpen,
        isEditPlaylistDialogOpen,
        selectedTrackId,

        // Actions
        handlePlay,
        handleEdit,
        handleUpdatePlaylist,
        handlePlaylistDelete,
        handleRemoveTrackFromPlaylist,
        openRemoveTrackDialog,
        closeRemoveTrackDialog,
        closeEditPlaylistDialog,
        setIsDeletePlaylistDialogOpen,
    }
}
