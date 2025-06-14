'use client'

import { useTranslations } from 'next-intl'
import { usePlayerQueue } from '@/modules/player/hooks/usePlayerQueue'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useState, useRef } from 'react'
import { cn } from '@/lib/clsx'
import { Track } from '@/types'

interface QueueItem {
    track: Track
}

interface RightSidebarProps {
    isOpen: boolean
    onClose: () => void
}

export default function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
    const t = useTranslations('RightSidebar')
    const { currentTrack, queue } = usePlayerQueue()

    // Default sidebar states and constraints
    const [width, setWidth] = useState(280) // Default width
    const [isTransitioning, setIsTransitioning] = useState(false)
    const MIN_WIDTH = 100
    const MAX_WIDTH = 400

    // Resize handling
    const isDragging = useRef(false)
    const startX = useRef(0)
    const startWidth = useRef(width)
    const sidebarRef = useRef<HTMLDivElement>(null)

    // Resize handlers
    const handleMouseDown = (event: React.MouseEvent) => {
        if (isTransitioning) return // Prevent resizing during transitions
        isDragging.current = true
        startX.current = event.clientX
        startWidth.current = width
        document.documentElement.classList.add('cursor-ew-resize')
        document.addEventListener('selectstart', preventSelection)
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (event: MouseEvent) => {
        if (!isDragging.current) return
        const delta = startX.current - event.clientX // Inverted for right sidebar
        const newWidth = Math.max(
            MIN_WIDTH,
            Math.min(MAX_WIDTH, startWidth.current + delta)
        )
        setWidth(newWidth)
    }

    const handleMouseUp = () => {
        isDragging.current = false
        document.documentElement.classList.remove('cursor-ew-resize')
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('selectstart', preventSelection)

        // Add a short transition when snapping
        setIsTransitioning(true)

        // Snap to minimum width if close to it
        if (width < MIN_WIDTH + 30) {
            setWidth(MIN_WIDTH)
        }

        // Reset transitioning flag after animation
        setTimeout(() => {
            setIsTransitioning(false)
        }, 300)
    }

    const preventSelection = (event: Event) => {
        event.preventDefault()
    }

    if (!isOpen) return null

    return (
        <div
            className={cn(
                'relative h-screen flex-shrink-0 transition-all',
                isTransitioning ? 'duration-300 ease-out' : 'duration-0'
            )}
            style={{ width }}
        >
            <aside
                ref={sidebarRef}
                className={cn(
                    'h-full flex flex-col bg-black border-l border-neutral-800/50 w-full',
                    isTransitioning
                        ? 'transition-all duration-300 ease-out'
                        : ''
                )}
            >
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

                {/* Queue content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {queue.map((item: QueueItem, index: number) => (
                        <div
                            key={item.track.id}
                            className={cn(
                                'flex items-center gap-3 p-2 rounded-md hover:bg-neutral-800/50 cursor-pointer',
                                currentTrack?.id === item.track.id &&
                                    'bg-neutral-800/50'
                            )}
                        >
                            <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                    src={item.track.album_cover || ''}
                                    alt={item.track.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {item.track.title}
                                </p>
                                <p className="text-xs text-neutral-400 truncate">
                                    {item.track.artist?.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Resize handle - positioned at the left edge of the sidebar container */}
            <div
                className={cn(
                    'absolute top-0 left-0 h-full w-3 cursor-ew-resize z-20',
                    'hover:bg-primary/20 active:bg-primary/30',
                    isDragging.current && 'bg-primary/30',
                    isTransitioning && 'pointer-events-none' // Disable during transitions
                )}
                onMouseDown={handleMouseDown}
            />
        </div>
    )
}
