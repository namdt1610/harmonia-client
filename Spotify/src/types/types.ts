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
    id: string
    title: string
    album?: Album | null // Có thể null nếu track không thuộc album nào
    artist: Artist // Tham chiếu đến Artist
    file: string // URL file nhạc
    duration: number // Thời gian (giây)
    created_at: string // Timestamp
}

export interface Playlist {
    id: string
    user: number // ID user sở hữu playlist
    name: string
    tracks: Track[] // Danh sách track trong playlist
}
