'use client'

import { useParams } from 'next/navigation'
import { useGetTrackByIdQuery } from '@/modules/tracks/api'
import { useTranslations } from 'next-intl'
import { isValidTrackId } from '@/lib/invalidTrackHandler'
import { toast } from 'sonner'
import { useEffect } from 'react'

export const metadata = {
    title: 'Video',
    description: 'Video page',
}

export const PlayerVideo = ({ videoUrl }: { videoUrl: string }) => {
    const t = useTranslations('VideoPage')

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-black min-h-screen">
            <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full max-w-3xl rounded-lg shadow-lg"
            />
            <a
                href={videoUrl}
                download
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
                {t('download')}
            </a>
        </div>
    )
}

const VideoPage = () => {
    const t = useTranslations('VideoPage')
    const params = useParams() as { id: string }
    const trackId = Number(params.id)

    // Validate track ID from URL
    const isValidId = isValidTrackId(trackId)

    const { data: track, isLoading } = useGetTrackByIdQuery(trackId, {
        skip: !isValidId, // Skip API call if ID is invalid
    })

    // Show error for invalid ID
    useEffect(() => {
        if (!isValidId && trackId) {
            toast.error(
                `Invalid track ID ${trackId}. This track may have been removed.`
            )
        }
    }, [isValidId, trackId])

    if (!isValidId && trackId) {
        return (
            <div className="text-center text-destructive p-8">
                Invalid track ID {trackId}. This track may have been removed.
            </div>
        )
    }

    if (isLoading)
        return <div className="text-center text-white p-8">{t('loading')}</div>
    if (!track)
        return (
            <div className="text-center text-destructive p-8">
                {t('notFound')}
            </div>
        )
    if (!track.video)
        return (
            <div className="text-center text-muted-foreground p-8">
                {t('noVideo')}
            </div>
        )

    return <PlayerVideo videoUrl={track.video} />
}

// Add default export
export default VideoPage
