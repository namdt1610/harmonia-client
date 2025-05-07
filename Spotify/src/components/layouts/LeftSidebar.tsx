'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Download, User } from 'lucide-react'
import NavigationLinks from '@/components/shared/NavigationLinks'
import PlaylistSection from '@/components/shared/PlaylistSection'
import DefaulLogo from '@/assets/images/default-logo.png'

interface SidebarProps {
    locale: string
}

export default function Sidebar({ locale }: SidebarProps) {
    const [width, setWidth] = useState(256)
    const MIN_WIDTH = 90
    const MAX_WIDTH = 800
    const isDragging = useRef(false)
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
            Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth.current + delta))
        )
        /*
         * Cập nhật chiều rộng sidebar khi kéo chuột
         * Sử dụng Math.max và Math.min để đảm bảo chiều rộng nằm trong khoảng tối thiểu và tối đa
         * Nếu ko có Math.max và Math.min, chiều rộng có thể vượt quá giới hạn
         * startWidth.current + delta để tính toán chiều rộng mới
         */
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
                            src={DefaulLogo}
                            alt="Spotify"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Main navigation */}
                <NavigationLinks locale={locale} isCollapsed={width <= 100} />

                {/* Playlists section */}
                <PlaylistSection isCollapsed={width <= 100} />

                {/* Bottom section */}
                <div className="mt-auto p-14">
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
                    className="absolute top-0 right-0 h-full w-2 bg-gray-700 cursor-ew-resize"
                    onMouseDown={handleMouseDown}
                />
            </div>
        </div>
    )
}
