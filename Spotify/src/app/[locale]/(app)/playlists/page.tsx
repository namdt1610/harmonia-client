'use client'
import { useGetUserPlaylistsQuery } from '@/modules/playlists/api'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Playlist } from '@/types'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import PlaylistItem from '@/modules/playlists/components/PlaylistsModal'
import CreatePlaylistModal from '@/modules/playlists/components/CreatePlaylistModal'
import { useState } from 'react'
export default function PlaylistsPage() {
    const { data: playlists, isLoading, error } = useGetUserPlaylistsQuery()
    const userId = useSelector((state: RootState) => state.auth.user?.id)
    console.log('Playlists of user Id: ', userId, playlists)
    const [isOpen, setIsOpen] = useState(false)

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return (
            <div>
                Error:{' '}
                {String((error as any)?.message) || 'Something went wrong'}
            </div>
        )
    }

    return (
        <div className="p-4">
            <CreatePlaylistModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Playlists</h1>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsOpen(true)}
                >
                    <Plus />
                </Button>
            </div>
            <div className="mt-4">
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {playlists?.results?.map((playlist: Playlist) => (
                        <PlaylistItem key={playlist.id} playlist={playlist} />
                    ))}
                </ul>
            </div>
        </div>
    )
}
