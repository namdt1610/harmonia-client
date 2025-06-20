'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/clsx'
import QueuePanel from '@/modules/queue/components/QueuePanel'
import { useIsMobile } from '@/components/ui/use-mobile'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { ListMusic } from 'lucide-react'

interface RightSidebarProps {
    isOpen: boolean
    onClose: () => void
}

export default function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
    const t = useTranslations('RightSidebar')
    const isMobile = useIsMobile()

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

    // Resize handlers for desktop only
    const handleMouseDown = (event: React.MouseEvent) => {
        if (isTransitioning || isMobile) return // Prevent resizing during transitions or on mobile
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

    // Mobile version using Sheet
    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <SheetContent
                    side="right"
                    className="w-full sm:w-[400px] max-w-full p-0 bg-black border-l border-neutral-800/50 shadow-2xl overflow-hidden"
                >
                    <SheetHeader className="p-4 border-b border-neutral-800/50 bg-neutral-950/50 flex-shrink-0">
                        <div className="flex items-center justify-between min-w-0">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="p-1.5 bg-primary/10 rounded-lg flex-shrink-0">
                                    <ListMusic
                                        size={16}
                                        className="text-primary"
                                    />
                                </div>
                                <SheetTitle className="text-base font-semibold text-white truncate">
                                    {t('queue', { fallback: 'Queue' })}
                                </SheetTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="h-8 w-8 hover:bg-neutral-800 text-neutral-400 hover:text-white flex-shrink-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </SheetHeader>

                    {/* Use the full-featured QueuePanel component */}
                    <div className="flex-1 overflow-hidden w-full max-w-full">
                        <QueuePanel showHeader={false} />
                    </div>
                </SheetContent>
            </Sheet>
        )
    }

    // Desktop version with resizable width
    return (
        <div
            className={cn(
                'relative h-screen flex-shrink-0 transition-all hidden lg:block',
                isTransitioning ? 'duration-300 ease-out' : 'duration-0'
            )}
            style={{ width: `${width}px`, maxWidth: `${width}px` }}
        >
            <aside
                ref={sidebarRef}
                className={cn(
                    'h-full flex flex-col bg-black border-l border-neutral-800/50 w-full max-w-full shadow-xl overflow-hidden',
                    isTransitioning
                        ? 'transition-all duration-300 ease-out'
                        : ''
                )}
            >
                <div className="p-4 border-b border-neutral-800/50 bg-neutral-950/30 flex-shrink-0">
                    <div className="flex items-center justify-between min-w-0">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-1.5 bg-primary/10 rounded-lg flex-shrink-0">
                                <ListMusic size={16} className="text-primary" />
                            </div>
                            <h2 className="text-base font-semibold text-white truncate">
                                {t('queue', { fallback: 'Queue' })}
                            </h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8 hover:bg-neutral-800 text-neutral-400 hover:text-white flex-shrink-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Use the full-featured QueuePanel component with width */}
                <div className="flex-1 overflow-hidden w-full max-w-full">
                    <QueuePanel showHeader={false} sidebarWidth={width} />
                </div>
            </aside>

            {/* Resize handle - only on desktop */}
            <div
                className={cn(
                    'absolute top-0 left-0 h-full w-3 cursor-ew-resize z-20',
                    'hover:bg-primary/10 active:bg-primary/20 transition-colors',
                    isDragging.current && 'bg-primary/20',
                    isTransitioning && 'pointer-events-none' // Disable during transitions
                )}
                onMouseDown={handleMouseDown}
            />
        </div>
    )
}
