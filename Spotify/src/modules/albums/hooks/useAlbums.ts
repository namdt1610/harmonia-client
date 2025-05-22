import { useGetAllAlbumsQuery, useGetAlbumsByArtistQuery } from '../api'

interface UseAlbumsProps {
    artistId?: string // Nếu không truyền sẽ lấy toàn bộ album
}

export function useAlbums({ artistId }: UseAlbumsProps = {}) {
    const artistAlbumsQuery = useGetAlbumsByArtistQuery(Number(artistId || '0'))
    const allAlbumsQuery = useGetAllAlbumsQuery()

    const query = artistId ? artistAlbumsQuery : allAlbumsQuery
    const { data: albums, isLoading, isError, error, refetch } = query

    return { albums, isLoading, isError, error, refetch }
}
