export const ROUTES = {
    //* Auth
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',

    //* Home
    HOME: '/',

    //* Admin
    ADMIN: '/admin',

    //* Error
    FORBIDDEN: '/403',
}

export const API_ROUTES = {
    //* API
    API_URL: process.env.NEXT_PUBLIC_API_URL,

    //* Django
    AUTH: {
        LOGIN: '/auth/login/',
        REGISTER: '/auth/register/',
        LOGOUT: '/auth/logout/',
        REFRESH: '/auth/token/refresh/',
        CURRENT_USER: '/auth/me/',
        FORGOT_PASSWORD: '/auth/forgot-password/',
        RESET_PASSWORD: '/auth/reset-password/',
        GOOGLE_LOGIN: '/auth/google/',
    },
    ACTIVITIES: {
        GET_ALL: '/activities/',
        GET_BY_ID: '/activities/:id/',
    },
    ALBUMS: {
        GET_ALL: '/albums/',
        GET_BY_ID: '/albums/:id/',
        GET_BY_ARTIST: '/albums/:artistId/',
    },
    ARTISTS: {
        GET_ALL: '/artists/',
        GET_BY_ID: '/artists/:id/',
    },
    FAVORITES: {
        TRACKS: {
            GET_ALL: '/favorites/tracks/',
            ADD: '/favorites/tracks/:id/',
            REMOVE: '/favorites/tracks/:id/',
        },
        ALBUMS: {
            GET_ALL: '/favorites/albums/',
            ADD: '/favorites/albums/:id/',
            REMOVE: '/favorites/albums/:id/',
        },
        PLAYLISTS: {
            GET_ALL: '/favorites/playlists/',
            ADD: '/favorites/playlists/:id/',
            REMOVE: '/favorites/playlists/:id/',
        },
        ARTISTS: {
            GET_ALL: '/favorites/artists/',
            ADD: '/favorites/artists/:id/',
            REMOVE: '/favorites/artists/:id/',
        },
    },
    GENRES: {
        GET_ALL: '/genres/',
        GET_BY_ID: '/genres/:id/',
    },
    PLAYLISTS: {
        GET_ALL: '/playlists/',
        GET_BY_ID: '/playlists/:id/',
        PUBLIC: '/playlists/public/',
        FEATURED: '/playlists/featured',
        ADD_TRACK: '/playlists/:id/add-track/:trackId/',
    },
    QUEUES: {
        CURRENT: '/queue/current-queue/',
        CURRENT_TRACK: '/queue/current-track/',
        ADD_TRACK: '/queue/add-track/:id/',
        ADD_PLAYLIST: '/queue/add-playlist/:id/',
        ADD_ALBUM: '/queue/add-album/:id/',
        REMOVE_TRACK: '/queue/remove-track/:id/',
    },
    SEARCH: {
        GLOBAL: '/search/',
    },
    TRACKS: {
        GET_ALL: '/tracks/',
        GET_BY_ID: '/tracks/:id/',
        CURRENT: '/tracks/current-track/',
        TRENDING: '/tracks/trending/',
        RECENT: '/tracks/recent/',
        BY_GENRE: '/tracks/by_genre/:id',
        STREAM: '/tracks/:id/stream/',
        VIDEO: '/tracks/:id/video/',
        DOWNLOAD_VIDEO: '/tracks/:id/download_video/',
        PLAY: '/tracks/:id/play/',
    },
    UPLOADS: {
        TRACK: '/upload-tracks/upload/',
    },
    USERS: {
        GET_ALL: '/users/',
        GET_BY_ID: '/users/:id/',
        ME: '/users/me/',
        AVATAR: '/users/me/avatar/',
        PLAYLISTS: '/users/playlists/',
        CURRENT_TRACK: '/users/me/current-track/',
    },
}
