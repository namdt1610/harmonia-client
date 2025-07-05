export interface Artist {
    id: number
    name: string
    bio?: string
    image: string
    genres?: string[]
    tracks: Track[]
    albums: Album[]
}

export interface Genre {
    id: number
    name: string
}

export interface Album {
    id: number
    title: string
    artist: Artist
    release_date: string
    image: string
    tracks: Track[]
}

export interface Track {
    id: number
    title: string
    album?: Album | null
    artist: Artist
    file: string
    image?: string
    album_image?: string
    lyrics?: string
    duration: number
    created_at: string
    is_favorite: boolean
    video?: string
    explicit?: boolean
    genre?: Genre
    release_date: string
    play_count: number
}

export interface Playlist {
    id: number
    name: string
    tracks: Track[]
    cover?: string
    creator: User
    tracks_count?: number
    color?: string
    description?: string
    is_public?: boolean
}

export interface CreatePlaylistRequest {
    name: string
    description?: string
    is_public?: boolean
    cover?: string
}

export interface User {
    id: number
    username: string
    display_name: string
    email: string
    password: string
    image?: string
    playlists: Playlist[]
    liked_tracks: Track[]
    created_at: string
    updated_at: string
    is_superuser: boolean
}
