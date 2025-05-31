import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
    Volume2,
    VolumeX,
    SkipBack,
    Play,
    Pause,
    SkipForward,
} from 'lucide-react'
import DefaultCover from '@/public/images/default-cover.webp'
import { Track } from '@/types'
import { useState } from 'react'

interface CurrentlyPlayingSectionProps {
    currentTrack: Track | null
    artistName?: string
    onPlayPause?: () => void
    onNext?: () => void
    onPrevious?: () => void
    onVolumeChange?: (volume: number) => void
    isPlaying?: boolean
    progress?: number
    volume?: number
}

export const CurrentlyPlayingSection = ({
    currentTrack,
    artistName,
    onPlayPause,
    onNext,
    onPrevious,
    onVolumeChange,
    isPlaying = false,
    progress = 0,
    volume = 100,
}: CurrentlyPlayingSectionProps) => {
    const t = useTranslations('HomePage')
    const [isMuted, setIsMuted] = useState(false)

    if (!currentTrack) return null

    const handleVolumeToggle = () => {
        setIsMuted(!isMuted)
        onVolumeChange?.(isMuted ? volume : 0)
    }

    return (
        <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                    {t('currentTrack', {
                        fallback: 'Currently Playing',
                    })}
                </h2>
            </div>

            <Card className="bg-gradient-to-br from-neutral-800 to-neutral-900 border-none overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="rounded-md overflow-hidden w-40 h-40 flex-shrink-0 shadow-lg relative group">
                            <Image
                                src={currentTrack?.cover || DefaultCover}
                                alt={currentTrack?.title || ''}
                                width={160}
                                height={160}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30"
                                    onClick={onPlayPause}
                                >
                                    {isPlaying ? (
                                        <Pause className="w-6 h-6" />
                                    ) : (
                                        <Play className="w-6 h-6" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                                <div className="text-sm text-green-400 mb-1">
                                    {t('nowPlaying', {
                                        fallback: 'NOW PLAYING',
                                    })}
                                </div>
                                <h3 className="text-3xl text-green-400 font-bold">
                                    {currentTrack?.title || ''}
                                </h3>
                                <p className="text-xl text-neutral-300">
                                    {artistName || ''}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Slider
                                        value={[progress]}
                                        max={100}
                                        step={1}
                                        className="flex-1"
                                    />
                                    <span className="text-sm text-neutral-400">
                                        {Math.floor(progress)}%
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={onPrevious}
                                        >
                                            <SkipBack className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={onPlayPause}
                                        >
                                            {isPlaying ? (
                                                <Pause className="w-5 h-5" />
                                            ) : (
                                                <Play className="w-5 h-5" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={onNext}
                                        >
                                            <SkipForward className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleVolumeToggle}
                                        >
                                            {isMuted ? (
                                                <VolumeX className="w-5 h-5" />
                                            ) : (
                                                <Volume2 className="w-5 h-5" />
                                            )}
                                        </Button>
                                        <Slider
                                            value={[isMuted ? 0 : volume]}
                                            max={100}
                                            step={1}
                                            className="w-24"
                                            onValueChange={([value]) =>
                                                onVolumeChange?.(value)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
