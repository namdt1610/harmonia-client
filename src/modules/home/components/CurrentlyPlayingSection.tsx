import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import DefaultCover from '@/public/images/default-cover.webp'
import { Track } from '@/types'

interface CurrentlyPlayingSectionProps {
    currentTrack: Track | null
    artistName?: string
}

export const CurrentlyPlayingSection = ({
    currentTrack,
    artistName,
}: CurrentlyPlayingSectionProps) => {
    const t = useTranslations('HomePage')

    if (!currentTrack) return null

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
                {t('currentTrack', { fallback: 'Currently Playing' })}
            </h2>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 rounded-md overflow-hidden">
                                <Image
                                    src={currentTrack?.image || DefaultCover}
                                    alt={currentTrack?.title || ''}
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex-1 space-y-1">
                            <p className="text-sm text-muted-foreground">
                                {t('nowPlaying', { fallback: 'Now Playing' })}
                            </p>
                            <h3 className="text-lg font-medium">
                                {currentTrack?.title || ''}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {artistName || currentTrack?.artist?.name || ''}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
