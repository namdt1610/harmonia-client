'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import {
    Download,
    User,
    ListMusic,
    X,
    MoreHorizontal,
    Trash2,
    Play,
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import {
    setCurrentTrackIndex,
    setIsPlaying,
    removeFromQueue,
    clearQueue,
} from '@/modules/player/slice'
import { formatDuration, sidebarEvents } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import QueuePanel from '@/modules/queue/components/QueuePanel'
interface SidebarProps {
    locale: string
}

export default function RightSidebar({ locale }: SidebarProps) {
    const [width, setWidth] = useState(300)
    const [visible, setVisible] = useState(false)
    const MIN_WIDTH = 200
    const MAX_WIDTH = 500
    const isDragging = useRef(false)
    const startX = useRef(0)
    const startWidth = useRef(width)

    const dispatch = useDispatch()
    const { queue, currentTrackIndex, isPlaying } = useSelector(
        (state: RootState) => state.player
    )

    // Listen for sidebar toggle events
    useEffect(() => {
        const unsubscribe = sidebarEvents.on('toggle-queue', () => {
            setVisible((prev) => !prev)
        })

        return () => unsubscribe()
    }, [])

    const handleMouseDown = (event: React.MouseEvent) => {
        isDragging.current = true
        startX.current = event.clientX
        startWidth.current = width
        document.addEventListener('selectstart', preventSelection)
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (event: MouseEvent) => {
        if (!isDragging.current) return
        const delta = startX.current - event.clientX
        setWidth(
            Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth.current + delta))
        )
    }

    const handleMouseUp = () => {
        isDragging.current = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('selectstart', preventSelection)
    }

    const preventSelection = (event: Event) => {
        event.preventDefault()
    }

    const handleClose = () => {
        setVisible(false)
    }

    if (!visible) return null

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div
                className="relative h-screen flex flex-col transition-all duration-300 ease-out border-l right-0"
                style={{ width }}
            >
                {/* Handle for resizing */}
                <div
                    className="absolute top-0 left-0 h-full w-2 bg-transparent cursor-ew-resize z-10"
                    onMouseDown={handleMouseDown}
                />

                {/* Queue content */}
                <ScrollArea className="flex-1">
                    <QueuePanel />
                </ScrollArea>
            </div>
        </div>
    )
}
