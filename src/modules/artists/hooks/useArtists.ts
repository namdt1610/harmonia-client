// src/hooks/useArtists.ts
import { useGetAllArtistsQuery } from '../api'

export function useArtists() {
    const { data: artists, isLoading, isError, error } = useGetAllArtistsQuery()
    return { artists, isLoading, isError, error }
}
