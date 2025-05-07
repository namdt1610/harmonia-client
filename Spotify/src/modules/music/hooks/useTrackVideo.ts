import { useGetTrackVideoQuery, useDownloadTrackVideoMutation } from '../api'
import { useCallback } from 'react'

export function useTrackVideo(trackId: number) {
    const {
        data: videoUrl,
        isLoading,
        error,
        refetch,
    } = useGetTrackVideoQuery(trackId, { skip: !trackId })

    const [
        downloadTrackVideo,
        { isLoading: isDownloading, error: downloadError },
    ] = useDownloadTrackVideoMutation()

    const handleDownload = useCallback(() => {
        if (trackId) downloadTrackVideo(trackId)
    }, [trackId, downloadTrackVideo])

    return {
        videoUrl,
        isLoading,
        error,
        refetch,
        handleDownload,
        isDownloading,
        downloadError,
    }
}
