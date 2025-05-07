import { useGetAllAlbumsQuery, useGetAlbumsByArtistQuery } from '../api'

interface UseAlbumsProps {
    artistId?: string // Nếu không truyền sẽ lấy toàn bộ album
}

export function useAlbums({ artistId }: UseAlbumsProps = {}) {
    // Nếu có artistId thì gọi albums theo artist, ngược lại lấy tất cả
    const query = artistId
        ? useGetAlbumsByArtistQuery(artistId)
        : useGetAllAlbumsQuery()

    const { data: albums, isLoading, isError, error, refetch } = query

    return { albums, isLoading, isError, error, refetch }
}
