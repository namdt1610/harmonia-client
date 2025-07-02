import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

interface CreatePlaylistButtonProps {
    onClick?: () => void
    variant?: 'default' | 'icon'
}

export function CreatePlaylistButton({
    onClick,
    variant = 'default',
}: CreatePlaylistButtonProps) {
    if (variant === 'icon') {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white border-neutral-700"
                            onClick={onClick}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Create Playlist</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return (
        <Button
            onClick={onClick}
            className="bg-neutral-200 text-black hover:bg-white transition-colors"
        >
            <Plus className="h-4 w-4 mr-2" />
            Create Playlist
        </Button>
    )
}
