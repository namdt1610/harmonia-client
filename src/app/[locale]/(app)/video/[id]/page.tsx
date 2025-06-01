'use client'

import { useParams } from 'next/navigation'
import { useGetTrackByIdQuery } from '@/modules/tracks/api'
import { useTranslations } from 'next-intl'

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
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                {t('download')}
            </a>
        </div>
    )
}

export const VideoPage = () => {
    const t = useTranslations('VideoPage')
    const params = useParams() as { id: string }
    const { data: track, isLoading } = useGetTrackByIdQuery(Number(params.id))

    if (isLoading)
        return <div className="text-center text-white p-8">{t('loading')}</div>
    if (!track)
        return (
            <div className="text-center text-red-400 p-8">
                {t('notFound')}
            </div>
        )
    if (!track.video)
        return (
            <div className="text-center text-yellow-400 p-8">
                {t('noVideo')}
            </div>
        )

    return <PlayerVideo videoUrl={track.video} />
}
