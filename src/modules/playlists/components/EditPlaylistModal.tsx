import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Modal from '@/components/shared/Modal'

interface EditPlaylistModalProps {
    isOpen: boolean
    currentName: string
    onSave: (newName: string) => void
    onClose: () => void
}

export default function EditPlaylistModal({
    isOpen,
    currentName,
    onSave,
    onClose,
}: EditPlaylistModalProps) {
    const [name, setName] = useState(currentName)

    const handleSave = () => {
        if (name.trim() && name.trim() !== currentName) {
            onSave(name.trim())
        } else {
            onClose()
        }
    }

    const handleCancel = () => {
        setName(currentName) // Reset to original name
        onClose()
    }

    // Reset name when modal opens with new currentName
    if (isOpen && name !== currentName) {
        setName(currentName)
    }

    return (
        <Modal
            trigger={<div />} // Empty trigger since we're using controlled state
            title="Edit playlist"
            open={isOpen}
            onOpenChange={(open) => !open && handleCancel()}
            showCloseButton={false}
        >
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="playlist-name">Playlist name</Label>
                    <Input
                        id="playlist-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter playlist name"
                        maxLength={100}
                        autoFocus
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleSave}
                        disabled={!name.trim() || name.trim() === currentName}
                    >
                        Save
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
