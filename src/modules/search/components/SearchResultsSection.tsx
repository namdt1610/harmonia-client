import { useTranslations } from 'next-intl'
import TrackItem from '@/modules/tracks/components/TrackItem'
import { PlaylistItem } from '@/modules/playlists/components/PlaylistItem'
import { Track } from '@/types'

interface SearchResultsSectionProps {
    title: string
    items: any[]
    type: 'tracks' | 'artists' | 'albums' | 'playlists'
}

export default function SearchResultsSection({
    title,
    items,
    type,
}: SearchResultsSectionProps) {
    const t = useTranslations('Search')

    if (!items || items.length === 0) return null

    const renderItem = (item: any) => {
        switch (type) {
            case 'tracks':
                return (
                    <TrackItem
                        track={item}
                        showArtist={true}
                        showAlbum={true}
                        titleComponent={
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: item.title,
                                }}
                            />
                        }
                    />
                )
            case 'artists':
                return (
                    <TrackItem
                        track={item}
                        showArtist={false}
                        showAlbum={false}
                        titleComponent={
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: item.name,
                                }}
                            />
                        }
                    />
                )
            case 'albums':
                return <PlaylistItem playlist={item} onPlay={() => {}} />
            case 'playlists':
                return <PlaylistItem playlist={item} onPlay={() => {}} />
            default:
                return null
        }
    }

    return (
        <div className="mb-8">
            {/* Section Header */}
            <h3 className="text-lg font-semibold mb-4 text-neutral-200 border-b border-neutral-800 pb-2">
                {title} ({items.length})
            </h3>

            {/* Section Items */}
            <div className="space-y-2">
                {items.map((item) => (
                    <div key={item.id}>{renderItem(item)}</div>
                ))}
            </div>
        </div>
    )
}
