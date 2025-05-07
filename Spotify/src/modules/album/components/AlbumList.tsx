import { useAlbums } from '../hooks/useAlbums'
import AlbumItem from './AlbumItem'

export default function AlbumList({ artistId }: { artistId?: string }) {
    const { albums, isLoading, isError, error } = useAlbums({ artistId })

    if (isLoading) return <div>Đang tải albums...</div>
    if (isError) return <div>Lỗi: {JSON.stringify(error)}</div>
    if (!albums || albums.length === 0) return <div>Không có album nào.</div>

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {albums.map((album) => (
                <AlbumItem key={album.id} album={album} />
            ))}
        </div>
    )
}
