import { Plus, Heart, Library, Search } from 'lucide-react'
import CreatePlaylistModal from '@/modules/playlist/components/CreatePlaylistModal'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { cn } from '@/lib/clsx'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface PlaylistSectionProps {
    isCollapsed: boolean
}

export default function PlaylistSection({ isCollapsed }: PlaylistSectionProps) {
    const t = useTranslations('Playlists')
    const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] =
        useState(false)
    const [filterText, setFilterText] = useState('')

    // Mock data for playlists - in a real app, this would come from API
    const playlists = [
        { id: 1, name: 'Daily Mix 1', color: 'from-blue-500 to-blue-700' },
        {
            id: 2,
            name: 'Your Top Songs 2024',
            color: 'from-purple-500 to-indigo-700',
        },
        {
            id: 3,
            name: 'Discover Weekly',
            color: 'from-green-500 to-emerald-700',
        },
        { id: 4, name: 'Release Radar', color: 'from-red-500 to-pink-700' },
        { id: 5, name: 'Chill Mix', color: 'from-orange-500 to-amber-700' },
        { id: 6, name: 'Dance Vibes', color: 'from-teal-500 to-cyan-700' },
        { id: 7, name: 'Classic Rock', color: 'from-gray-500 to-gray-700' },
        {
            id: 8,
            name: 'Jazz Classics',
            color: 'from-yellow-500 to-yellow-700',
        },
    ]

    const filteredPlaylists = playlists.filter((playlist) =>
        playlist.name.toLowerCase().includes(filterText.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full">
            {/* Library Header */}
            <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Library
                        className={cn(
                            'h-5 w-5 text-neutral-400',
                            !isCollapsed && 'mr-1'
                        )}
                    />
                    {!isCollapsed && (
                        <span className="font-semibold text-sm text-neutral-400">
                            {t('yourLibrary', { fallback: 'Your Library' })}
                        </span>
                    )}
                </div>

                {!isCollapsed && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full hover:bg-neutral-800"
                                    onClick={() =>
                                        setIsCreatePlaylistModalOpen(true)
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>Create Playlist</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>

            {/* Search filter - only when expanded */}
            {!isCollapsed && (
                <div className="px-4 py-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
                        <Input
                            placeholder="Search in Your Library"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            className="pl-8 h-9 bg-neutral-800/60 border-neutral-700 text-sm"
                        />
                    </div>
                </div>
            )}

            {/* Playlists */}
            <ScrollArea className="flex-1 px-2 py-2">
                <div className="space-y-1 mb-2">
                    {/* Fixed items at top */}
                    <Link
                        href="/favorites/tracks"
                        className="flex items-center p-2 rounded-md hover:bg-neutral-800/60 transition-colors"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-purple-700 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                            <Heart
                                className={cn(
                                    'text-white',
                                    isCollapsed ? 'h-5 w-5' : 'h-4 w-4'
                                )}
                            />
                        </div>
                        {!isCollapsed && (
                            <div>
                                <p className="text-sm font-medium">
                                    Liked Songs
                                </p>
                                <p className="text-xs text-neutral-400">
                                    Playlist
                                </p>
                            </div>
                        )}
                    </Link>

                    <button
                        className="w-full flex items-center p-2 rounded-md hover:bg-neutral-800/60 transition-colors"
                        onClick={() => setIsCreatePlaylistModalOpen(true)}
                    >
                        <div className="w-10 h-10 bg-neutral-800 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                            <Plus
                                className={cn(
                                    'text-white',
                                    isCollapsed ? 'h-5 w-5' : 'h-4 w-4'
                                )}
                            />
                        </div>
                        {!isCollapsed && (
                            <div>
                                <p className="text-sm font-medium">
                                    Create Playlist
                                </p>
                                <p className="text-xs text-neutral-400">New</p>
                            </div>
                        )}
                    </button>
                </div>

                {/* Divider */}
                <div className="h-px bg-neutral-800 my-2"></div>

                {/* User playlists */}
                <div className="space-y-1">
                    {filteredPlaylists.map((playlist) => (
                        <Link
                            key={playlist.id}
                            href={`/playlists/${playlist.id}`}
                            className="flex items-center p-2 rounded-md hover:bg-neutral-800/60 transition-colors"
                        >
                            <div
                                className={cn(
                                    'w-10 h-10 rounded-md flex items-center justify-center mr-3 bg-gradient-to-br flex-shrink-0',
                                    playlist.color
                                )}
                            >
                                {isCollapsed ? (
                                    <p className="text-xs font-bold text-white">
                                        {playlist.name.substring(0, 2)}
                                    </p>
                                ) : (
                                    <p className="text-xs font-bold text-white">
                                        {playlist.name.substring(0, 1)}
                                    </p>
                                )}
                            </div>
                            {!isCollapsed && (
                                <p className="text-sm truncate">
                                    {playlist.name}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            </ScrollArea>

            <CreatePlaylistModal
                isOpen={isCreatePlaylistModalOpen}
                onClose={() => setIsCreatePlaylistModalOpen(false)}
            />
        </div>
    )
}
