import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetUserActivityQuery } from '@/modules/activity/api'
import { useGetPublicPlaylistsQuery } from '@/modules/playlists/api'
import { useGetArtistQuery } from '@/modules/artists/api'
import { usePlayerQueue } from '@/modules/player/hooks/usePlayerQueue'
import { setCurrentTrack } from '@/modules/player/slice'
import { RootState } from '@/redux/store'

export const useHomePage = () => {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user)
    const { currentTrack, addPlaylistToQueue } = usePlayerQueue()
    const { data: artist } = useGetArtistQuery(currentTrack?.artist)
    const { data: userActivity } = useGetUserActivityQuery()
    const {
        data: playlists,
        isLoading: isLoadingPlaylists,
        error: playlistsError,
    } = useGetPublicPlaylistsQuery({ user: 'admin' })

    useEffect(() => {
        if (currentTrack) {
            dispatch(setCurrentTrack(currentTrack.id))
        }
    }, [currentTrack, dispatch])

    const getGreeting = () => {
        const currentHour = new Date().getHours()
        if (currentHour >= 5 && currentHour < 12) {
            return 'goodMorning'
        } else if (currentHour >= 12 && currentHour < 18) {
            return 'goodAfternoon'
        }
        return 'goodEvening'
    }

    return {
        user,
        currentTrack,
        artist,
        userActivity,
        playlists,
        isLoadingPlaylists,
        playlistsError,
        addPlaylistToQueue,
        getGreeting,
    }
}
