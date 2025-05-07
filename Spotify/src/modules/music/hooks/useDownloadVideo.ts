import { useGetTrackVideoQuery } from '../api'

export function useDownloadVideo(trackId: number) {
  const { data: videoUrl, isLoading, error } = useGetTrackVideoQuery(trackId!, {
    skip: !trackId,
  })

  const downloadVideo = () => {
    if (videoUrl) {
      const a = document.createElement('a')
      a.href = videoUrl
      a.download = ''
      a.click()
    }
  }

  return { downloadVideo, isLoading, error }
}