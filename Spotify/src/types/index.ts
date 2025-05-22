export interface Artist {
    id: number
    name: string
    bio?: string
    avatar: string
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
    cover: string
    tracks: Track[]
}

export interface Track {
    id: number
    title: string
    album?: Album | null
    artist: Artist
    file: string
    cover?: string
    album_cover?: string
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
}

export interface User {
    id: number
    username: string
    display_name: string
    email: string
    password: string
    avatar?: string
    playlists: Playlist[]
    liked_tracks: Track[]
    created_at: string
    updated_at: string
    is_superuser: boolean
}
