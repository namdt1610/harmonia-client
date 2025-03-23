import { Plus, Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface PlaylistSectionProps {
    isCollapsed: boolean
}

export default function PlaylistSection({ isCollapsed }: PlaylistSectionProps) {
    const t = useTranslations('Playlists')

    // Mock data for playlists
    const playlists = [
        { id: 1, name: 'Liked Songs' },
        { id: 2, name: 'Your Top Songs 2024' },
        { id: 3, name: 'Discover Weekly' },
        { id: 4, name: 'Release Radar' },
        { id: 5, name: 'Chill Mix' },
    ]

    return (
        <div className="mt-4 px-2">
            <div className="p-3 mb-2 space-y-4">
                <button className="flex items-center hover:text-white text-neutral-400">
                    <div className="w-8 h-8 bg-neutral-300 rounded-sm flex items-center justify-center mr-3">
                        <Plus size={20} className="text-black" />
                    </div>
                    <span
                        className={`transition-all duration-200 ${
                            isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                        }`}
                    >
                        {t('createPlaylist', { fallback: 'Create Playlist' })}
                    </span>
                </button>
                <button className="flex items-center hover:text-white text-neutral-400">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-700 to-neutral-400 rounded-sm flex items-center justify-center mr-3">
                        <Heart size={16} className="text-white" />
                    </div>
                    <span>{t('likedSongs', { fallback: 'Liked Songs' })}</span>
                </button>
            </div>

            {/* Playlist list */}
            <div className="mt-4 border-t border-neutral-800 pt-4 max-h-[calc(100vh-350px)] overflow-y-auto">
                <ul className="space-y-1 px-3">
                    {playlists.map((playlist) => (
                        <li key={playlist.id}>
                            <a
                                href="#"
                                className="block py-2 text-sm text-neutral-400 hover:text-white"
                            >
                                {playlist.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
