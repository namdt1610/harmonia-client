'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Download, User } from 'lucide-react'

interface SidebarProps {
    locale: string
}

export default function Sidebar({ locale }: SidebarProps) {
    const [width, setWidth] = useState(256)
    const MIN_WIDTH = 0
    const MAX_WIDTH = 700
    const isDragging = useRef(false) // useRef dùng để lưu trữ trạng thái kéo chuột
    const startX = useRef(0)
    const startWidth = useRef(width)

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
        const delta = event.clientX - startX.current
        setWidth(
            Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth.current - delta))
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

    return (
        <div className="relative flex h-screen">
            {/* Sidebar */}
            <div
                className="bg-black h-screen flex flex-col relative transition-all duration-300 ease-out"
                style={{ width }}
            >
                {/* Logo */}
                <div className="p-6">
                    <Link href={`/${locale}`} className="block">
                        <Image
                            src="/images/spotify-logo.png"
                            alt="Spotify"
                            width={130}
                            height={40}
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Main navigation */}

                {/* Playlists section */}

                {/* Bottom section */}
                <div className="mt-auto p-6">
                    <a
                        href="#"
                        className="flex items-center text-sm text-neutral-400 hover:text-white mb-6"
                    >
                        <Download size={16} className="mr-2" />
                        <span>Install App</span>
                    </a>
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center mr-2">
                            <User size={16} />
                        </div>
                        <span className="font-medium">User Name</span>
                    </div>
                </div>

                {/* Thanh kéo */}
                <div
                    className="absolute top-0 left-0 h-full w-2 bg-gray-700 cursor-ew-resize"
                    onMouseDown={handleMouseDown}
                />
            </div>
        </div>
    )
}
