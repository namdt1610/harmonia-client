export interface Artist {
    id: string
    name: string
    bio?: string
    avatar?: string // URL của ảnh đại diện
}

export interface Album {
    id: string
    title: string
    artist: Artist // Tham chiếu đến Artist
    release_date: string // YYYY-MM-DD
    cover?: string // URL của ảnh bìa album
}

export interface Track {
    id: number
    title: string
    album?: Album | null // Có thể null nếu track không thuộc album nào
    artist: Artist // Tham chiếu đến Artist
    file: string // URL file nhạc
    cover?: string // URL của ảnh bìa track
    lyrics?: string // Lời bài hát
    duration: number // Thời gian (giây)
    created_at: string // Timestamp
}

export interface Playlist {
    id: string
    user: number // ID user sở hữu playlist
    name: string
    tracks: Track[] // Danh sách track trong playlist
}

export interface User {
    id: number
    username: string
    email: string
    password: string
    avatar?: string // URL của ảnh đại diện
    playlists: Playlist[] // Danh sách playlist của user
    liked_tracks: Track[] // Danh sách track được thích
    created_at: string // Timestamp
    updated_at: string // Timestamp
}