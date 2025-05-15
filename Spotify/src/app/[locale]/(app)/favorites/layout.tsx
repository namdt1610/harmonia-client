'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/clsx'
import { Heart, Music, Disc, Users, ListMusic } from 'lucide-react'

interface FavoritesLayoutProps {
    children: ReactNode
}

export default function FavoritesLayout({ children }: FavoritesLayoutProps) {
    const pathname = usePathname()

    const tabs = [
        {
            label: 'Tracks',
            href: '/favorites/tracks',
            icon: Music,
        },
        {
            label: 'Albums',
            href: '/favorites/albums',
            icon: Disc,
        },
        {
            label: 'Artists',
            href: '/favorites/artists',
            icon: Users,
        },
        {
            label: 'Playlists',
            href: '/favorites/playlists',
            icon: ListMusic,
        },
    ]

    return (
        <div className="container px-4 py-8">
            <div className="flex items-center gap-3 mb-6">
                <Heart className="h-6 w-6 text-pink-500" />
                <h1 className="text-2xl font-bold">Your Favorites</h1>
            </div>

            <div className="border-b mb-8">
                <nav className="flex -mb-px space-x-8">
                    {tabs.map((tab) => {
                        const isActive = pathname.endsWith(tab.href)
                        const Icon = tab.icon

                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    'flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors',
                                    isActive
                                        ? 'border-primary text-foreground'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/20'
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {children}
        </div>
    )
}
