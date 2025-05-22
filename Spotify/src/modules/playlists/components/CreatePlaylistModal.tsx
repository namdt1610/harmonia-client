import React, { useState } from 'react'
import Modal from '../../../components/shared/Modal'
import { useCreatePlaylistMutation } from '@/modules/playlists/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
    PlusCircle,
    Music,
    Loader2,
    ImagePlus,
    Trash,
    Globe,
    Lock,
} from 'lucide-react'
import { cn } from '@/lib/clsx'
import Image from 'next/image'

interface CreatePlaylistModalProps {
    isOpen: boolean
    onClose: () => void
}

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isPublic, setIsPublic] = useState(true)
    const [coverImage, setCoverImage] = useState<string | null>(null)
    const [createPlaylist, { isLoading }] = useCreatePlaylistMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            // In a real implementation, this would include description, privacy setting, and cover image
            await createPlaylist(name).unwrap()
            resetForm()
            toast.success('Playlist created successfully')
            onClose()
        } catch (error) {
            console.error('Failed to create playlist:', error)
            toast.error('Failed to create playlist')
        }
    }

    const resetForm = () => {
        setName('')
        setDescription('')
        setIsPublic(true)
        setCoverImage(null)
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setCoverImage(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setCoverImage(null)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Playlist">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cover Image */}
                    <div className="col-span-1">
                        <div
                            className={cn(
                                'aspect-square w-full rounded-md overflow-hidden relative border border-dashed border-neutral-700 bg-neutral-800/50',
                                coverImage
                                    ? 'border-none'
                                    : 'flex flex-col items-center justify-center'
                            )}
                        >
                            {coverImage ? (
                                <>
                                    <div className="w-12 h-12 rounded-md overflow-hidden">
                                        <Image
                                            src={coverImage}
                                            alt={name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="destructive"
                                        className="absolute right-2 top-2 h-8 w-8 rounded-full opacity-90"
                                        onClick={removeImage}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <ImagePlus className="h-10 w-10 text-neutral-400 mb-2" />
                                    <p className="text-sm text-neutral-400">
                                        Upload cover image
                                    </p>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className={cn(
                                    'absolute inset-0 opacity-0 cursor-pointer',
                                    coverImage && 'pointer-events-none'
                                )}
                            />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        {/* Playlist Name */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Music className="h-5 w-5 text-primary" />
                                <Label
                                    htmlFor="name"
                                    className="text-base font-medium"
                                >
                                    Playlist Name
                                </Label>
                            </div>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-10 bg-background/50 backdrop-blur-sm border-neutral-700 focus:border-primary"
                                placeholder="Enter playlist name"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-sm font-medium text-neutral-300"
                            >
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="resize-none h-24 bg-background/50 backdrop-blur-sm border-neutral-700 focus:border-primary"
                                placeholder="Add an optional description"
                            />
                        </div>

                        {/* Privacy Setting */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                                {isPublic ? (
                                    <Globe className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Lock className="h-4 w-4 text-amber-500" />
                                )}
                                <Label
                                    htmlFor="public-switch"
                                    className="text-sm cursor-pointer select-none"
                                >
                                    {isPublic
                                        ? 'Public playlist'
                                        : 'Private playlist'}
                                </Label>
                            </div>
                            <Switch
                                id="public-switch"
                                checked={isPublic}
                                onCheckedChange={setIsPublic}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center gap-3 pt-2 border-t border-neutral-800">
                    <Button
                        type="button"
                        onClick={() => {
                            resetForm()
                            onClose()
                        }}
                        variant="ghost"
                        className="text-neutral-400 hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading || !name.trim()}
                        className="gap-2 px-6"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <PlusCircle className="h-4 w-4" />
                                Create Playlist
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default CreatePlaylistModal
