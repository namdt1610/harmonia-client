'use client'

import { useTranslations } from 'next-intl'
import { usePlayerQueue } from '@/modules/player/hooks/usePlayerQueue'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface RightSidebarProps {
    isOpen: boolean
    onClose: () => void
}

export default function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
    const t = useTranslations('RightSidebar')
    const { currentTrack } = usePlayerQueue()

    if (!isOpen) return null

    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-lg z-50">
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        {t('queue', { fallback: 'Queue' })}
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="p-4">
                {currentTrack ? (
                    <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                            {t('nowPlaying', { fallback: 'Now Playing' })}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-md overflow-hidden">
                                <img
                                    src={currentTrack.cover}
                                    alt={currentTrack.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="font-medium">
                                    {currentTrack.title}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {currentTrack.artist?.name}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        {t('emptyQueue', {
                            fallback: 'Your queue is empty',
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
