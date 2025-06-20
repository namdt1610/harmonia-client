'use client'

import React from 'react'
import { Play, MoreHorizontal, Trash, Heart, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/clsx'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DetailHeaderProps {
    title: string
    subtitle?: string
    coverImage: string
    type: 'playlist' | 'album' | 'artist' | 'track'
    tracks?: Track[]
    onPlay?: () => void
    onDelete?: () => void
    onEdit?: () => void
    onToggleFavorite?: () => void
    isFavorite?: boolean
}

export default function DetailHeader({
    title,
    subtitle,
    coverImage,
    type,
    tracks = [],
    onPlay,
    onDelete,
    onEdit,
    onToggleFavorite,
    isFavorite = false,
}: DetailHeaderProps) {
    return (
        <div className="flex gap-4 mb-8">
            <div className="w-32 h-32 flex-shrink-0">
                <Image
                    src={coverImage}
                    alt={title}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-medium mb-1">{title}</h1>
                <p className="text-sm text-neutral-500 mb-3">{subtitle}</p>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={tracks.length === 0}
                        onClick={onPlay}
                        className="px-3"
                    >
                        <Play size={14} className="mr-1" />
                        Play
                    </Button>
                    {onToggleFavorite && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onToggleFavorite}
                            className={cn(
                                'px-2',
                                isFavorite
                                    ? 'text-destructive hover:text-destructive/80'
                                    : 'text-neutral-500 hover:text-destructive'
                            )}
                        >
                            <Heart className="text-destructive" />
                        </Button>
                    )}
                    {(onDelete || onEdit) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="px-2"
                                >
                                    <MoreHorizontal size={14} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {onEdit && (
                                    <DropdownMenuItem
                                        onClick={onEdit}
                                        className="text-blue-500"
                                    >
                                        <Edit size={14} className="mr-2" />
                                        Edit {type}
                                    </DropdownMenuItem>
                                )}
                                {onDelete && (
                                    <DropdownMenuItem
                                        onClick={onDelete}
                                        className="text-red-500"
                                    >
                                        <Trash size={14} className="mr-2" />
                                        Delete {type}
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </div>
    )
}
