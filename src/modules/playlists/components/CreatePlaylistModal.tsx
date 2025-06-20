import React, { useState } from 'react'
import { useCreatePlaylistMutation } from '@/modules/playlists/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Trash } from 'lucide-react'
import Image from 'next/image'
import Modal from '@/components/shared/Modal'
import {
    Form,
    FormMessage,
    FormDescription,
    FormControl,
    FormItem,
    FormLabel,
    FormField,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CreatePlaylistRequest } from '@/types'

interface CreatePlaylistModalProps {
    trigger?: React.ReactNode
    title?: string
    description?: string
    onPlaylistCreated?: (playlist: any) => void
}

export default function CreatePlaylistModal({
    trigger,
    title,
    description,
    onPlaylistCreated,
}: CreatePlaylistModalProps) {
    const [coverImage, setCoverImage] = useState<string | null>(null)
    const [createPlaylist, { isLoading }] = useCreatePlaylistMutation()

    const formSchema = z.object({
        name: z.string().min(1, 'Playlist name is required'),
        description: z.string().optional(),
        is_public: z.boolean().default(true),
        cover: z.string().optional(),
    })

    type FormData = z.infer<typeof formSchema>

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            is_public: true,
            cover: '',
        },
    })

    const onSubmit = async (data: FormData) => {
        try {
            const playlistData: CreatePlaylistRequest = {
                ...data,
                cover: coverImage || data.cover,
            }
            const newPlaylist = await createPlaylist(playlistData).unwrap()
            toast.success('Playlist created successfully')
            form.reset()
            setCoverImage(null)

            // Call the callback if provided
            if (onPlaylistCreated) {
                onPlaylistCreated(newPlaylist)
            }
        } catch (error) {
            console.error('Failed to create playlist:', error)
            toast.error('Failed to create playlist')
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setCoverImage(event.target?.result as string)
                form.setValue('cover', event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setCoverImage(null)
        form.setValue('cover', '')
    }

    const modalContent = (
        <ScrollArea className="max-h-[70vh] pr-4">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={form.control}
                        name="cover"
                        render={({ field: _field }) => (
                            <FormItem>
                                <FormLabel>Cover Image</FormLabel>
                                <FormControl>
                                    <div className="space-y-4">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                        {coverImage && (
                                            <div className="relative w-32 h-32">
                                                <Image
                                                    src={coverImage}
                                                    alt="Cover Image"
                                                    width={128}
                                                    height={128}
                                                    className="rounded-lg object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={removeImage}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Upload a cover image for your playlist
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Playlist Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter playlist name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Give your playlist a memorable name
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe your playlist (optional)"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Add a description to help others understand
                                    your playlist
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="is_public"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        Public Playlist
                                    </FormLabel>
                                    <FormDescription>
                                        Make this playlist visible to other
                                        users
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                form.reset()
                                setCoverImage(null)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create Playlist
                        </Button>
                    </div>
                </form>
            </Form>
        </ScrollArea>
    )

    return (
        <Modal
            trigger={trigger}
            title={title || 'Create New Playlist'}
            description={
                description ||
                'Create a new playlist to store your favorite songs'
            }
            showCloseButton={false}
        >
            {modalContent}
        </Modal>
    )
}
