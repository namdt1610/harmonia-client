export interface Artist {
    id: number
    name: string
    bio?: string
    avatar: string // URL của ảnh đại diện
    genres?: string[] // Danh sách thể loại nhạc
}

export interface Album {
    id: number
    title: string
    artist: Artist // Tham chiếu đến Artist
    release_date: string // YYYY-MM-DD
    cover: string // URL của ảnh bìa album
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
    is_favorite: boolean
    music_video?: string
}

export interface Playlist {
    id: number
    userId: number // ID user sở hữu playlist
    name: string
    tracks: Track[] // Danh sách track trong playlist
    cover?: string // URL của ảnh bìa playlist
    creator: User
    tracks_count?: number // Số lượng track trong playlist
}

export interface User {
    id: number
    username: string
    display_name: string
    email: string
    password: string
    avatar?: string // URL của ảnh đại diện
    playlists: Playlist[] // Danh sách playlist của user
    liked_tracks: Track[] // Danh sách track được thích
    created_at: string // Timestamp
    updated_at: string // Timestamp
}
