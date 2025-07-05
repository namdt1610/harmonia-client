'use client'

import { useEffect, useCallback } from 'react'
import { usePlayTrackActivityMutation } from '@/modules/tracks/api'
import { useAppSelector } from '@/redux/hooks'

interface UsePlayTrackerProps {
    trackId?: number
    isPlaying?: boolean
    onPlayStart?: () => void
}

export const usePlayTracker = ({
    trackId,
    isPlaying,
    onPlayStart,
}: UsePlayTrackerProps = {}) => {
    const [playTrackActivity] = usePlayTrackActivityMutation()
    const { user } = useAppSelector((state) => state.auth)

    const trackPlay = useCallback(
        async (trackIdToTrack: number) => {
            if (!user || !trackIdToTrack) return

            try {
                await playTrackActivity(trackIdToTrack).unwrap()

                // Call the optional callback
                onPlayStart?.()
            } catch (error) {
                console.error('Failed to track play:', error)
            }
        },
        [playTrackActivity, user, onPlayStart]
    )

    // Auto-track when play state changes
    useEffect(() => {
        if (isPlaying && trackId) {
            trackPlay(trackId)
        }
    }, [isPlaying, trackId, trackPlay])

    return {
        trackPlay,
        isTracking: false, // Could add loading state if needed
    }
}

// Utility function to manually track plays
export const trackMusicPlay = async (trackId: number, userId: number) => {
    try {
        const response = await fetch('/api/admin_api/track-play/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
                track_id: trackId,
                user_id: userId,
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to track play')
        }

        return await response.json()
    } catch (error) {
        console.error('Error tracking play:', error)
        throw error
    }
}
