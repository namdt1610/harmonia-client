import { Button } from '@/components/ui/button'
import Modal from '@/components/shared/Modal'
import EditPlaylistModal from './EditPlaylistModal'

interface PlaylistModalsProps {
    // Delete Playlist Modal
    isDeletePlaylistDialogOpen: boolean
    onDeletePlaylist: () => void
    onCloseDeletePlaylistDialog: () => void

    // Remove Track Modal
    isRemoveTrackDialogOpen: boolean
    onRemoveTrack: () => void
    onCloseRemoveTrackDialog: () => void

    // Edit Playlist Modal
    isEditPlaylistDialogOpen: boolean
    currentPlaylistName: string
    onUpdatePlaylist: (newName: string) => void
    onCloseEditPlaylistDialog: () => void
}

export default function PlaylistModals({
    isDeletePlaylistDialogOpen,
    onDeletePlaylist,
    onCloseDeletePlaylistDialog,
    isRemoveTrackDialogOpen,
    onRemoveTrack,
    onCloseRemoveTrackDialog,
    isEditPlaylistDialogOpen,
    currentPlaylistName,
    onUpdatePlaylist,
    onCloseEditPlaylistDialog,
}: PlaylistModalsProps) {
    return (
        <>
            {/* Edit Playlist Modal */}
            <EditPlaylistModal
                isOpen={isEditPlaylistDialogOpen}
                currentName={currentPlaylistName}
                onSave={onUpdatePlaylist}
                onClose={onCloseEditPlaylistDialog}
            />

            {/* Delete Playlist Modal */}
            <Modal
                trigger={
                    <Button variant="destructive" size="sm" onClick={() => {}}>
                        Delete
                    </Button>
                }
                title="Delete playlist"
            >
                <div className="space-y-4">
                    <p className="text-sm text-neutral-600">
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={onDeletePlaylist}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onCloseDeletePlaylistDialog}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Remove Track Modal */}
            <Modal
                trigger={
                    <Button variant="destructive" size="sm" onClick={() => {}}>
                        Remove
                    </Button>
                }
                title="Remove track"
            >
                <div className="space-y-4">
                    <p className="text-sm text-neutral-600">
                        Remove this track from the playlist?
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={onRemoveTrack}
                        >
                            Remove
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onCloseRemoveTrackDialog}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
