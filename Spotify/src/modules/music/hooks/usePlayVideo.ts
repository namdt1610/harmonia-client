import { useGetTrackVideoQuery } from '../api'

export function usePlayVideo(trackId: number) {
    // Nếu chưa có trackId thì skip query
    const {
        data: videoUrl,
        isLoading,
        error,
    } = useGetTrackVideoQuery(trackId!, {
        skip: !trackId,
    })

    return { videoUrl, isLoading, error }
}
